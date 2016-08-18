
//Old roles
var agent = require('role.agent');
var obsolete = require('role.obsolete');

//new atomic behaviors
var pickupSource = require('role.pickup.source');
var pickupStructure = require('role.pickup.structure');
var pickupEnergy = require('role.pickup.energy');

var depositSpawn = require('role.deposit.spawn');
var depositStructure = require('role.deposit.structure');
var depositController = require('role.deposit.controller');
var depositConstruction = require('role.deposit.construction');
var depositRepair = require('role.deposit.repair');
var depositStationary = require('role.deposit.stationary');

var warClaimer = require('role.war.claimer');
var warToughGuy = require('role.war.toughGuy');
var warHealer = require('role.war.healer');
var warWallBreaker = require('role.war.wallBreaker');
var warMurderer = require('role.war.murderer');
var warKeeperScout = require('role.war.keeperScout');
var warKeeperKiller = require('role.war.keeperKiller');

//Labs
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.war.wallBreaker');
 * mod.thing == 'a thing'; // true
 */

var thisRoom = Game.rooms.W13N46;
var thisSpawn = Game.spawns.Spawn2;

var droppedEnergy = thisRoom.find(FIND_DROPPED_ENERGY);
 
room = {
    configuration: {
        name: "Satellite",
        room: thisRoom,
        spawn: thisSpawn,
        link: "579c95c256b4053c0f1736c7",
        creeps: [
            {
                role: 'backupHarvester',
                count: 1,
                stats: [WORK,CARRY,MOVE],
                pickupBehavior: [pickupStructure,pickupSource],
                depositBehavior: [depositSpawn],
                memory: {
                    pickupSource: "577b93510f9d51615fa47f99",
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                }
            },{
                role: 'dedicatedHarvester',  
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE],
                pickupBehavior: pickupSource,
                memory: {
                    pickupSource: "577b93510f9d51615fa47f99",
                }
            },{
                role: 'hauler',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
                pickupBehavior: [pickupStructure],
                depositBehavior: [depositSpawn, depositStructure],
                memory: {
                    pickupStructure: "579b14f83bd4b218529d528f",
                    depositStructure: "579b0acaf2aeb6f4028edc20",
                }
            },{
                role: 'extraHauler',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy,pickupStructure],
                depositBehavior: [depositSpawn],
                memory: {
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                    depositStructure: "579b0acaf2aeb6f4028edc20",
                }
            },{
                role: 'dedicatedUpgradeHarvester',  
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStructure],
                memory: {
                    pickupSource: "577b93510f9d51615fa47f98",
                    depositStructure: "579cd8ec0e14cf32071e5468,579ca48be92bc9ac3c6ddbdb"
                }
            },{
                role: 'reclaimer',
                count: _.sum(droppedEnergy.map((energy) => energy.amount)) > 1000 ? 1 : 0,
                stats: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
                pickupBehavior: [pickupEnergy],
                depositBehavior: [depositStructure],
                memory:{
                    pickupStructure: "579c95c256b4053c0f1736c7",
                    depositStructure: "579b0acaf2aeb6f4028edc20"
                }
            },{
                role: 'linkTender',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupStructure],
                depositBehavior: [depositStructure],
                memory:{
                    pickupStructure: "579c95c256b4053c0f1736c7",
                    depositStructure: "579b0acaf2aeb6f4028edc20"
                }
            },{
                role: 'wallFixer',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositRepair],
                memory: {
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                    repairTargetTypes: "constructedWall"
                }
            },{
                role: 'roadFixer',
                count: 1,
                stats: [CARRY,WORK,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositRepair],
                memory: {
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                    repairTargetTypes: "rampart,container,road"
                }
            },{
                role: 'e_hauler',
                count: Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_ENERGY] < 100000 && _.sum(Game.getObjectById("57a2df5620d65c935737496e").store) < 300000 ? 1 : 0,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositStructure],
                memory: {
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                    depositStructure: "57a2df5620d65c935737496e",
                    resourceType: RESOURCE_ENERGY,
                }
            },{
                role: 'o_hauler',
                count: Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_OXYGEN] > 101000 ? 1 : 0,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositStructure],
                memory: {
                    depositStructure: "579b0acaf2aeb6f4028edc20",
                    pickupStructure: "57a2df5620d65c935737496e",
                    resourceType: RESOURCE_OXYGEN,
                }
            },{
                role: 'tougherGuy',
                count: 0,
                stats: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                        TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,WORK,HEAL,HEAL,MOVE,
                        HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,
                        HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,], //1150 cost, 4500 health
                pickupBehavior: warToughGuy,
            },{
                role: 'healer',
                count: 0,
                stats: [HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE], //550 , 300 health :x
                pickupBehavior: warHealer,
                free: true
            },{
                role: 'wallBreaker',
                count: 0,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], //2500, 500 destruction per tick, 2000 health
                pickupBehavior: warWallBreaker,
            },{
                role: 'murderer',
                count: 0,
                stats: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], //970, 30 hits per tick, 1500 health
                pickupBehavior: warMurderer,
            },{
                role: 'upgraderAndTowerFeeder',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositStructure, depositController],
                memory: {
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                    depositStructure: "5798b6af64cab5f506706e68"
                }
            },{
                role: 'builder',
                count: 0,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupStructure],
                depositBehavior: [depositConstruction, depositSpawn, depositController],
                memory: {
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                    depositRoom: 'W13N46',
                }
            },{
                role: 'geologist',
                count: Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_OXYGEN] < 50000 ? 1 : 0, //ADD MINERAL SOURCE CHECK
                stats: [CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStructure],
                memory: {
                    pickupSource: "577b954d4cfed28730762670",
                    depositStructure: "57a2df5620d65c935737496e",
                    resourceType: RESOURCE_OXYGEN,
                }
            },{
                role: 'claimer',
                count: 1,
                respawnTime: 100,
                stats: [CLAIM,MOVE,MOVE],
                pickupBehavior: warClaimer,
                memory: {
                    pickupRoom: "W13N47"
                }
            },{
                role: 'remote_miner_c',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStationary],
                memory: {
                    pickupRoom: "W13N47",
                    pickupSource: "577b93510f9d51615fa47f96"
                }
            },{
                role: 'remote_hauler_c',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE],
                pickupBehavior: [pickupEnergy,pickupStructure],
                depositBehavior: [depositStructure],
                memory: {
                    pickupRoom: "W13N47",
                    pickupStructure: "579d551959418a3630deec27",
                    depositStructure: "579ca48be92bc9ac3c6ddbdb"
                }
            },{
                role: 'remote_miner_d',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStationary],
                memory: {
                    pickupRoom: "W12N46",
                    pickupSource: "577b93530f9d51615fa47fdb",
                }
            },{
                role: 'remote_hauler_d',
                count: 2,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy,pickupStructure],
                depositBehavior: [depositStructure],
                memory: {
                    pickupRoom: "W12N46",
                    pickupStructure: "579db3b82ce4a90f7cf6b51f",
                    depositStructure: "57a16e89b3af09680f7312b2"
                }
            },{
                role: 'claimer_d',
                count: 1,
                respawnTime: 100,
                stats: [CLAIM,MOVE,MOVE],
                pickupBehavior: warClaimer,
                memory: {
                    pickupRoom: "W12N46"
                }
            },{
                role: 'keeper_killer',
                count: 0,
                stats: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                        ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL],
                pickupBehavior: [warKeeperScout,warKeeperKiller],
                memory: {
                    target: "scout",
                    brave: true,
                }
            },{
                role: 'keeper_scout',
                count: 0,//"keeper_scout",
                stats: [TOUGH,TOUGH,MOVE,MOVE],
                pickupBehavior: warKeeperScout,
                memory: {
                    scoutingRoom: "W14N46",
                }
            },{
                role: 'remote_miner_f',
                count: 0,//"keeper_miner",
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [warKeeperScout, pickupSource],
                memory: {
                    pickupRoom: "W14N46",
                    pickupSource: "577b934e0f9d51615fa47f44",
                    brave: true,
                }
            },{
                role: 'remote_hauler_f',
                count: 0,//"keeper_hauler",
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        MOVE,MOVE,MOVE,MOVE,MOVE,],
                pickupBehavior: [warKeeperScout,pickupEnergy],
                depositBehavior: [depositStructure],
                memory: {
                    pickupRoom: "W14N46",
                    pickupSource: "577b934e0f9d51615fa47f44",
                    depositStructure: "57aca708166acf09193f62ec",
                    repairRoads: true,
                    brave:true
                    // repairTargetTypes: "container,road"
                }
            },{
                role: 'remote_miner_g',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStationary],
                // depositBehavior: [depositRepair,depositConstruction],
                memory: {
                    pickupRoom: "W12N45",
                    pickupSource: "577b93530f9d51615fa47fdd",
                    // repairTargetTypes: "container,road"
                }
            },{
                role: 'remote_hauler_g',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy,pickupStructure],
                depositBehavior: [depositConstruction, depositStructure],
                memory: {
                    pickupRoom: "W12N45",
                    pickupStructure: "57ae5f8ee13e42312bde8602",
                    depositRoom: "W12N46",
                    depositStructure: "579db3b82ce4a90f7cf6b51f",
                    repairRoads: true
                }
            },{
                role: 'claimer_g',
                count: 1,
                respawnTime: 100,
                stats: [CLAIM,MOVE,MOVE],
                pickupBehavior: warClaimer,
                memory: {
                    pickupRoom: "W12N45"
                }
            },{
                role: 'remote_miner_h1',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: depositStationary,
                memory: {
                    pickupRoom: "W11N45",
                    pickupSource: "577b93560f9d51615fa48021",
                }
            },{
                role: 'remote_miner_h2',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: depositStationary,
                memory: {
                    pickupRoom: "W11N45",
                    pickupSource: "577b93560f9d51615fa48020",
                }
            },{
                role: 'remote_hauler_h',
                count: 2,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy],
                depositBehavior: [depositConstruction, depositStructure],
                memory: {
                    pickupRoom: "W11N45",
                    // pickupStructure: "579db3b82ce4a90f7cf6b51f",
                    depositRoom: "W12N46",
                    depositWaypoint: "Sloth",
                    depositStructure: "579db3b82ce4a90f7cf6b51f",
                    repairRoads: true
                }
            },{
                role: 'claimer_h',
                count: 1,
                respawnTime: 200,
                stats: [CLAIM,MOVE,MOVE],
                pickupBehavior: warClaimer,
                memory: {
                    pickupRoom: "W11N45"
                }
            },{
                role: 'upgrader',
                count: 0,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositController],
                memory: {
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                    depositStructure: "5798b6af64cab5f506706e68"
                }
            },{
                role: 'builder',
                count: 0,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositController],
                memory: {
                    pickupStructure: "579b0acaf2aeb6f4028edc20",
                    depositStructure: "5798b6af64cab5f506706e68"
                }
            },{
                role: 'obsolete',
                count: 0,
                stats: [MOVE],
                action: obsolete
            }
        ] //End of Satellite 1 Creeps
    }
}

module.exports = room;