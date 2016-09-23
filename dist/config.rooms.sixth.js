//Old roles
var obsolete = require('role.obsolete');

module.exports = function() {

    // var start = Game.cpu.getUsed();

    //Reference Constants
    var THIS_ROOM = Game.rooms.W9N49;
    var THIS_SPAWN = Game.spawns.Spawn11;
    var STORAGE = "57d98c6c937a2984702e030a";
    var MINERAL = Game.getObjectById("577b954d4cfed287307626a3");

    var remoteRooms = [];
    var invadedRooms = remoteRooms.filter((value) => Memory["cached_rooms"][value].evacuating > 0);

    var droppedEnergy = THIS_ROOM.find(FIND_DROPPED_ENERGY);
     
    var room = {
        name: "Llanowar",
        room: THIS_ROOM,
        spawn: THIS_SPAWN,
        link: "57dab459357689890c688044",
        towerDefense: 1000,
        creeps:[

            /*---------------------------------------------
                            Local Creeps
            ---------------------------------------------*/
            new CreepModel("backupHauler", [CARRY,CARRY,WORK,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .picksUp        ("57dab459357689890c688044")
                .harvests       ("577b935a0f9d51615fa48067")
                .andNurses      ()
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CREEPS).length < 5),

            //Disabled until higher level
            new CreepModel("closeHarvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b935a0f9d51615fa48067")
                .andDeposits    ("57e23c0e442039155ee51f0b")
                .butOnlyIf      (true),

            //Disabled after second link
            new CreepModel("closeHauler", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE])
                .picksUp        ("57d82456b2318b5c3c0459c2")
                .andDeposits    (STORAGE)
                .butOnlyIf      (false),
                
            new CreepModel("nurse", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,
                                     MOVE,MOVE])
                .picksUp        (STORAGE)
                .andNurses      ()
                .andDeposits    ("57d855a060d071276ac0952a,57e491d75d43d8735863d620")
                .withFriends    (1),
                
            new CreepModel("farHarvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b935a0f9d51615fa48066")
                .andDeposits    ("57daa732dedecba636c9fb80")
                .butOnlyIf      (true), 

            new CreepModel("linkTender", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE])
                .picksUp        ("57dab459357689890c688044")
                .andDeposits    (STORAGE)
                .butOnlyIf      (true),
                
            new CreepModel("reclaimer", [CARRY,CARRY,MOVE])
                .finds          (RESOURCE_ENERGY)
                .andDeposits    (STORAGE)
                .butOnlyIf      (_(THIS_ROOM.find(FIND_DROPPED_ENERGY)).map(((pile) => pile.energy)).sum() > 150),
                
            new CreepModel("towerTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andDeposits    ("57d855a060d071276ac0952a,57e491d75d43d8735863d620")
                .butOnlyIf      (true),
                
            new CreepModel("leonin", 
                [WORK,WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       (MINERAL.id,RESOURCE_LEMERGIUM)
                .andDeposits    ("57e19b3fad079b3969901794")
                .butOnlyIf      (MINERAL.mineralAmount > 0),

            // new CreepModel("reclaimer", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
            //     .finds          (RESOURCE_ENERGY)
            //     .andDeposits    ("57ab15daddb24c075a4cced8")
            //     .butOnlyIf      (true),//_.sum(droppedEnergy.map((energy) => energy.amount)) > 500 ? 1 : 0),

            // new CreepModel("roadFixer", [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE])
            //     .picksUp        ("57ab15daddb24c075a4cced8")
            //     .andRepairs     ("rampart,road"),

            new CreepModel("wallFixer", [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("constructedWall")
                .butOnlyIf      (false),

            new CreepModel("builder", 
                    [WORK,WORK,WORK,WORK,WORK,
                    CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andBuilds      ()
                .in             ("W8N49")
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CONSTRUCTION_SITES).length > 0),

            new CreepModel("upgrader", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andWorships    ()
                .withFriends    (2),

            new CreepModel("claimer_1", [MOVE,CLAIM])
                .claims         ()
                .in             ("W8N49"),

            new CreepModel("remote_harvester_1", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b935d0f9d51615fa480aa")
                .in             ("W8N49")
                .andDropsIt     (),

            new CreepModel("remote_harvester_2", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b935d0f9d51615fa480a9")
                .in             ("W8N49")
                .andDropsIt     (),

            new CreepModel("remote_hauler_1",
                        [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE])
                .finds(RESOURCE_ENERGY)
                .in("W8N49")
                .andDeposits(STORAGE)
                .withFriends(2), 

            new CreepModel("claimer_2", [MOVE,CLAIM])
                .claims         ()
                .in             ("W8N48"),

            new CreepModel("remote_harvester_3", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b935d0f9d51615fa480ad")
                .in             ("W8N48")
                .andDropsIt     (),

            new CreepModel("remote_harvester_4", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b935d0f9d51615fa480af")
                .in             ("W8N48")
                .andDropsIt     (),

            new CreepModel("remote_hauler_2",
                        [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                        CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,
                        MOVE,MOVE,MOVE,MOVE])
                .finds(RESOURCE_ENERGY)
                .in("W8N48")
                .andDeposits(STORAGE)
                .withFriends(2), 

            
            //Here for legacy purposes
            {
                role: 'obsolete',
                count: 0,
                stats: [MOVE],
                action: obsolete
            }
        ]
    };

    // console.log("Second Room Setup: " + (Game.cpu.getUsed() - start) + " out of " + Game.cpu.limit);
    return room;
}

