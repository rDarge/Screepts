


//Old roles
var agent = require('role.agent');
var obsolete = require('role.obsolete');

//new atomic behaviors
var pickupSource = require('role.pickup.source');
var pickupStructure = require('role.pickup.structure');
var pickupEnergy = require('role.pickup.energy');

// console.log("First Room Setup: " + (Game.cpu.getUsed() - start) + " out of " + Game.cpu.limit);

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



module.exports = function() {

    // var start = Game.cpu.getUsed();

    //Labs
    var zLab = Game.getObjectById("57a404759c6ec19f1b0669b1")
    var oLab = Game.getObjectById("57a4d1c69f073e5c05e22c6c")
    var zoLab = Game.getObjectById("57a59a89adf97d367f548e7e")

    var thisRoom = Game.rooms.W11N47;
    var MINERAL = Game.getObjectById("577b954d4cfed28730762693");

    var remoteRooms = ["W12N47"];
    var roomCache = Memory["cached_rooms"];
    var invadedRooms = remoteRooms.filter((roomName) => roomCache[roomName].evacuating > 0)
    // console.log("Interim Cost: " + (Game.cpu.getUsed() - start) + " out of " + Game.cpu.limit);     // 9.9 cpu!!!! WTF

    var droppedEnergy = thisRoom.find(FIND_DROPPED_ENERGY);

    var room = {
        name: "Home Base",
        room: thisRoom,
        spawn: Game.spawns.Spawn1,
        chainSource: new RoomPosition(14,14,Game.rooms.W11N47.name),
        chainEnd: new RoomPosition(17,12,Game.rooms.W11N47.name),
        link: "5795a6b7d0062947618ddb1e",
        creeps:[
            {
                role: 'backupHarvester',
                count: 1,
                stats: [WORK,CARRY,MOVE],
                pickupBehavior: [pickupSource,pickupStructure],
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
                    depositStructure: "57a8767e3b8988535aabe5f1,579ade49620bd85f65c12bef" //
                }
            },{
                role: 'hauler',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupStructure],
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
                pickupBehavior: [pickupStructure],
                depositBehavior: [depositSpawn],
                memory: {
                    pickupStructure: "579468d58e446dcf073c0c0d",
                    depositStructure: "5795b5033782a0b015dde292"
                }
            },

            new CreepModel("reclaimer", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .andDeposits    ("579468d58e446dcf073c0c0d")
                .butOnlyIf      (false),
                
            new CreepModel("zynthite", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       (MINERAL.id,RESOURCE_ZYNTHIUM)
                .andDeposits    ("579da066136f091c3105d014")
                .butOnlyIf      (MINERAL.mineralAmount > 0),

            new CreepModel("z_helper",
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp("579da066136f091c3105d014", RESOURCE_ZYNTHIUM)
                .andDeposits("579468d58e446dcf073c0c0d"),
                
            new CreepModel("towerTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        ("579468d58e446dcf073c0c0d")
                .andDeposits    ("5795cb3e116c4f4e3065532e,57c711603c3e07216d6cbc0a,57dc945829f08f9e18f169d7,57904b0ec9d7b23451cc8204,57a8767e3b8988535aabe5f1,57c7c7f2d27a609276284c1a")
                .butOnlyIf      (true),

            new CreepModel("remote_miner_guard",
                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,
                     ATTACK,ATTACK,ATTACK,ATTACK])
                .attacks        ()
                .in             (invadedRooms[0])
                .butOnlyIf      (invadedRooms.length > 0),
                
            {
                role: 'wallFixer',
                count: 0,
                stats: [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositRepair],
                memory: {
                    pickupStructure: "579468d58e446dcf073c0c0d",
                    repairTargetTypes: "constructedWall"
                }
            },{
                role: 'stuffFixer',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositRepair],
                memory: {
                    pickupStructure: "579468d58e446dcf073c0c0d",
                    repairTargetTypes: "rampart,container"
                }
            },{
                role: 'roadFixer',
                count: 1,
                stats: [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositRepair],
                memory: {
                    pickupStructure: "579468d58e446dcf073c0c0d",
                    repairTargetTypes: "road"
                }
            },{
                role: 'miner',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupSource,
                depositBehavior: depositStructure,
                memory: {
                    pickupSource: "577b93560f9d51615fa48019",
                    depositStructure: "57c711603c3e07216d6cbc0a,57b467993164911b77a5379b"
                }
            },{
                role: 'upgradeHauler',
                count: 1,
                stats: [CARRY,CARRY,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositStructure],
                memory: {
                    pickupStructure: "57b467993164911b77a5379b",
                    depositStructure: "579468d58e446dcf073c0c0d"
                }
            },{
                role: 'linkTender',
                count: 1,
                stats: [CARRY,CARRY,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositStructure],
                memory:{
                    pickupStructure: "5795a6b7d0062947618ddb1e",
                    depositStructure: "579468d58e446dcf073c0c0d"
                }
            },{
                role: 'upgraderAndTowerFeeder',
                count: 1,
                stats: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        WORK,WORK,WORK,WORK,WORK,CARRY,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: pickupStructure,
                depositBehavior: [depositStructure, depositController],
                memory: {
                    depositStructure: "5795cb3e116c4f4e3065532e",
                    pickupStructure: "579468d58e446dcf073c0c0d"
                }
            },{
                role: 'builder',
                count: 0,
                stats: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                pickupBehavior: [pickupStructure],
                depositBehavior: [depositConstruction,depositController],
                memory: {
                    pickupStructure: "579468d58e446dcf073c0c0d",
                }
            },{
                role: 'claimer',
                count: 1,//1 //_.filter(Game.structures, (structure) => structure.structureType == 'controller') < 3 ? 1 : 0
                respawnTime: 100,
                stats: [CLAIM,MOVE,MOVE],
                pickupBehavior: warClaimer,
                free: true,
                memory: {
                    pickupRoom: "W12N47"
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
            },

            new CreepModel("remote_hauler_a",
                        [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE])
                .finds(RESOURCE_ENERGY)
                .in("W12N47")
                .andDeposits("57c7c3f695dbe4fb62e607be,579be2c31ef25b9102e6acf6")
                .withFriends(2), 

            new CreepModel("deliveryMan", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,])
                .picksUp        ("579468d58e446dcf073c0c0d")
                .in             ("W11N47")
                .andDeposits    ("57d52c282a95196b4fb63f12")
                .in             ("W12N48")
                .withFriends    (2)
                .butOnlyIf      (false),

            {
                role: 'obsolete',
                count: 0,
                stats: [MOVE],
                action: obsolete
            }
        ] //End of Home Base Creeps
    };

    return room;
}