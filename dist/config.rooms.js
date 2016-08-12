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

//Labs
var zLab = Game.getObjectById("57a404759c6ec19f1b0669b1")
var oLab = Game.getObjectById("57a4d1c69f073e5c05e22c6c")
var zoLab = Game.getObjectById("57a59a89adf97d367f548e7e")

//TODO THIS

// var config = {
// 	rooms: [
// 		{
//             name: "Home Base",
//             room: Game.rooms.W11N47,
//             spawn: Game.spawns.Spawn1,
//             groups: {
//             	harvester_1: getHarvesterGroup("577b93560f9d51615fa4801a",""); //returns array of dedicated harvester and hauler for that source
// 				harvester_2: getHarvesterGroup("577b93560f9d51615fa48019"); //returns array of dedicated harvester and hauler for that source
//             }
// 	]
// }


var config = {

	rooms: [

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
                    stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    		CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    		MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
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
                    role: 'wallFixer',
                    count: 1,
                    stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                    pickupBehavior: pickupStructure,
                    depositBehavior: [depositRepair],
                    memory: {
                        pickupStructure: "579468d58e446dcf073c0c0d",
                        repairTargetTypes: "constructedWall"
                    }
                },{
                    role: 'roadFixer',
                    count: 1,
                    stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                    pickupBehavior: pickupStructure,
                    depositBehavior: [depositRepair],
                    memory: {
                        pickupStructure: "579468d58e446dcf073c0c0d",
                        repairTargetTypes: "rampart,container,road"
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
                    depositBehavior: [depositConstruction, depositStructure],
                    memory: {
                        pickupStructure: "579468d58e446dcf073c0c0d",
                        depositStructure: "57904b0ec9d7b23451cc8204,5795b5033782a0b015dde292"
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
                    count: 0,//1 //_.filter(Game.structures, (structure) => structure.structureType == 'controller') < 3 ? 1 : 0
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
                    depositBehavior: [depositRepair],
                    memory: {
                        // pickupSource: "577b93530f9d51615fa47fd8",
                        // pickupEnergy: "57a1403939ba5cb4136bf49c",
                        pickupStructure: "579e7d7ac8c8d3b46f3c7ede",
                        pickupRoom: "W12N47",
                        depositRoom: "W12N47",
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
                    count: 0,
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
                    pickupBehavior: [pickupStructure],
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
                    stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
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
                    count: 0,//Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_ENERGY] < 100000 && _.sum(Game.getObjectById("57a2df5620d65c935737496e").store) < 300000 ? 1 : 0,//zoLab.energy < 2000 ? 1 : 0,
                    stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                            MOVE,MOVE,MOVE,MOVE,MOVE],
                    pickupBehavior: pickupStructure,
                    depositBehavior: [depositStructure],
                    memory: {
                        pickupStructure: "579b0acaf2aeb6f4028edc20",
                        depositStructure: "57a2df5620d65c935737496e",
                        // depositStructure: "579b0acaf2aeb6f4028edc20",
                        // pickupStructure: "57a2df5620d65c935737496e",
                        resourceType: RESOURCE_ENERGY,
                    }
                },{
                    role: 'o_hauler',
                    count: Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_OXYGEN] > 101000 ? 1 : 0,//zoLab.energy < 2000 ? 1 : 0,
                    stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                            MOVE,MOVE,MOVE,MOVE,MOVE],
                    pickupBehavior: pickupStructure,
                    depositBehavior: [depositStructure],
                    memory: {
                        // pickupStructure: "579b0acaf2aeb6f4028edc20",
                        // depositStructure: "57a2df5620d65c935737496e",
                        depositStructure: "579b0acaf2aeb6f4028edc20",
                        pickupStructure: "57a2df5620d65c935737496e",
                        resourceType: RESOURCE_OXYGEN,
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
                    pickupBehavior: [pickupStructure],
                    depositBehavior: [depositConstruction, depositSpawn, depositController],
                    memory: {
                        pickupStructure: "579b0acaf2aeb6f4028edc20",
                    }
                },{
                    role: 'geologist',
                    count: Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_OXYGEN] < 100000 ? 1 : 0, //ADD MINERAL SOURCE CHECK
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
                    count: 0,
                    stats: [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,
                            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,HEAL],
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
                    count: 2,
                    stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                            CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                            MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    pickupBehavior: [pickupEnergy,pickupStructure],
                    depositBehavior: [depositStructure],
                    memory: {
                    	pickupRoom: "W12N46",
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
                        repairRoads: true
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
                    pickupBehavior: [pickupEnergy],
                    depositBehavior: [depositConstruction, depositStructure],
                    memory: {
                        pickupRoom: "W12N45",
                        // pickupStructure: "579db3b82ce4a90f7cf6b51f",
                        depositRoom: "W12N46",
                        depositStructure: "579db3b82ce4a90f7cf6b51f"
                    }
                },{
                    role: 'claimer_g',
                    count: 1,
                    respawnTime: 100,
                    stats: [CLAIM,MOVE,MOVE],
                    action: claimer,
                    free: true,
                    memory: {
                        target: "Sloth"
                    }
                },{
                    role: 'upgrader',
                    count: 0,
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
                    depositBehavior: [depositStationary,depositStructure],
                    memory: {
                        pickupSource: "577b934e0f9d51615fa47f3e",
                        depositStructure: "57a86def632092b170c23498"
                    }
                },{
                    role: 'closeHauler',
                    count: 1,
                    stats: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
                    pickupBehavior: [pickupStructure],
                    depositBehavior: [depositSpawn, depositStructure],
                    memory: {
                        pickupStructure: "57a7fdb236786db0629f4b23",
                        depositStructure: "57ab15daddb24c075a4cced8"
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
                            WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    pickupBehavior: [pickupEnergy],
                    depositBehavior: [depositStructure],
                    memory: {
                        pickupStructure: "579db3b82ce4a90f7cf6b51f",
                        depositStructure: "57ab15daddb24c075a4cced8",
                        pickupRoom: "W15N47"
                    }
                },{
                    role: 'remote_repairer_a',
                    count: 1,
                    stats: [CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE],
                    pickupBehavior: [pickupEnergy],
                    depositBehavior: [depositRepair, depositConstruction, depositStructure],
                    memory: {
                        pickupStructure: "579db3b82ce4a90f7cf6b51f",
                        depositStructure: "57ab15daddb24c075a4cced8",
                        pickupRoom: "W15N47",
                        repairTargetTypes: "road"
                    }
                },{
                    role: 'claimer_a',
                    count: 1,
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
}

module.exports = config;