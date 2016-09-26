//Old roles
var obsolete = require('role.obsolete');

module.exports = function() {
    //Main Configuration
    var THIS_ROOM = Game.rooms.W14N48;
    var THIS_SPAWN = Game.spawns.Spawn9;
    var MINERAL = Game.getObjectById("577b954d4cfed28730762662");
    var TOWERS = "57d3a3024885f21e29bed916,57d765fe60c5cede1fd0066b";
    var TARGET_WALL_HEALTH = 1000000;

    var STORAGE_LINK = "57dc8d7ec3fa999b339b1dfa"
    var STORAGE = "57d4e809c4e0422217650d62"

    var CLOSE_SOURCE = "577b934e0f9d51615fa47f3a"
    var CLOSE_LINK = "57d767bb226cc2a73a58c186"

    var FAR_SOURCE = "577b934e0f9d51615fa47f39"
    var FAR_LINK = "57d79fdae1ff80b165576f18"

    /*
    var roomCreeps = [];

    //Backup Utility Creep
    roomCreeps.push(new BackupCreep(CLOSE_SOURCE, STORAGE_LINK))

    //Harvesters come first
    roomCreeps.push(new Harvester(CLOSE_SOURCE, CLOSE_LINK)); //Scales size based on GCL
    roomCreeps.push(new Harvester(FAR_SOURCE, FAR_LINK)));

    //Then comes the first Haulers/Link Tenders
    if(GCL < 5) {
        roomCreeps.push(new Hauler(CLOSE_SOURCE,STORAGE));
    } else {
        roomCreeps.push(new Hauler(STORAGE_LINK,STORAGE));
    }

    //Replenish creeps!
    roomCreeps.push(new Nurse(STORAGE));

    //Second Haulers after the nurse
    if(GCL < 6) {
        roomCreeps.push(new Hauler(FAR_SOURCE,STORAGE));
    }

    //Utility creeps next
    roomCreeps.push(new Builder(STORAGE)); //Bake in road repair when idle
    roomCreeps.push(new Mason(STORAGE, TARGET_WALL_HEALTH));  //Fixes walls 
    roomCreeps.push(new Gatekeeper(STORAGE, TARGET_WALL_HEALTH)); //Fixes ramparts

    //Then the upgraders
    roomCreeps.push(new Upgrader(STORAGE)); //Scales with storage contents

    //In the event of creep obsoletion
    roomCreeps.push(new Reclaimer(STORAGE));
    roomCreeps.push(new Obsolete());
    */

    var remoteRooms = [];
    var invadedRooms = remoteRooms.filter((value) => Memory["cached_rooms"][value].evacuating > 0);

    var droppedEnergy = THIS_ROOM.find(FIND_DROPPED_ENERGY);
     
    room = {
        name: "Krypton",
        room: THIS_ROOM,
        spawn: THIS_SPAWN,
        link: STORAGE_LINK,
        towerDefense: 1000,
        creeps:[

            /*---------------------------------------------
                            Local Creeps
            ---------------------------------------------*/
            new CreepModel("backupHauler", [CARRY,CARRY,WORK,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .picksUp        (STORAGE_LINK)
                .harvests       (CLOSE_SOURCE)
                .andNurses      ()
                .andDeposits    (STORAGE)
                .butOnlyIf      (false),

            //Disabled until higher level
            new CreepModel("closeHarvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       (CLOSE_SOURCE)
                .andDeposits    (CLOSE_LINK)
                .butOnlyIf      (true), 

            // Disable after GCL5
            // new CreepModel("closeHauler", 
            //         [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            //         WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
            //     .picksUp        ("57d767bb226cc2a73a58c186")
            //     .andDeposits    (STORAGE)
            //     .butOnlyIf      (false),

            new CreepModel("nurse", [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                    WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .picksUp        (STORAGE_LINK)
                .andNurses      ()
                .andDeposits    (TOWERS)
                .withFriends    (1),

            new CreepModel("farHarvester", [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       (FAR_SOURCE)
                .andDeposits    (FAR_LINK)
                .butOnlyIf      (true),

            // Disable after GCL6
            // new CreepModel("farHauler", 
            //         [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
            //         MOVE,MOVE,MOVE,MOVE,MOVE])
            //     .picksUp        ("57d2ef20da37bb2a36963b23")
            //     .andDeposits    (STORAGE)
            //     .butOnlyIf      (false),

            //Disabled until GCL5
            new CreepModel("linkTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        (STORAGE_LINK)
                .andDeposits    (STORAGE),
                
            //Disabled Until Combat
            new CreepModel("towerTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andDeposits    (TOWERS)
                .butOnlyIf      (true),
            
            new CreepModel("keatonite", 
                [WORK,WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       (MINERAL.id,RESOURCE_KEANIUM)
                .andDeposits    ("57df9701ef1f8ce97ca85271")
                .butOnlyIf      (MINERAL.mineralAmount > 0),

            new CreepModel("reclaimer", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .picksUp        (STORAGE_LINK)
                .andDeposits    (STORAGE)
                .butOnlyIf      (_.sum(droppedEnergy.map((energy) => energy.amount)) > 300 ? 1 : 0),

            new CreepModel("wallFixer", [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("constructedWall",1000000)
                .butOnlyIf(false),
                
            new CreepModel("roadFixer", [CARRY,CARRY,WORK,WORK,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("road"),

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
                .andWorships    ()
                .butOnlyIf      (true),

            new CreepModel("upgrader", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
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
    }

    return room;
}