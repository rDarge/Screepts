var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var index = creep.memory.buildingSource;
        var source = {pos:new RoomPosition(41,24, creep.room.name)};
        if(index) {
            source = creep.room.sources[parseInt(index)];
        }

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        //Build cool stuff 
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                //Charge the tower
                var towers = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == 'tower' && structure.energy < 600})
                //console.log("chainmembertowers " + towers.length);
                if(towers.length > 0 && creep.transfer(towers[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0]);
                } else {
                    var link = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}})[1];
                    if(link.energy < 800 && creep.transfer(link,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(link);
                    }
                }
                //Otherwise repair the walls
                // targets = creep.room.find(FIND_STRUCTURES, {
                //     filter: 
                //         function(structure) {
                //             return true ;//structure.structureType == "tower";
                //         }
                //     });
                // console.log(targets[0].structureType);
                // if(targets.length < 1) {
                //     if(creep.upgradeController(targets[0]) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(targets[0]);
                //     }
                // }
            }
	    }
	    else {
	        //See if there are any things to destruct
	       // var dTop = creep.memory.destructTop;
	       // var dLeft = creep.memory.destructLeft;
	       // var dBottom = creep.memory.destructBottom;
	       // var dRight = creep.memory.destructRight;
	       // var destructThese = creep.room.lookForAtArea(LOOK_STRUCTURES, dTop, dLeft, dBottom, dRight, true);
	       // if(destructThese.length > 0 && false) {
	       //     creep.say("wreck it!");
	       //     var destructMe = destructThese[0].structure;
	       //     if(destructMe && creep.dismantle(destructMe) == ERR_NOT_IN_RANGE) {
	       //         creep.moveTo(destructMe);
	       //     }
	       // } else {
	            creep.say("picking up the goods!");
	            var container = creep.room.lookForAtArea(LOOK_STRUCTURES, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true)
                            .filter((container)=>container.structure.structureType == 'container')[0];
                if(container){
                    container = container.structure;
                }
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(container);
                }
	       // }
	        
	        
	        //console.log("loading " + creep.carry.energy + " out of " + creep.carryCapacity );
            
	        // creep.moveTo(17,12);
 	        // var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(Game.getObjectById("577b93560f9d51615fa4801a")) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(Game.getObjectById("577b93560f9d51615fa4801a"));
            // }
	    }
	}
};

module.exports = roleBuilder;