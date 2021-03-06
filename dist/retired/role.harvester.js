var roleHarvester = {


    /** @param {Creep} creep **/
    run: function(creep) {
        
        //creep.say("harvesting!");
        
        var index = creep.memory.sourceIndex;
        var sources = creep.room.find(FIND_SOURCES);
        var source = sources[0];
        if(index) {
            source = sources[parseInt(index)];
        }
    
	    if(creep.carry.energy < creep.carryCapacity) {
            //var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source)
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                theController = creep.room.controller;
                if(creep.transfer(theController, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(theController);
                }
            }
        }
	}
};

module.exports = roleHarvester;