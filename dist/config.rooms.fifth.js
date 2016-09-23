//Old roles
var obsolete = require('role.obsolete');

module.exports = function() {

    // var start = Game.cpu.getUsed();

    //Reference Constants
    var THIS_ROOM = Game.rooms.W12N48;
    var THIS_SPAWN = Game.spawns.Spawn10;
    var STORAGE = "57d52c282a95196b4fb63f12";
    var MINERAL = Game.getObjectById("577b954d4cfed28730762680");


    var remoteRooms = [];
    var invadedRooms = remoteRooms.filter((value) => Memory["cached_rooms"][value].evacuating > 0);

    var droppedEnergy = THIS_ROOM.find(FIND_DROPPED_ENERGY);
     
    var room = {
        name: "Hodor",
        room: THIS_ROOM,
        spawn: THIS_SPAWN,
        link: "57d81dfd8259c7b14c346863",
        towerDefense: 1000,
        creeps:[

            /*---------------------------------------------
                            Local Creeps
            ---------------------------------------------*/
            // new CreepModel("backupHauler", [CARRY,CARRY,MOVE])
            //     .picksUp        ("57d52c282a95196b4fb63f12")
            //     .andNurses      ()
            //     .butOnlyIf      (THIS_ROOM.find(FIND_MY_CREEPS).length < 5),

            //Disabled until higher level
            new CreepModel("harvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b93530f9d51615fa47fd3")
                .andDropsIt     ()
                .butOnlyIf      (true), 

            new CreepModel("closeHauler", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE])
                .picksUp        ("57ba6fad289b44502ce6067e")
                .andNurses      ()
                .andDeposits    (STORAGE),

            new CreepModel("nurse", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                    WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andNurses      ()
                .andDeposits    ("57d398a64d53f52b2b88582b,57d83bd79556127743796684")
                .withFriends    (1),

            new CreepModel("farHarvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b93530f9d51615fa47fd4")
                .andDeposits    ("57d8289e4883f2bb52e83a14")
                .butOnlyIf      (true),

            new CreepModel("farHauler", [CARRY,CARRY,MOVE])
                .picksUp        ("57d81dfd8259c7b14c346863")
                .andDeposits    (STORAGE)
                .butOnlyIf      (true),
                
            new CreepModel("reclaimer", [CARRY,CARRY,MOVE])
                .finds          (RESOURCE_ENERGY)
                .andDeposits    (STORAGE)
                .butOnlyIf      (1),
                
            new CreepModel("hydroclast", 
                [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                 CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                 MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       (MINERAL.id,RESOURCE_HYDROGEN)
                .andDeposits    (STORAGE)
                .butOnlyIf      (MINERAL.mineralAmount > 0),

            //Disabled until GCL6
            // new CreepModel("linkTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
            //     .picksUp        ("57adf862d4089220049deb82")
            //     .andDeposits    ("57ab15daddb24c075a4cced8"),
                
            new CreepModel("towerTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andDeposits    ("57d398a64d53f52b2b88582b,57d83bd79556127743796684")
                .butOnlyIf      (false),
                
            new CreepModel("roadFixer", [CARRY,CARRY,WORK,WORK,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairsUpTo ("road")
                .andWorships    (),

            // new CreepModel("reclaimer", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
            //     .finds          (RESOURCE_ENERGY)
            //     .andDeposits    ("57ab15daddb24c075a4cced8")
            //     .butOnlyIf      (true),//_.sum(droppedEnergy.map((energy) => energy.amount)) > 500 ? 1 : 0),

            // new CreepModel("roadFixer", [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE])
            //     .picksUp        ("57ab15daddb24c075a4cced8")
            //     .andRepairs     ("rampart,road"),

            new CreepModel("wallFixer", [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairsUpTo ("constructedWall",10000)
                .andWorships    (),

            new CreepModel("rampartFixer", 
                    [CARRY,CARRY,
                     WORK,WORK,
                     MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("rampart")
                .andWorships    (),

            new CreepModel("builder", 
                    [WORK,WORK,WORK,WORK,WORK,
                    CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andBuilds      ()
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CONSTRUCTION_SITES).length > 0),

            new CreepModel("upgrader", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andWorships    ()
                .withFriends    (2),

            /*----------------------------------------------
                            Remote Creeps
            ----------------------------------------------*/

            // new CreepModel("remote_miner_guard",
            //         [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,
            //          MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,
            //          ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL])
            //     .attacks        ()
            //     .in             (invadedRooms[0])
            //     .butOnlyIf      (invadedRooms.length > 0),

            // W15N47 - Disabled till we can get max value from the other room

            new CreepModel("claimer_a", [CLAIM,MOVE])
                .claims         ()
                .in             ("W11N48")
                .butOnlyIf      (true),

            new CreepModel("remote_miner_a", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b93560f9d51615fa48015")
                .in             ("W11N48")
                .andDropsIt     ()
                .butOnlyIf      (true),
                
            new CreepModel("remote_miner_b", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b93560f9d51615fa48016")
                .in             ("W11N48")
                .andDropsIt     ()
                .butOnlyIf      (true),                

            new CreepModel("remote_hauler_a", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                    CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE])
                .finds          (RESOURCE_ENERGY)
                .in             ("W11N48")
                .andDeposits    ("57d8289e4883f2bb52e83a14")
                .withFriends    (2)
                .butOnlyIf      (true),
                
            new CreepModel("adventurer", [CARRY,CARRY,WORK,WORK,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .in             ("W11N48")
                .andBuilds      ()
                .in             ("W11N48")
                .butOnlyIf      (false),
            
            
            //Here for legacy purposes
            {
                role: 'obsolete',
                count: 0,
                stats: [MOVE],
                action: obsolete
            }
        ]
    }
    // console.log("Fifth Room Setup: " + (Game.cpu.getUsed() - start) + " out of " + Game.cpu.limit);

    return room;
}