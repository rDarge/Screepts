

//Old roles
var obsolete = require('role.obsolete');

module.exports = function() {
    // var start = Game.cpu.getUsed();

    //Reference Constants
    var THIS_ROOM = Game.rooms.W14N47;
    var THIS_SPAWN = Game.spawns.Spawn4;
    var STORAGE = "57ab15daddb24c075a4cced8";
    var MINERAL = Game.getObjectById("577b954d4cfed28730762663");

    var remoteRooms = ["W15N45", "W15N47"];
    var invadedRooms = remoteRooms.filter((value) => Memory["cached_rooms"][value].evacuating > 0);

    var droppedEnergy = THIS_ROOM.find(FIND_DROPPED_ENERGY);

    //For convenience
    keeperMinerStats = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                        CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
     
    var room = {
        name: "Satellite 2",
        room: THIS_ROOM,
        spawn: THIS_SPAWN,
        link: "57adf862d4089220049deb82",
        creeps:[

            /*---------------------------------------------
                            Local Creeps
            ---------------------------------------------*/
            new CreepModel("backupHauler", [CARRY,CARRY,MOVE])
                .picksUp        (STORAGE)
                .andNurses      ()
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CREEPS).length < 5),

            new CreepModel("harvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b934e0f9d51615fa47f3d")
                .andDeposits    ("57ae203b1c0e8d5f13274ec9,57ae0b8a96b32105101daca4"),

            new CreepModel("nurse", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,
                                     MOVE,MOVE])
                .picksUp        (STORAGE)
                .andNurses      ()
                .withFriends    (2),

            new CreepModel("closeHarvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b934e0f9d51615fa47f3e")
                .andDeposits    ("57a86def632092b170c23498")
                .andDropsIt     (),

            new CreepModel("closeHauler", [CARRY,CARRY,MOVE])
                .picksUp        ("57a7fdb236786db0629f4b23")
                .andDeposits    (STORAGE),
                
            new CreepModel("utriarch", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       (MINERAL.id,RESOURCE_UTRIUM)
                .andDeposits    ("57bae5045d0888d369f94cf2")
                .butOnlyIf      (MINERAL.mineralAmount > 0),

            new CreepModel("linkTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        ("57adf862d4089220049deb82")
                .andDeposits    (STORAGE),
                
            new CreepModel("towerTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        ("57adf862d4089220049deb82")
                .andDeposits    ("57cf3129a4eceb9c2454b8fd,57da0adb9e29076b43cef2fb,57da115bfc7838895ccb2f74,57da628b0cc1bec4635edf21,57a86def632092b170c23498,57ae203b1c0e8d5f13274ec9"),

            new CreepModel("reclaimer", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .andDeposits    (STORAGE)
                .butOnlyIf      (true),//_.sum(droppedEnergy.map((energy) => energy.amount)) > 500 ? 1 : 0),

            new CreepModel("roadFixer", [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("road"),
                
            new CreepModel("rampartFixer", [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("rampart"),
                
            new CreepModel("wallFixer", [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("constructedWall"),

            new CreepModel("upgrader", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andWorships    ()
                .withFriends    (1),
                
            new CreepModel("extra_builder", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                    CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andBuilds      ()
                .withFriends    (1)
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CONSTRUCTION_SITES).length > 0),

            /*----------------------------------------------
                            Remote Creeps
            ----------------------------------------------*/

            new CreepModel("remote_miner_guard",
                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,
                     ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL])
                .attacks        ()
                .in             (invadedRooms[0])
                .butOnlyIf      (invadedRooms.length > 0),

            new CreepModel("keeperKiller",
                    //STRONK
                    // [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,
                    //  MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,
                    //  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
                    //  ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,
                    //  MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL]

                    //Just Alright
                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,
                     ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,HEAL]

                     )
                .attacks        ()
                .in             ("W15N45")
                .butOnlyIf      (true),

            //Portal Creeps

            new CreepModel("pioneer", [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE])
                .harvests       ("576ab342400bc3bc61d76274", RESOURCE_CATALYST)
                .in             ("W15S35")
                .via            ("portal")
                .andDropsIt     ()
                .andIsBrave     ()
                .butOnlyIf(false),

            new CreepModel("pioneer_hauler", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .finds          (RESOURCE_CATALYST)
                .in             ("W15S35")
                .via            ("portal")
                .andDeposits    (STORAGE)
                .via            ("portal2")
                .andIsBrave     ()
                .withFriends    (2)
                .butOnlyIf(false),

            //This guy helps lay roads

            new CreepModel("handyman", 
                    [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,
                     MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .in             ("W14N47")
                .andBuilds      ()
                // .andRepairs     ("road")
                .in             ("W15N45")
                .via            ("handyman")
                .andIsBrave     ()
                .butOnlyIf      (false),

            // W15N47 - Disabled till we can get max value from the other room

            new CreepModel("claimer_a", [CLAIM,MOVE,MOVE])
                .claims         ()
                .in             ("W14N48")
                .butOnlyIf      (false),

            new CreepModel("remote_miner_a", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       ("577b934e0f9d51615fa47f3a")
                .in             ("W14N48")
                .andDropsIt     ()
                .butOnlyIf      (false),
                
            new CreepModel("remote_miner_b", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       ("577b934e0f9d51615fa47f39")
                .in             ("W14N48")
                .andDropsIt     ()
                .butOnlyIf      (false),
                
            new CreepModel("deliveryMan", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .in             ("W14N47")
                .andDeposits    ("57d4e809c4e0422217650d62")
                .in             ("W14N48")
                .withFriends    (2)
                .butOnlyIf      (false),
                

            new CreepModel("remote_hauler_a", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .in             ("W15N47")
                .andDeposits    (STORAGE)
                .butOnlyIf      (false),

            //Center Room

            new CreepModel("remote_miner_hydro", 
                    [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       ("577b9559e2e3e3f6319eb41e", RESOURCE_HYDROGEN)
                .in             ("W15N45")
                .andDropsIt     ()
                .andIsBrave     ()
                .butOnlyIf      (Game.getObjectById(STORAGE).store[RESOURCE_HYDROGEN] < 100000 ? 1 : 0),

            new CreepModel("remote_hauler_hydro",
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
                     MOVE,MOVE,MOVE,MOVE,MOVE])
                .finds          (RESOURCE_HYDROGEN)
                .in             ("W15N45")
                .andDeposits    (STORAGE)
                .andIsBrave     ()
                .butOnlyIf      (Game.getObjectById(STORAGE).store[RESOURCE_HYDROGEN] < 100000 ? 1 : 0),

            new CreepModel("remote_miner_k1", keeperMinerStats)
                .harvests       ("577b934b0f9d51615fa47ef0")
                .in             ("W15N45")
                .andDropsIt     ()
                .andIsBrave     (),

            new CreepModel("remote_miner_k2", keeperMinerStats)
                .harvests       ("577b934b0f9d51615fa47ef1")
                .in             ("W15N45")
                .andDropsIt     ()
                .andIsBrave     (),

            new CreepModel("remote_miner_k3", keeperMinerStats)
                .harvests       ("577b934b0f9d51615fa47ef2")
                .in             ("W15N45")
                .andDropsIt     ()
                .andIsBrave     (),

            new CreepModel("remote_hauler_k2",
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                     CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .in             ("W15N45")
                .andDeposits    ("57b52df12221d8ab76e32b70,57c0909867991cac70a16bbc")
                .andIsBrave     ()
                .withFriends    (8),

            /*----------------------------------------
                        Peacetime Creeps
            ----------------------------------------*/
            new CreepModel("extra_upgrader", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                     MOVE])
                .picksUp        (STORAGE)
                .andWorships    ()
                .withFriends    (0),

            
            //Here for legacy purposes
            {
                role: 'obsolete',
                count: 0,
                stats: [MOVE],
                action: obsolete
            }
        ]
    }

    // console.log("Third Room Setup: " + (Game.cpu.getUsed() - start) + " out of " + Game.cpu.limit);
    return room;
}