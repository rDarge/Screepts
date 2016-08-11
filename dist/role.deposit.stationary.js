/*
 * Supports 3 use cases
    1. Container exists below the creep, and is fully repaired: drop energy
    2. Container exists below the creep, but is not fully repaired: repair container
    3. Construction site exists below the creep: build it
    
    TODO: Will have issues with multiple structures on the same block
 */
 
var depositStationary = {
    deposit: function(creep) {
        
        var container = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES,creep.pos);
        // console.log("there is a " + container + " at " + container.pos);
        if(container.length > 0) {
            creep.build(Game.getObjectById(container[0].id));
        } else {
            container = creep.room.lookForAt(LOOK_STRUCTURES,creep.pos)
                .map((structure) => Game.getObjectById(structure.id))
                .filter((structure) => structure.structureType == 'container');
            container = container[0];
            // console.log(creep.name + container + Object.keys(container));
            
            if(container && container.hits < container.hitsMax) {
                result = creep.repair(container);
                // console.log(result);
            } else {
                // console.log('it isnt busted');
                creep.drop(RESOURCE_ENERGY);
            }
        }
    }
}

module.exports = depositStationary;