module.exports = function() {

	RoomModel = function RoomModel(sourceRoom){


	}

	//TODO: Abstract parameters into room model object, see above
	BackupGroup = function BackupGroup(STORAGE_LINK, RESOURCE_ENERGY, CLOSE_SOURCE, THIS_ROOM) {
		return [
            new CreepModel("rescueTheRoom", 
                    [CARRY,CARRY,MOVE])
                .picksUp(STORAGE_LINK)
                .finds(RESOURCE_ENERGY)
                .harvests(CLOSE_SOURCE)
                .andNurses      ()
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CREEPS).length < 5),
        ];	
	}

	HomeTeam = function HomeTeam(CLOSE_SOURCE, CLOSE_LINK, FAR_SOURCE, FAR_LINK, STORAGE, STORAGE_LINK, TOWERS, droppedEnergy) {
		return [
            new CreepModel("harvester", 
                    [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       (CLOSE_SOURCE)
                .andDeposits    (CLOSE_LINK), 

            new CreepModel("hauler", 
                    [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .finds(RESOURCE_ENERGY)
                .andDeposits    (STORAGE)
                .withFriends    (CLOSE_LINK == false ? 2 : 1)
                .butOnlyIf      (FAR_LINK == false),

            new CreepModel("linkTender", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE_LINK)
                .andDeposits    (STORAGE),

            new CreepModel("nurse", 
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                    WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andNurses      ()
                .andDeposits    (TOWERS),

            new CreepModel("farHarvester", 
                    [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
                .harvests       (FAR_SOURCE)
                .andDeposits    (FAR_LINK),
                
            new CreepModel("reclaimer", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .finds          (RESOURCE_ENERGY)
                .picksUp        (STORAGE_LINK)
                .andDeposits    (STORAGE)
                .butOnlyIf      (_.sum(droppedEnergy.map((energy) => energy.amount)) > 300 ? 1 : 0),
                
            new CreepModel("towerTender", [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andDeposits    (TOWERS)
                .butOnlyIf      (TOWERS != false),
            ]
	}

	MaintenanceCrew = function MaintenanceCrew(THIS_ROOM, STORAGE, WALL_TARGET, BUILD_THRESHOLD) {
		return [
            new CreepModel("wallFixer", 
                    [CARRY,CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andBuilds      ("constructedWall")
                .andRepairs     ("constructedWall", WALL_TARGET),

            new CreepModel("roadFixer", 
                    [CARRY,CARRY,WORK,WORK,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("road")
                .andWorships    ()
                .butOnlyIf      (Game.getObjectById(STORAGE).store[RESOURCE_ENERGY] > BUILD_THRESHOLD),

            new CreepModel("rampartFixer", 
                    [CARRY,CARRY,WORK,WORK,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andRepairs     ("rampart", WALL_TARGET) 
                .andWorships    ()
                .butOnlyIf      (Game.getObjectById(STORAGE).store[RESOURCE_ENERGY] > BUILD_THRESHOLD),

            new CreepModel("builder", 
                    [WORK,WORK,WORK,WORK,WORK,
                    CARRY,CARRY,CARRY,CARRY,CARRY,
                    MOVE,MOVE,MOVE,MOVE,MOVE])
                .picksUp        (STORAGE)
                .andBuilds      ()
                .butOnlyIf      (THIS_ROOM.find(FIND_MY_CONSTRUCTION_SITES).length > 0 && Game.getObjectById(STORAGE).store[RESOURCE_ENERGY] > BUILD_THRESHOLD),
        ];
	}

	MineralCrew = function MineralCrew(MINERAL, DESTINATION) {
		return [
            new CreepModel("miner", 
                [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                 CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                 MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE])
                .harvests       (MINERAL.id,MINERAL.mineralType)
                .andDeposits    (DESTINATION)
                .butOnlyIf      (MINERAL.mineralAmount > 0 && DESTINATION != false),
            ];
	}

	UpgradeCrew = function UpgradeCrew(STORAGE) {
		return [
            new CreepModel("baby_upgrader", [WORK,CARRY,MOVE])
                .picksUp        (STORAGE)
                .andWorships    ()
                .butOnlyIf      (Game.getObjectById(STORAGE).store[RESOURCE_ENERGY] < 100000),

            new CreepModel("upgrader", 
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                     WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,
                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                     )
                .picksUp        (STORAGE)
                .andWorships    ()
                .butOnlyIf      (Game.getObjectById(STORAGE).store[RESOURCE_ENERGY] > 100000),
        ];
	}

	RemoteCrew = function RemoteCrew(REMOTE_ROOMS, INVADED_ROOMS) {
		var crew = [];

		for (var remoteRoom in REMOTE_ROOMS) {
	        try {

	            if(REMOTE_ROOMS.hasOwnProperty(remoteRoom)) {
	                var roomSources = REMOTE_ROOMS[remoteRoom].SOURCES;
	                var destination = REMOTE_ROOMS[remoteRoom].DESTINATION;

	                //Spawn one claimer
	                Array.prototype.push.apply(crew,[
	                    new CreepModel("claimer_" + remoteRoom, [CLAIM,MOVE])
	                        .claims         ()
	                        .in             (remoteRoom)
	                        .butOnlyIf      (true)
	                ]);

	                //Spawn a miner/hauler pair for each source specified
	                for(var source in roomSources) {
	                    Array.prototype.push.apply(crew, [
	                        new CreepModel("remote_miner_" + remoteRoom + "_" + source, [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE])
	                            .harvests       (roomSources[source])
	                            .in             (remoteRoom)
	                            .andDropsIt     (),

	                        new CreepModel("remote_hauler_" + remoteRoom + "_"  + source, 
	                                [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,
	                                CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
	                                MOVE])
	                            .finds          (RESOURCE_ENERGY)
	                            .in             (remoteRoom)
	                            .andDeposits    (destination)
	                    ]);
	                }

					
	                Array.prototype.push.apply(crew, [
	                	 //TODO not all rooms can spawn such a mighty defender
	                	 new CreepModel("remote_miner_guard",
			                    [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,
			                     MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,
			                     ATTACK,ATTACK,ATTACK,ATTACK,HEAL,HEAL])
			                .attacks        ()
			                .in             (INVADED_ROOMS[0])
			                .butOnlyIf      (INVADED_ROOMS.length > 0),

			            //Disabled for now till I implement a dynamic need-based check
	                    new CreepModel("adventurer", [CARRY,CARRY,WORK,WORK,MOVE,MOVE])
	                        .finds          (RESOURCE_ENERGY)
	                        .in             (remoteRoom)
	                        .andBuilds      ()
	                        .in             (remoteRoom)
	                        .butOnlyIf      (false),
	                ]);
	            }
	        } catch (ex) {
	            console.log(ex);
	        }
	    }

	    return crew;
	}

	ObsoleteRole = function ObsoleteRole() {

	}


}