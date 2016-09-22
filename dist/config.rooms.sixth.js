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
                .andDropsIt     ()
                .butOnlyIf      (true),

            new CreepModel("closeHauler", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE])
                .picksUp        ("57d82456b2318b5c3c0459c2")
                .andDeposits    (STORAGE),
                
            new CreepModel("nurse", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,
                                     MOVE,MOVE])
                .picksUp        (STORAGE)
                .andNurses      ()
                .andDeposits    ("57d855a060d071276ac0952a,57dac39a1571a4377067a7bd")
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
                .andDeposits    ("57d855a060d071276ac0952a,57dac39a1571a4377067a7bd")
                .butOnlyIf      (false),
                
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
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CONSTRUCTION_SITES).length > 0),

            new CreepModel("upgrader", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,/*WORK,WORK,
                     /*WORK,WORK,WORK,WORK,WORK,*/CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,/*MOVE,MOVE,MOVE*/])
                .picksUp        (STORAGE)
                .andWorships    ()
                .withFriends    (1),
            
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

