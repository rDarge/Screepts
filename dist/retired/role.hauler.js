var hauler = {
    run: function(creep) {
        
        var pickup = creep.room.lookForAt(LOOK_ENERGY, creep)[0];
        creep.pickup(pickup)
        //console.log("pp" + pickup);
        
        var index = creep.memory.sourceIndex;
        var sources = creep.room.find(FIND_SOURCES);
        var source = sources[0];
        
        if(index) {
            source = sources[parseInt(index)];
        }
        
        var sourceId = creep.memory.sourceStructure;
        if(sourceId) {
            source = Game.getObjectById(sourceId);
        }
        
        var target = false;
        var targetId = creep.memory.targetStructure;
        if(targetId) {
            target = Game.getObjectById(targetId);
        }
        
        creep.say("hauling!");
        
        if(creep.memory.hauling && creep.carry.energy == 0) {
            creep.memory.hauling = false;
	    }
	    if(!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.hauling = true;
	    }
        
        if(!creep.memory.hauling) {
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
            
        } else {
            var spawn = Game.spawns.Spawn1;
            var spawnEnergy = creep.room.lookForAtArea(LOOK_ENERGY, spawn.pos.y-1, spawn.pos.x-1, spawn.pos.y+1, spawn.pos.x+1, true)[0];
            //console.log("se" + Object.keys(spawnEnergy));
            if(creep.pickup(spawnEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawnEnergy);
            } else {
                if(target) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity;
                        }
                    });
                    if(targets.length > 0) {
                        creep.say("on the way to " + targets[0]);
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    } else {
                        
                        var towers = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                        if(towers[0].energy < (towers[0].energyCapacity - 150) && creep.transfer(towers[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(towers[0]);
                        } else { 
                            var link = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}})[1];
                            if(link.energy < 800 && creep.transfer(link,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(link);
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = hauler;