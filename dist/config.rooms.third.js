
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

var thisRoom = Game.rooms.W14N47;
var thisSpawn = Game.spawns.Spawn4;

var droppedEnergy = thisRoom.find(FIND_DROPPED_ENERGY);
 
room = {
    configuration: {
        name: "Satellite 2",
        room: thisRoom,
        spawn: thisSpawn,
        link: "57adf862d4089220049deb82",
        creeps:[

            /*---------------------------------------------
                            Local Creeps
            ---------------------------------------------*/
            new CreepModel("backupHarvester", [CARRY,CARRY,MOVE])
                .picksUp        ("57ab15daddb24c075a4cced8")
                .andNurses      ()
                .withFriends    (thisRoom.find(FIND_MY_CREEPS).length < 5 ? 1 : 0),

            new CreepModel("harvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b934e0f9d51615fa47f3d")
                .andDeposits    ("57ae203b1c0e8d5f13274ec9,57ae0b8a96b32105101daca4"),

            new CreepModel("nurse", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE])
                .picksUp        ("57ab15daddb24c075a4cced8")
                .andNurses      (),

            new CreepModel("closeHarvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b934e0f9d51615fa47f3e")
                .andDeposits    ("57a86def632092b170c23498")
                .andDropsIt     (),

            new CreepModel("closeHauler", [CARRY,CARRY,MOVE])
                .picksUp        ("57a7fdb236786db0629f4b23")
                .andDeposits    ("57ab15daddb24c075a4cced8"),

            new CreepModel("linkTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        ("57adf862d4089220049deb82")
                .andDeposits    ("57ab15daddb24c075a4cced8"),

            new CreepModel("reclaimer", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .andDeposits    ("57ab15daddb24c075a4cced8")
                .withFriends    (_.sum(droppedEnergy.map((energy) => energy.amount)) > 1000 ? 1 : 0),

            /*----------------------------------------------
                            Remote Creeps
            ----------------------------------------------*/

            new CreepModel("handyman", 
                    [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,
                     MOVE,MOVE])
                .harvests       ("577b934b0f9d51615fa47ef2")
                .in             ("W15N45")
                .andBuilds      ()
                .andRepairs     ("road")
                .in             ("W15N45")
                .andIsBrave     ()
                .withFriends    (0),


            // {
            //     role: 'handyman',
            //     count: 1,
            //     stats: [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            //     pickupBehavior: [pickupSource],
            //     depositBehavior: [depositConstruction,depositRepair],
            //     memory: {
            //         pickupSource: "577b934b0f9d51615fa47ef2",
            //         pickupRoom: 'W15N45',
            //         depositRoom: 'W15N45',
            //         repairTargetTypes: "road",
            //         brave: true,
            //         // depositWaypoint: "controllerFlag",
            //     }
            // },
            {
                role: 'roadFixer',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositRepair],
                memory: {
                    pickupStructure: "57ab15daddb24c075a4cced8",
                    repairTargetTypes: "rampart,road"
                }
            },{
                role: 'wallFixer',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy,pickupStructure],
                depositBehavior: [depositRepair],
                memory: {
                    pickupStructure: "57ab15daddb24c075a4cced8",
                    repairTargetTypes: "constructedWall"
                }
            },{
                role: 'upgrader',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositController],
                memory: {
                    pickupStructure: "57ab15daddb24c075a4cced8",
                }
            },{
                role: 'claimer_a',
                count: 1,
                respawnTime: 100,
                stats: [CLAIM,MOVE,MOVE],
                pickupBehavior: warClaimer,
                memory: {
                    pickupRoom: "W15N47"
                }
            },{
                role: 'remote_miner_a',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStationary],
                // depositBehavior: [depositRepair,depositConstruction],
                memory: {
                    pickupRoom: "W15N47",
                    pickupSource: "577b934b0f9d51615fa47ee3",
                    // repairTargetTypes: "container,road"
                }
            },{
                role: 'remote_hauler_a',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy],
                depositBehavior: [depositStructure],
                memory: {
                    pickupStructure: "579db3b82ce4a90f7cf6b51f",
                    depositStructure: "57ab15daddb24c075a4cced8",
                    pickupRoom: "W15N47",
                    repairRoads:true

                }
            },{
                role: 'remote_repairer_a',
                count: 0,
                stats: [CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy],
                depositBehavior: [depositRepair, depositConstruction, depositStructure],
                memory: {
                    pickupStructure: "579db3b82ce4a90f7cf6b51f",
                    depositStructure: "57ab15daddb24c075a4cced8",
                    pickupRoom: "W15N47",
                    repairTargetTypes: "road",
                    repairRoads:true
                }
            },{
                role: 'remote_miner_hydro',
                count: 0,//Game.getObjectById("57ab15daddb24c075a4cced8").store[RESOURCE_HYDROGEN] < 100000 ? 1 : 0,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStationary],
                memory: {
                    pickupRoom: "W15N45",
                    pickupSource: "577b9559e2e3e3f6319eb41e",
                    resourceType: RESOURCE_HYDROGEN,
                    brave: true,
                }
            },{
                role: 'remote_hauler_hydro',
                count: 0,//Game.getObjectById("57ab15daddb24c075a4cced8").store[RESOURCE_HYDROGEN] < 100000 ? 1 : 0,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                        MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy],
                depositBehavior: [depositStructure],
                memory: {
                    pickupRoom: "W15N45",
                    pickupStructure: "579db3b82ce4a90f7cf6b51f",
                    depositStructure: "57ab15daddb24c075a4cced8",
                    resourceType: RESOURCE_HYDROGEN,
                    brave: true,
                }
            },{
                role: 'remote_miner_k1',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStationary],
                memory: {
                    pickupRoom: "W15N45",
                    pickupSource: "577b934b0f9d51615fa47ef0",
                    resourceType: RESOURCE_ENERGY,
                    brave: true,
                }
            },{
                role: 'remote_miner_k2',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: [depositStationary],
                memory: {
                    pickupRoom: "W15N45",
                    pickupSource: "577b934b0f9d51615fa47ef1",
                    resourceType: RESOURCE_ENERGY,
                    brave: true,
                }
            },{
                role: 'remote_hauler_k2',
                count: 8,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupEnergy],
                depositBehavior: [depositStructure],
                memory: {
                    pickupRoom: "W15N45",
                    pickupStructure: "579db3b82ce4a90f7cf6b51f",
                    depositStructure: "57b52df12221d8ab76e32b70",
                    resourceType: RESOURCE_ENERGY,
                    repairRoads: true,
                    brave: true,
                }
            },{
                role: 'extra_upgrader',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositController],
                memory: {
                    pickupStructure: "57ab15daddb24c075a4cced8",
                }
            },{
                role: 'extra_builder',
                count: thisRoom.find(FIND_MY_CONSTRUCTION_SITES).length > 0 ? 1 : 0,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositConstruction],
                memory: {
                    pickupStructure: "57ab15daddb24c075a4cced8",
                }
            },{
                role: 'obsolete',
                count: 0,
                stats: [MOVE],
                action: obsolete
            }
        ]
    }
}

module.exports = room;