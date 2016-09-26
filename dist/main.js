/*TODO 
1. Send out agents to kill keepers in remote mining rooms
2. Mine Keeper Rooms more effectively
3. Utilize Minerals better

test

*/

//Setting up some cool stuff here
require('util.cpu')();
require('util.creep')();
require('config.roles.creepBuilder')();
require('config.roles.roomBuilder')();
require('util.roomManagement')();

CPU_PROFILING = false;

//Room configurations
var roomConfigurations = require('config.rooms');

//Utilities
var energyManager = require('util.energyManager');
var keeperHarvesterUtil = require('util.keeperHarvester');

//Deprecated
// var roadBuilder = require('main.roadBuilder');
// var roadConstructor = require('util.roadConstructor');

module.exports.loop = function () {

    //Clean up dead creeps
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }    
    
    //Configurations
    var WALL_DEFENSE = 60000;
    var TOWER_SAFETY_BUFFFER = 500;
    var CREEP_DEATH_BUFFER = 100;
    var STATUS_REPORT_INTERVAL = 450;
    var SHORT_REPORT_INTERVAL = 20;
    
    //Labs
    var zLab = Game.getObjectById("57a404759c6ec19f1b0669b1")
    var oLab = Game.getObjectById("57a4d1c69f073e5c05e22c6c")
    var zoLab = Game.getObjectById("57a59a89adf97d367f548e7e")
    
    var roomMaps = roomConfigurations();
    
    Memory["amountCache"] = {};
    var debugMessage = "";
    
    roomMaps.forEach(function(value, key, map) {
        try {
            //evaluate each room's configurations
            var thisName = value["name"];
            var thisRoom = value["room"];
            var thisSpawn = value["spawn"];
            var creepProfile = value["creeps"];
            var towerMinWallDefense = value["towerDefense"] ? value["towerDefense"] : WALL_DEFENSE;
            var troopCount = "";
            var canCreateTroops = true;
            
            //Keeper harvesting logic happens before we decide what to spawn
            // keeperHarvesterUtil.run(thisSpawn, "keeper_scout", "keeper_miner", "keeper_hauler");        
            
            //Link Logic
            printUsage("Updating links in  " + thisRoom.name, function() {
                updateLinks(thisRoom, value.link)
            });
            
            //Tower Snippet
            printUsage("Updating towers in " + thisRoom.name, function() {
                updateTowers(thisRoom, thisSpawn, towerMinWallDefense);
            });

            //Do creep actions
            printUsage("Updating creeps in " + thisRoom.name, function() {
                troopCount = updateCreeps(thisRoom, thisSpawn, creepProfile);
            });
            
            //Log statistics 
            printUsage("Stat collection in " + thisRoom.name, function () {
                debugMessage += roomStatusReport(thisRoom, thisName, troopCount, value, creepProfile);
            });

        } catch (err) {
            console.log(err);
        }
    });
    
    //Lab testing stuff here:
    zoLab.runReaction(zLab,oLab);
    
    if(Game.time % STATUS_REPORT_INTERVAL === 0) {
        var statusReport = "[======================TICK " + Game.time + " ========================]\n";
        statusReport += debugMessage;

        statusReport += "Status Report By Rooms:\n";

        var keys = ["harvested  ",
                    "skipped_harvesting",
                    // "dropped    ",
                    // "scavenged  ",
                    "stored     ",
                    "creeped   ",
                    "deposited  ",
                    "constructed",
                    "repaired   ",
                    // "towered    ",
                    // "linked     ",
                    // "containered"
                    ];

        var roomReport = "Room\t"
        keys.forEach(function(key) {
            roomReport += key.substr(0,4).toUpperCase() + "\t";
        })

        var totals = {};

        Object.keys(Memory["cached_rooms"]).forEach(function(key){
            record = Memory["cached_rooms"][key];

            if(!record["stats"]){
                record["stats"] = {
                    "creep": {
                        "harvested":      0,
                        "dropped":        0,
                        "scavenged":      0,
                        "stored":         0,
                        "creeped":       0,
                        "deposited":      0,
                        "constructed":    0,
                        "repaired":       0,
                        "towered":        0,
                        "linked":         0,
                        "containered":    0,
                    },

                    "tower": {
                        "repaired":   0,
                        "healed":     0,
                        "attacked":   0,
                    }
                };
            }

            //Print status report
            if(_.sum(record["stats"]["creep"]) > 0 ) {
                roomReport += "\n" + key + "\t";
                keys.forEach(function(key) {
                    var amount = record["stats"]["creep"][key.trim()]
                    if(amount > 0) {
                        roomReport += amount;
                    }
                    roomReport += "\t";
                    if(totals[key] == null) {
                        totals[key] = 0;
                    }
                    totals[key] += amount;

                    // Clear out memory
                    record["stats"]["creep"][key.trim()] = 0;
                })
            }

            
        });
        roomReport += "\nTotal\t"
        Object.keys(totals).forEach(function(key) {
            roomReport += totals[key] + "\t";
        })

        statusReport += roomReport;
        statusReport += "\n[=====================END TICK " + Game.time + " =====================]";
        console.log(statusReport);

        //Batch emails to the mothership
        Game.notify(debugMessage);
        Game.notify(roomReport);
    } else  if(Game.time % SHORT_REPORT_INTERVAL === 0) {
        console.log("Interim report:\n" + debugMessage);
    }
}