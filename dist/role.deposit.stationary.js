/*
 * Supports 3 use cases
    1. Container exists below the creep, and is fully repaired: drop energy
    2. Container exists below the creep, but is not fully repaired: repair container
    3. Construction site exists below the creep: build it
    
    TODO: Will have issues with multiple structures on the same block
 */
 
var depositStationary = {
    deposit: function(creep) {

        var resourceType = creep.getResourceType();
        var container = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES,creep.pos);

        //Either build a container for yourself
        if(container.length > 0) {
            creep.buildAndReport(Game.getObjectById(container[0].id));
        } else {
            container = creep.room.lookForAt(LOOK_STRUCTURES,creep.pos)
                .map((structure) => Game.getObjectById(structure.id))
                .filter((structure) => structure.structureType == 'container');
            container = container[0];
            
            //Or try and repair it if it's busted
            var resourceType = creep.getResourceType();
            if(container && container.hits < container.hitsMax) {
                result = creep.repairAndReport(container);
            } else {
                //Otherwise deposit your LOOT
                result = creep.dropAndReport(resourceType);
            }
        }
    }
}

module.exports = depositStationary;