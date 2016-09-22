//Old roles
var obsolete = require('role.obsolete');

module.exports = function() {

    var THIS_ROOM = Game.rooms.W13N46;
    var THIS_SPAWN = Game.spawns.Spawn2;
    var MINERAL = Game.getObjectById("577b954d4cfed28730762670")

    var remoteRooms = ["W13N47", "W12N46", "W12N45", "W11N45"];
    var invadedRooms = remoteRooms.filter((value) => Memory["cached_rooms"][value].evacuating > 0)

    var droppedEnergy = THIS_ROOM.find(FIND_DROPPED_ENERGY);
     
    var room = {
        name: "Satellite",
        room: THIS_ROOM,
        spawn: THIS_SPAWN,
        link: "57dcc8c806fd5f1b2b5b7aa3",
        creeps: [

            /*-------------------------------------------
                        Core Support Creeps
            -------------------------------------------*/

            new CreepModel("backupHarvester", [WORK,CARRY,MOVE])
                .picksUp        ("579b0acaf2aeb6f4028edc20")
                .harvests       ("577b93510f9d51615fa47f99")
                .andNurses      ()
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CREEPS).length < 5),

            new CreepModel("dedicatedHarvester", [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE])
                .harvests       ("577b93510f9d51615fa47f99")
                .andDropsIt     (),

            new CreepModel("hauler", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        ("579b14f83bd4b218529d528f")
                .andNurses      ()
                .andDeposits    ("579b0acaf2aeb6f4028edc20"),

            new CreepModel("extraHauler", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE])
                .picksUp        ("579b0acaf2aeb6f4028edc20")
                .andNurses      (),

            new CreepModel("reclaimer", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .finds(RESOURCE_ENERGY)
                .andDeposits("579b0acaf2aeb6f4028edc20")
                .butOnlyIf(true),

            new CreepModel("towerTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        ("579b0acaf2aeb6f4028edc20")
                .andDeposits    ("5798b6af64cab5f506706e68,57d48704d515d14525a9585b,57d4731132b3cc6742e03282,579cd8ec0e14cf32071e5468,57d8d5fbc9c6e61433761da3,57d8d3b56be258b478bea782"),

            new CreepModel("dedicatedUpgradeHarvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE])
                .harvests("577b93510f9d51615fa47f98")
                .andDeposits("579cd8ec0e14cf32071e5468,579ca48be92bc9ac3c6ddbdb"),

            new CreepModel("upgrader", 
                    [WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,
                     CARRY,
                     MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE])
                .picksUp("579b0acaf2aeb6f4028edc20")
                .andWorships()
                .butOnlyIf(true),

            new CreepModel("linkTender", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE])
                .picksUp("57dcc8c806fd5f1b2b5b7aa3")
                .andDeposits("579b0acaf2aeb6f4028edc20"),

            new CreepModel("wallFixer", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK,WORK,
                    WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp("579b0acaf2aeb6f4028edc20")
                .andRepairsUpTo("constructedWall",10000000)
                .andNurses()
                .withFriends(1),
                
            new CreepModel("roadFixer", [CARRY,WORK,MOVE,MOVE])
                .picksUp("579b0acaf2aeb6f4028edc20")
                .andRepairs("road"),

            new CreepModel("rampartFixer", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,
                     WORK,WORK,WORK,WORK,WORK,
                     MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp("579b0acaf2aeb6f4028edc20")
                .andRepairsUpTo("rampart",7000000),

            /*-------------------------------------------
                            Defense Team
            -------------------------------------------*/

            new CreepModel("remote_miner_guard",
                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,
                     ATTACK,ATTACK,ATTACK,ATTACK])
                .attacks        ()
                .in             (invadedRooms[0])
                .butOnlyIf      (invadedRooms.length > 0),
                
            new CreepModel("zstealer", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .finds(RESOURCE_ZYNTHIUM)
                .in("W12N44")
                .andDeposits("579b0acaf2aeb6f4028edc20")
                .andIsBrave()
                .butOnlyIf(false),
                
            new CreepModel("ragamuffin", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .finds(RESOURCE_HYDROGEN)
                .in("W13N44")
                .andDeposits("579b0acaf2aeb6f4028edc20")
                .withFriends(10)
                .andIsBrave()
                .butOnlyIf(false),

            /*-------------------------------------------
                                R&D
            -------------------------------------------*/

            new CreepModel("oxyclean_man", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       (MINERAL.id,RESOURCE_UTRIUM)
                .andDeposits    ("579b0acaf2aeb6f4028edc20")
                .butOnlyIf      (MINERAL.mineralAmount > 0),

            new CreepModel("geologist", [CARRY,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE])
                .harvests("577b954d4cfed28730762670", RESOURCE_OXYGEN)
                .andDeposits("57a2df5620d65c935737496e")
                .butOnlyIf(Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_OXYGEN] < 50000),

            new CreepModel("e_hauler", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp("579b0acaf2aeb6f4028edc20")
                .andDeposits("57a2df5620d65c935737496e")
                .butOnlyIf(Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_ENERGY] < 100000 && _.sum(Game.getObjectById("57a2df5620d65c935737496e").store) < 300000),

            new CreepModel("o_hauler", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp("57a2df5620d65c935737496e", RESOURCE_OXYGEN)
                .andDeposits("579b0acaf2aeb6f4028edc20")
                .butOnlyIf(Game.getObjectById("57a2df5620d65c935737496e").store[RESOURCE_OXYGEN] > 101000),

            new CreepModel("builder", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,
                     MOVE])
                .picksUp("579b0acaf2aeb6f4028edc20")
                .andBuilds()
                .andNurses()
                .andWorships()
                .in("W13N46")
                .butOnlyIf(true),

            /*----------------------------------------------
                            Remote Creeps
            ----------------------------------------------*/

            //W13N47----------------------------------------

            new CreepModel("claimer", [CLAIM,MOVE,MOVE])
                .claims()
                .in("W13N47"),

            new CreepModel("remote_miner_c", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests("577b93510f9d51615fa47f96")
                .in("W13N47")
                .andDropsIt(),

            new CreepModel("remote_hauler_c", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE])
                .finds(RESOURCE_ENERGY)
                .in("W13N47")
                .andDeposits("579ca48be92bc9ac3c6ddbdb"),

            //W12N46----------------------------------------

            new CreepModel("remote_miner_d", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests("577b93530f9d51615fa47fdb")
                .in("W12N46")
                .andDropsIt(),

            new CreepModel("remote_hauler_d", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE])
                .finds(RESOURCE_ENERGY)
                .in("W12N46")
                .andDeposits("57a16e89b3af09680f7312b2,57dbaa844bc85b8f35024f0c")
                .withFriends(2),

            new CreepModel("claimer_d", [CLAIM,MOVE,MOVE])
                .claims()
                .in("W12N46"),

            //W12N45----------------------------------------
            
            new CreepModel("remote_miner_g", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE])
                .harvests("577b93530f9d51615fa47fdd")
                .in("W12N45")
                .andDropsIt(),
                
            new CreepModel("remote_hauler_g", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .finds(RESOURCE_ENERGY)
                .in("W12N45")
                .andDeposits("57c1abfc37084c8f4b0614d8")
                .in("W12N46"),
                
            new CreepModel("claimer_g", [CLAIM,MOVE])
                .claims()
                .in("W12N45"),

            //W11N45----------------------------------------
            
            new CreepModel("remote_miner_h1", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests("577b93560f9d51615fa48021")
                .in("W11N45")
                .andDropsIt(),
                
            new CreepModel("remote_miner_h2", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests("577b93560f9d51615fa48020")
                .in("W11N45")
                .andDropsIt(),
                
            new CreepModel("remote_hauler_h", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                    CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .finds(RESOURCE_ENERGY)
                .in("W11N45")
                .andBuilds()
                .andDeposits("57c1abfc37084c8f4b0614d8")
                .in("W12N46")
                .via("Sloth"),
              
            new CreepModel("claimer_h", [CLAIM,MOVE])  
                .claims()
                .in("W11N45"),
            
            {
                role: 'obsolete',
                count: 0,
                stats: [MOVE],
                action: obsolete
            },

        ] //End of Satellite 1 Creeps
    };

    // console.log("Second Room Setup: " + (Game.cpu.getUsed() - start) + " out of " + Game.cpu.limit);

    return room;
}

