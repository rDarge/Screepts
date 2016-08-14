//Prototypes
require('util.creep')();

//Configuration imports
var roomConfigurations = require('config.rooms');

//Utilities
var energyManager = require('util.energyManager');
var keeperHarvesterUtil = require('util.keeperHarvester');

//Deprecated
var navigator = require('util.navigator');
// var roadBuilder = require('main.roadBuilder');
// var roadConstructor = require('util.roadConstructor');

module.exports.loop = function () {
    
    //Configurations
    var WALL_DEFENSE = 60000;
    var TOWER_SAFETY_BUFFFER = 500;
    var CREEP_DEATH_BUFFER = 100;
    
    //Labs
    var zLab = Game.getObjectById("57a404759c6ec19f1b0669b1")
    var oLab = Game.getObjectById("57a4d1c69f073e5c05e22c6c")
    var zoLab = Game.getObjectById("57a59a89adf97d367f548e7e")
    
    var roomMaps = roomConfigurations.rooms;
    
    var debugMessage = "";
    
    roomMaps.forEach(function(value, key, map) {
        try {
        //evaluate each room's configurations
        var thisName = value["name"];
        var thisRoom = value["room"];
        var thisSpawn = value["spawn"];
        var creepProfile = value["creeps"];
        var troopCount = "";
        var canCreateTroops = true;
        
        //Keeper harvesting logic happens before we decide what to spawn
        keeperHarvesterUtil.run(thisSpawn, "keeper_scout", "keeper_miner", "keeper_hauler");        
        
        //Link Logic
        var depositToThisLink = Game.getObjectById(value.link);
        var links = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
        links.forEach(link => { link.transferEnergy(depositToThisLink)});
        
        //Tower Snippet
        var towers          = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        var ramparts        = thisRoom.find(FIND_STRUCTURES, {filter: function(structure) { return ((structure.structureType == 'rampart') && structure.hits < WALL_DEFENSE);}}); 
        var repairThese     = thisRoom.find(FIND_STRUCTURES, {filter: function(structure) { 
                return  (structure.structureType == "constructedWall"   && structure.hits < WALL_DEFENSE) || 
                        (structure.structureType == 'road'              && structure.hits < structure.hitsMax - towers.length*800) || 
                        (structure.structureType == 'container'         && structure.hits < structure.hitsMax - towers.length*800);}});
        // console.log("there are " +repairThese.length + " things to repair!");
        var hostiles        = thisRoom.find(FIND_HOSTILE_CREEPS, {filter: function(hostile) { return hostile.getActiveBodyparts(ATTACK) + hostile.getActiveBodyparts(WORK) + hostile.getActiveBodyparts(RANGED_ATTACK) + hostile.getActiveBodyparts(HEAL) > 0;}});
        if(hostiles.length > 0) {
            thisSpawn.memory.crisis = true;
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${thisRoom}`);
            towers.forEach(tower => tower.attack(hostiles[0]));
        } else {
            thisSpawn.memory.crisis = false;
            if (ramparts.length > 0) {
                towers.forEach(tower => {
                    if(tower.energy > TOWER_SAFETY_BUFFFER) {
                        result = tower.repair(ramparts[0]);
                        console.log("Repairing "+ ramparts[0] + " resulting in " + result);
                    }
                });
            } 
            else 
            if(repairThese.length > 0) {
                towers.forEach(tower => {
                    if(tower.energy > TOWER_SAFETY_BUFFFER) {
                        result = tower.repair(repairThese[0]);
                        console.log("Repairing "+ repairThese[0] + " resulting in " + result);
                    }
                });
            } 
        }
        
        //Do creep actions
        creepProfile.forEach(function(record, index, collection) {
            
            troops = _.filter(Game.creeps, (creep) => creep.memory.role == record.role && creep.memory.room == thisRoom.name);
            
            //Diagnostic logs for creeps
            respawn_buffer = record.respawnTime ? record.respawnTime : CREEP_DEATH_BUFFER;
            healthyTroops = troops.filter((creep) => creep.ticksToLive > respawn_buffer || creep.ticksToLive == undefined);
            
            //Evaluate room-based calculated counts
            count = record.count;
            if(typeof count == "string") {
                //Convert it to the corresponding memory value
                count = thisSpawn.memory[count];
                // console.log(record.role + ": "+ count);
                if(count == undefined) {
                    count = 0;
                }
            }
            
            if(troops.length != count){
                //Log any inconsistencies in troop counts
                troopCount += record.role.toUpperCase() + ":(" + troops.length + "(" + (troops.length - healthyTroops.length)+" dying)/" + count + ") | ";
            }
            
            
            //Create creeps
            //console.log(record.role + " " + healthyTroops.length);
            if(healthyTroops.length < count) {
                if(canCreateTroops) {
                    spawns = thisRoom.find(FIND_MY_SPAWNS);
                    index = 0;
                    newCreepName = ERR_BUSY;
                    while(index < spawns.length && newCreepName < 0) {
                        newCreepName = spawns[index].createCreep(record.stats, undefined, {role: record.role});
                        index = index + 1;
                    }
                    //Enforce priority using this flag, if we've tried to create a creep we won't allow ourselves to make other, lower priority creeps
                    var newCreep = Game.creeps[newCreepName];
                    if(newCreep) {
                        newCreep.memory.room = thisRoom.name;
                    } else {
                        // console.log("   Trying to make a " + record.role + " in " + value.name + " but the spawn doesn't have enough energy.");
                    }
                    canCreateTroops = false;
                }
                //console.log("Preemptively respawning a creep" + result);
            }
            
            //Handle troop actions
            troops.forEach(function(troop, number, team) {
                
                //Update memory of creeps to maintain parity with defined memory
                //TODO get a cache so we don't waste cycles doing this every time
                if(record.memory) {
                    Object.keys(record.memory).forEach(function(value, index, collection) {
                        troop.memory[value] = record.memory[value];
                    });
                }
                
                //Handle troop behavior
                if(record.pickupBehavior || record.depositBehavior) {
                    //Use flag to determine when the creep is full
                    // console.log(troop.name + "carrying " + troop.carry.energy + " " + troop.memory.collecting);
                    if(troop.memory.collecting == undefined) {
                        troop.memory.collecting = true;
                        troop.memory.depositWaypointVisited = false;
                    }
                    
                    if(!troop.memory.collecting && troop.carry.energy == 0) {
                        troop.memory.collecting = true;
                        troop.memory.depositWaypointVisited = false;
                    }
                    if(troop.memory.collecting && troop.carryCapacity == _.sum(troop.carry) && troop.getActiveBodyparts(CARRY) > 0) {
                        troop.memory.collecting = false;
                    }
                    
                    try {
                       // console.log(troop.name);
                        if(troop.memory.collecting || !record.depositBehavior) {
                            //Temporary
                            troop.memory.depositWaypointVisited = false;
                           // console.log("picking up")
                           if(Array.isArray(record.pickupBehavior)) {
                                startIndex = 0;
                                while(record.pickupBehavior.length > startIndex && !record.pickupBehavior[startIndex].pickup(troop)) {
                                    startIndex ++;
                                }
                            } else {
                                record.pickupBehavior.pickup(troop);
                            }
                           // record.pickupBehavior.pickup(troop);
                        } else {
                            if(Array.isArray(record.depositBehavior)) {
                                startIndex = 0;
                                while(record.depositBehavior.length > startIndex && !record.depositBehavior[startIndex].deposit(troop)) {
                                    startIndex ++;
                                }
                            } else {
                                record.depositBehavior.deposit(troop);
                            }
                            
                           // console.log(troop.name + " performed " + record.depositBehavior[startIndex].name + " task!");
                        }
                    } catch (err) {
                        console.log(troop.name + troop.pos + err);
                    }
                    
                } else {
                    //old
                    if(!record.free && troop.room.name != thisRoom.name) {
                        // console.log(troop.name + " is lost in " + troop.pos);
                        navigator.run(troop, thisRoom)
                    } else {
                        record.action.run(troop);
                    }
                }
                
                
                if(troop.ticksToLive < CREEP_DEATH_BUFFER){
                    if(healthyTroops.length == count) {
                        troop.say("I'm ready to die");
                    } else {
                        troop.say("I'm dying!");
                        // troop.memory.role = 'obsolete';
                    }
                } else if (healthyTroops.length > count && number == 0) {
                    //Obsolete creeps that are not accounted for :(
                    troop.say("I'm extra!");
                    troop.memory.role = 'obsolete';
                } else if (troop.room.find(FIND_HOSTILE_CREEPS).length > 0 && troop.pos.roomName != troop.memory.room) {
                    troop.say("Oh shit!");
                    troop.memory.role = 'obsolete';
                }
            }); //End of troop loop
        });
        if(troopCount == "") {
            troopCount = " Looking good!";
        }
        
        debugMessage += thisName + " statistics: " + troopCount + "\n";
        } catch (err) {
            console.log(err);
        }
    });
    
    //Lab testing stuff here:
    zoLab.runReaction(zLab,oLab);
    
    if(Game.time % 5 === 0) {
        console.log("[======================TICK " + Game.time + " ========================]");
        console.log(debugMessage);
        energyManager.calculate(roomMaps);
        console.log("[=====================END TICK " + Game.time + " =====================]");
    }
    
    
    // Fancy Roadbuilder Logic
    // if(Game.spawns.Spawn1.memory.positions == undefined) {
    //     Game.spawns.Spawn1.memory.positions = new Map();
    // }
    // var positions = Game.spawns.Spawn1.memory.positions;
    // Object.keys(positions).forEach(function(position) {
    //     if(positions[position] > 10000 && positions[position] != -1) {
    //         x = parseInt(position.split("|")[0]);
    //         y = parseInt(position.split("|")[1]);
    //         console.log("trying to make a road at position " + x + " " + y);
    //         success = Game.rooms.W11N47.createConstructionSite(x, y, STRUCTURE_ROAD);
    //         if(success == 0 || success == -7) {
    //             positions[position] = -1;
    //             console.log("successfully created road");
    //         } else {
    //             positions[position] -= 4;
    //             console.log("couldn't make road! " + success);
    //         }
    //     }
    // });
}