var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        //creep.say("upgrading");
        
        var index = creep.memory.sourceIndex;
        var sources = creep.room.find(FIND_SOURCES);
        var source = sources[1];
        if(index != undefined) {
            source = sources[parseInt(index)];
        }
        
        var sourceId = creep.memory.sourceStructure;
        if(sourceId) {
            source = Game.getObjectById(sourceId);
        }

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            creep.say("Gimme!");
            //console.log("loading " + creep.carry.energy + " out of " + creep.carryCapacity );
            var container;
            if(source.structureType == 'storage' || source.structureType == 'link') {
                container = source;
            } else {
                container = creep.room.lookForAtArea(LOOK_STRUCTURES, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true)
                            .filter((container)=>container.structure.structureType == 'container')[0];
                if(container){
                    container = container.structure;
                }
            }
            
            if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(container);
            }
        }
	}
};

module.exports = roleUpgrader;
