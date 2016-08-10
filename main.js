//TODO If killing a keeper doesn't accelerate the respawn timer, we stand to gain 22,500 energy during it's 1500 tick absence...


//Old roles
var agent = require('role.agent');
var claimer = require('role.claimer');
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
var depositTower = require('role.deposit.tower');
var warToughGuy = require('role.war.toughGuy');
var warHealer = require('role.war.healer');
var warWallBreaker = require('role.war.wallBreaker');
var warMurderer = require('role.war.murderer');
var warKeeperScout = require('role.war.keeperScout');


//Utilities
var energyManager = require('util.energyManager');
var harvesterChain = require('role.harvesterChain');
var navigator = require('util.navigator');
var keeperHarvesterUtil = require('util.keeperHarvester');

//var chainHead = require('role.chainHead');



// var roadBuilder = require('main.roadBuilder');
// var roadConstructor = require('util.roadConstructor');

/*TODO 

!!! ASSERT PRIORITY TO HELPER DISTRIBUTION

-1. calculate energy costs



0. CPU isn't as bad as I thought it was, don't need to panic. Focus on building out our chains
1. ChainMember & HarvesterChain need to interpolate if there are less members available
2. The above classes should prioritize by specialized creep role
3. The other roles should be updated to reflect the primary resource allocation method, pulling from the spawn?
4. ChainMember should try to fill extensions after the spawn is full
    
    */


module.exports.loop = function () {
    
    //Configurations
    var WALL_DEFENSE = 60000;
    var TOWER_SAFETY_BUFFFER = 500;
    var CREEP_DEATH_BUFFER = 100;
    
    //Labs
    var zLab = Game.getObjectById("57a404759c6ec19f1b0669b1")
    var oLab = Game.getObjectById("57a4d1c69f073e5c05e22c6c")
    var zoLab = Game.getObjectById("57a59a89adf97d367f548e7e")
    
    var roomMaps = [
            {
                name: "Home Base",
                room: Game.rooms.W11N47,
                spawn: Game.spawns.Spawn1,
                chainSource: new RoomPosition(14,14,Game.rooms.W11N47.name),
                chainEnd: new RoomPosition(17,12,Game.rooms.W11N47.name),
                link: "5795a6b7d0062947618ddb1e",
                creeps:[
                    {
                        role: 'backupHarvester',
                        count: 1,
                        stats: [WORK,CARRY,MOVE],
                        pickupBehavior: [pickupStructure,pickupSource],
                        depositBehavior: [depositSpawn],
                        memory: {
                            pickupSource: "577b93560f9d51615fa4801a",
                            pickupStructure: "579ade49620bd85f65c12bef",
                        }
                    },{
                        role: 'harvester',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
                        pickupBehavior: pickupSource,
                        depositBehavior: depositStructure,
                        memory: {
                            pickupSource: "577b93560f9d51615fa4801a",
                            depositStructure: "57a8767e3b8988535aabe5f1,579ade49620bd85f65c12bef"
                        }
                    },{
                        role: 'hauler',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositSpawn, depositStructure],
                        memory: {
                            pickupStructure: "579ade49620bd85f65c12bef",
                            depositStructure: "57904b0ec9d7b23451cc8204,5795b5033782a0b015dde292"
                        }
                    },{
                        role: 'extraHauler',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositSpawn, depositStructure],
                        memory: {
                            pickupStructure: "579468d58e446dcf073c0c0d",
                            depositStructure: "5795b5033782a0b015dde292"
                        }
                    },{
                        role: 'toughGuy',
                        count: 0,
                        stats: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                MOVE, MOVE, MOVE, MOVE, WORK, HEAL, HEAL, HEAL, MOVE, MOVE], //1150 cost, 4500 health
                        pickupBehavior: warToughGuy,
                    },{
                        role: 'tougherGuy',
                        count: 0,
                        stats: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,
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
                        stats: [WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,
                                WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE], //1500, 500 destruction per tick, 2000 health
                        pickupBehavior: warWallBreaker,
                    },{
                        role: 'murderer',
                        count: 0,
                        stats: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], //970, 30 hits per tick, 1500 health
                        pickupBehavior: warMurderer,
                    },{
                        role: 'wallFixer',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositRepair],
                        memory: {
                            pickupStructure: "579468d58e446dcf073c0c0d",
                            repairTargetTypes: "rampart,constructedWall"
                        }
                    },{
                        role: 'roadFixer',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositRepair],
                        memory: {
                            pickupStructure: "579468d58e446dcf073c0c0d",
                            repairTargetTypes: "container,road"
                        }
                    },{
                        role: 'miner',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupSource,
                        memory: {
                            pickupSource: "577b93560f9d51615fa48019"
                        }
                    },{
                        role: 'upgradeHauler',
                        count: 1,
                        stats: [CARRY,CARRY,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "579ad4c5127d20cd0e605c84",
                            depositStructure: "579468d58e446dcf073c0c0d"
                        }
                    },{
                        role: 'linkTender',
                        count: 1,
                        stats: [CARRY,MOVE],
                        pickupBehavior: pickupStructure,
                        // pickupBehavior: pickupEnergy,
                        depositBehavior: [depositStructure],
                        memory:{
                            pickupStructure: "5795a6b7d0062947618ddb1e",
                            depositStructure: "579468d58e446dcf073c0c0d"
                        }
                    },{
                        role: 'upgraderAndTowerFeeder',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositStructure, depositController],
                        memory: {
                            depositStructure: "5795cb3e116c4f4e3065532e",
                            pickupStructure: "579468d58e446dcf073c0c0d"
                        }
                    },{
                        role: 'builder',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositStructure, depositConstruction],
                        memory: {
                            pickupStructure: "579468d58e446dcf073c0c0d",
                            depositStructure: "57904b0ec9d7b23451cc8204"
                        }
                    },{
                        role: 'agent',
                        count: 0,
                        stats: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL],
                        action: agent,
                        crisis: agent,
                        free: true
                    },{
                        role: 'claimer',
                        count: 1, //_.filter(Game.structures, (structure) => structure.structureType == 'controller') < 3 ? 1 : 0
                        respawnTime: 100,
                        stats: [CLAIM,MOVE,MOVE],
                        action: claimer,
                        free: true,
                        memory: {
                            target: "explore"
                        }
                    },{
                        role: 'geologist',
                        count: Game.getObjectById("579da066136f091c3105d014").store[RESOURCE_ZYNTHIUM] < 150000 ? 1 : 0,
                        stats: [CARRY,CARRY, WORK, WORK, MOVE, MOVE],
                        pickupBehavior: pickupSource,
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupSource: "577b954d4cfed28730762693",
                            depositStructure: "579da066136f091c3105d014",
                            resourceType: RESOURCE_ZYNTHIUM,
                        }
                    },{
                        role: 'z_hauler',
                        count: zLab.mineralAmount < 2500 ? 1 : 0,
                        stats: [CARRY,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "579da066136f091c3105d014",
                            depositStructure: "57a404759c6ec19f1b0669b1",
                            resourceType: RESOURCE_ZYNTHIUM,
                        }
                    },{
                        role: 'o_hauler',
                        count: oLab.mineralAmount < 2500 ? 1 : 0,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "57a2df5620d65c935737496e",
                            depositStructure: "57a4d1c69f073e5c05e22c6c",
                            resourceType: RESOURCE_OXYGEN,
                        }
                    },{
                        role: 'e_hauler',
                        count: zoLab.energy < 2000 ? 1 : 0,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "579468d58e446dcf073c0c0d",
                            depositStructure: "57a59a89adf97d367f548e7e",
                            resourceType: RESOURCE_ENERGY,
                        }
                    },{
                        role: 'explorer',
                        count: 1,
                        stats: [CARRY,CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositRepair, depositController],
                        memory: {
                            // pickupSource: "577b93530f9d51615fa47fd8",
                            // pickupEnergy: "57a1403939ba5cb4136bf49c",
                            pickupStructure: "579cf3040a5eed39634cc3da",
                            pickupRoom: "W12N47",
                            depositRoom: "W12N47",
                            repairTargetTypes: "road"
                        }
                    },{
                        role: 'explorer-builder',
                        count: 0,
                        stats: [CARRY,CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositConstruction, depositRepair, depositController],
                        memory: {
                            // pickupSource: "577b93530f9d51615fa47fd7",
                            // pickupStructure: "579e7d7ac8c8d3b46f3c7ede",
                            pickupStructure: "579cf3040a5eed39634cc3da",
                            // pickupEnergy: "579e01033bd4b218529f6651",
                            repairTargetTypes: "road"
                        }
                    },{
                        role: 'remote_miner_a',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupSource,
                        depositBehavior: [depositStationary],
                        memory: {
                            pickupSource: "577b93530f9d51615fa47fd8",
                            pickupRoom: "W12N47",
                        }
                    },{
                        role: 'remote_miner_b',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupSource,
                        depositBehavior: [depositStationary],
                        memory: {
                            pickupSource: "577b93530f9d51615fa47fd7",
                            pickupRoom: "W12N47",
                        }
                    },{
                        role: 'remote_hauler_a',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupStructure],
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "579cf3040a5eed39634cc3da",
                            depositStructure: "579be2c31ef25b9102e6acf6",
                            pickupRoom: "W12N47",
                        }
                    },{
                        role: 'remote_hauler_b',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "579e7d7ac8c8d3b46f3c7ede",
                            depositStructure: "579be2c31ef25b9102e6acf6",
                            pickupRoom: "W12N47",
                        }
                    },{
                        role: 'upgrader',
                        count: 2,
                        stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositController],
                        memory: {
                            depositStructure: "5795cb3e116c4f4e3065532e",
                            pickupStructure: "579468d58e446dcf073c0c0d"
                        }
                    },{
                        role: 'obsolete',
                        count: 0,
                        stats: [MOVE],
                        action: obsolete
                    }
                ] //End of Home Base Creeps
            }, {
                name: "Satellite",
                room: Game.rooms.W13N46,
                spawn: Game.spawns.Spawn2,
                link: "579c95c256b4053c0f1736c7",
                creeps: [
                    {
                        role: 'harvester',  
                        count: 0,
                        stats: [WORK,CARRY,MOVE],
                        pickupBehavior: pickupSource,
                        memory: {
                            pickupSource: "577b93510f9d51615fa47f99",
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
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositSpawn, depositStructure],
                        memory: {
                            pickupStructure: "579b14f83bd4b218529d528f",
                            // pickupEnergy: "57a648e9229296990fe2db5b",
                            depositStructure: "579b0acaf2aeb6f4028edc20",
                        }
                    },{
                        role: 'extraHauler',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositSpawn, depositStructure],
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
                        role: 'linkTender',
                        count: 1,
                        stats: [CARRY,CARRY,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
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
                        stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositRepair],
                        memory: {
                            pickupStructure: "579b0acaf2aeb6f4028edc20",
                            repairTargetTypes: "rampart,container,road"
                        }
                    },{
                        role: 'e_hauler',
                        count: 0,//zoLab.energy < 2000 ? 1 : 0,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupSource,
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupSource: "579b0acaf2aeb6f4028edc20",
                            depositStructure: "57a2df5620d65c935737496e",
                            resourceType: RESOURCE_ENERGY,
                        }
                    },{
                        role: 'toughGuy',
                        count: 0,
                        stats: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                                MOVE, MOVE, MOVE, MOVE, WORK], //1150 cost, 4500 health
                        pickupBehavior: warToughGuy,
                    },{
                        role: 'healer',
                        count: 0,
                        stats: [HEAL,HEAL,MOVE], //550 , 300 health :x
                        pickupBehavior: warHealer,
                        free: true
                    },{
                        role: 'wallBreaker',
                        count: 0,
                        stats: [WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,
                                WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE,WORK,MOVE], //1500, 500 destruction per tick, 2000 health
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
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,WORK,WORK,WORK,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositConstruction, depositSpawn, depositController],
                        memory: {
                            pickupStructure: "579b0acaf2aeb6f4028edc20",
                        }
                    },{
                        role: 'geologist',
                        count: Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_OXYGEN] < 150000 ? 1 : 0,
                        stats: [CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE],
                        pickupBehavior: pickupSource,
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupSource: "577b954d4cfed28730762670",
                            depositStructure: "57a2df5620d65c935737496e",
                            resourceType: RESOURCE_OXYGEN,
                        }
                    },{
                        role: 'agent',
                        count: 1,
                        stats: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,HEAL],
                        action: agent,
                        crisis: agent,
                        free: true
                    },{
                        role: 'claimer',
                        count: 1,
                        respawnTime: 100,
                        stats: [CLAIM,MOVE,MOVE],
                        action: claimer,
                        free: true,
                        memory: {
                            target: "claim"
                        }
                    },{
                        role: 'explorer',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositConstruction, depositRepair, depositStructure],
                        memory: {
                            pickupStructure: "579d551959418a3630deec27",
                            depositStructure: "579ca48be92bc9ac3c6ddbdb",
                            repairTargetTypes: "road"
                        }
                    },{
                        role: 'remote_miner_c',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupSource,
                        depositBehavior: [depositStationary],
                        memory: {
                            pickupSource: "577b93510f9d51615fa47f96"
                        }
                    },{
                        role: 'remote_hauler_c',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "579d551959418a3630deec27",
                            depositStructure: "579ca48be92bc9ac3c6ddbdb"
                        }
                    },{
                        role: 'remote_miner_d',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupSource,
                        depositBehavior: [depositStationary],
                        // depositBehavior: [depositRepair,depositConstruction],
                        memory: {
                            pickupRoom: "W12N46",
                            pickupSource: "577b93530f9d51615fa47fdb",
                            // repairTargetTypes: "container,road"
                        }
                    },{
                        role: 'remote_hauler_d',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                                MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "579db3b82ce4a90f7cf6b51f",
                            depositStructure: "57a16e89b3af09680f7312b2"
                        }
                    },{
                        role: 'remote_repairer_d',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositRepair, depositConstruction, depositStructure],
                        memory: {
                            pickupStructure: "579db3b82ce4a90f7cf6b51f",
                            depositStructure: "57a16e89b3af09680f7312b2",
                            repairTargetTypes: "road"
                        }
                    },{
                        role: 'claimer_d',
                        count: 1,
                        respawnTime: 100,
                        stats: [CLAIM,MOVE,MOVE],
                        action: claimer,
                        free: true,
                        memory: {
                            target: "Greed"
                        }
                    },{
                        role: 'keeper_scout',
                        count: "keeper_scout",
                        stats: [TOUGH,TOUGH,MOVE,MOVE],
                        pickupBehavior: warKeeperScout,
                        memory: {
                            scoutingRoom: "W14N46",
                        }
                    },{
                        role: 'remote_miner_f',
                        count: "keeper_miner",
                        stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [warKeeperScout, pickupSource],
                        // depositBehavior: [depositStructure],
                        // depositBehavior: [depositRepair,depositConstruction],
                        memory: {
                            pickupRoom: "W14N46",
                            pickupSource: "577b934e0f9d51615fa47f44",
                            // depositStructure: "579b0acaf2aeb6f4028edc20",
                            // repairTargetTypes: "container,road"
                        }
                    },{
                        role: 'remote_hauler_f',
                        count: "keeper_hauler",
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [warKeeperScout,pickupEnergy],
                        depositBehavior: [depositStructure],
                        // depositBehavior: [depositRepair,depositConstruction],
                        memory: {
                            pickupRoom: "W14N46",
                            pickupSource: "577b934e0f9d51615fa47f44",
                            depositStructure: "579b0acaf2aeb6f4028edc20",
                            // repairTargetTypes: "container,road"
                        }
                    },{
                        role: 'remote_miner_g',
                        count: 1,
                        stats: [WORK,WORK,WORK,CARRY,MOVE,MOVE],
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
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy],
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupRoom: "W12N45",
                            // pickupStructure: "579db3b82ce4a90f7cf6b51f",
                            depositRoom: "W12N46",
                            depositStructure: "579db3b82ce4a90f7cf6b51f"
                        }
                    },{
                        role: 'upgrader',
                        count: 2,
                        stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                                CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
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
            },{
                name: "Satellite 2",
                room: Game.rooms.W14N47,
                spawn: Game.spawns.Spawn4,
                // link: "5795a6b7d0062947618ddb1e",
                creeps:[
                    {
                        role: 'harvester',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupSource],
                        depositBehavior: [depositStationary],
                        memory: {
                            pickupSource: "577b934e0f9d51615fa47f3d",
                            // pickupStructure: "579ade49620bd85f65c12bef",
                        }
                    },{
                        role: 'hauler',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupStructure],
                        depositBehavior: [depositSpawn, depositStructure],
                        memory: {
                            // pickupSource: "577b934e0f9d51615fa47f3d",
                            pickupStructure: "57a92ac646a746ac61d81337",
                            depositStructure: "57ab15daddb24c075a4cced8"
                        }
                    },{
                        role: 'closeHarvester',
                        count: 1,
                        stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupSource],
                        depositBehavior: [depositStationary],
                        memory: {
                            pickupSource: "577b934e0f9d51615fa47f3e",
                        }
                    },{
                        role: 'closeHauler',
                        count: 1,
                        stats: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
                        pickupBehavior: [pickupStructure],
                        depositBehavior: [depositSpawn, depositStructure],
                        memory: {
                            pickupStructure: "57a7fdb236786db0629f4b23",
                            depositStructure: "57a86def632092b170c23498,57ab15daddb24c075a4cced8"
                        }
                    },{
                        role: 'handyman',
                        count: 1,
                        stats: [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositConstruction, depositController],
                        memory: {
                            pickupStructure: "57ab15daddb24c075a4cced8",
                            depositWaypoint: "controllerFlag"
                        }
                    },{
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
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositRepair],
                        memory: {
                            pickupStructure: "57ab15daddb24c075a4cced8",
                            repairTargetTypes: "constructedWall"
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
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy],
                        depositBehavior: [depositStructure],
                        memory: {
                            pickupStructure: "579db3b82ce4a90f7cf6b51f",
                            depositStructure: "57ab15daddb24c075a4cced8",
                            pickupRoom: "W15N47"
                        }
                    },{
                        role: 'remote_repairer_a',
                        count: 0,
                        stats: [CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE],
                        pickupBehavior: [pickupEnergy,pickupStructure],
                        depositBehavior: [depositRepair, depositConstruction, depositStructure],
                        memory: {
                            pickupStructure: "579db3b82ce4a90f7cf6b51f",
                            depositStructure: "57a16e89b3af09680f7312b2",
                            repairTargetTypes: "road"
                        }
                    },{
                        role: 'claimer_a',
                        count: 0,
                        respawnTime: 100,
                        stats: [CLAIM,MOVE,MOVE],
                        action: claimer,
                        free: true,
                        memory: {
                            target: "Gluttony"
                        }
                    },{
                        role: 'upgrader',
                        count: 1,
                        stats: [CARRY,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE],
                        pickupBehavior: pickupStructure,
                        depositBehavior: [depositController],
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
            
        ]
    
    
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
        
        //Harvester Chain Logic
        if(value["chainSource"] && value["chainEnd"]) {
            var leadMiner = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.room == thisRoom.name)[0];
            harvesterChain.calculatePath(thisRoom,thisSpawn,value["chainSource"],value["chainEnd"], leadMiner);
        }
        
        
        //Link Logic
        var depositToThisLink = Game.getObjectById(value.link);
        var links = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
        links.forEach(link => { link.transferEnergy(depositToThisLink)});
        
        //Tower Snippet
        var towers          = thisRoom.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        // var ramparts        = thisRoom.find(FIND_STRUCTURES, {filter: function(structure) { return ((structure.structureType == 'rampart') && structure.hits < WALL_DEFENSE);}}); 
        var repairThese     = thisRoom.find(FIND_STRUCTURES, {filter: function(structure) { 
                return  (structure.structureType == "constructedWall"   && structure.hits < WALL_DEFENSE) || 
                        (structure.structureType == 'road'              && structure.hits < structure.hitsMax - towers.length*800) || 
                        (structure.structureType == 'container'         && structure.hits < structure.hitsMax - towers.length*800);}});
        console.log("there are " +repairThese.length + " things to repair!");
        var hostiles        = thisRoom.find(FIND_HOSTILE_CREEPS, {filter: function(hostile) { return hostile.getActiveBodyparts(ATTACK) + hostile.getActiveBodyparts(WORK) + hostile.getActiveBodyparts(RANGED_ATTACK) + hostile.getActiveBodyparts(HEAL) > 0;}});
        if(hostiles.length > 0) {
            thisSpawn.memory.crisis = true;
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${thisRoom}`);
            towers.forEach(tower => tower.attack(hostiles[0]));
        } else {
            thisSpawn.memory.crisis = false;
            // if (ramparts.length > 0) {
            //     towers.forEach(tower => {
            //         if(tower.energy > TOWER_SAFETY_BUFFFER) {
            //             result = tower.repair(ramparts[0]);
            //             console.log("Repairing "+ ramparts[0] + " resulting in " + result);
            //         }
            //     });
            // } 
            // else 
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
            healthyTroops = troops.filter((creep) =>creep.ticksToLive > respawn_buffer);
            
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
                if(((thisRoom.crisis && record.crisis) || !thisRoom.crisis) && canCreateTroops) {
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
                    }
                    
                    if(!troop.memory.collecting && troop.carry.energy == 0) {
                        troop.memory.collecting = true;
                    }
                    if(troop.memory.collecting && troop.carryCapacity == _.sum(troop.carry) && troop.getActiveBodyparts(CARRY) > 0) {
                        troop.memory.collecting = false;
                    }
                    
                    try {
                       // console.log(troop.name);
                        if(troop.memory.collecting || !record.depositBehavior) {
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