/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.pickup.structure');
 * mod.thing == 'a thing'; // true
 */
 
var pickupStructure = {
    pickup: function(creep) {
        if(!creep.memory.pickupStructure) {
            console.log("Creep " + creep.name + " not properly configured to use pickupStructure behavior!");
            return ERR_INVALID_TARGET;
        }
        
        // creep.say('dero');
        
        var structureId = creep.memory.pickupStructure;
        var structure = Game.getObjectById(structureId);
        
        if(structure == null) {
            //Short circuit here to move to the appropriate room that we haven't been to yet
            creep.moveTo(new RoomPosition(25, 25, creep.memory.pickupRoom), {ignoreCreeps: false});
            return;
        }
        
        //Transfer type logic:
        resourceType = creep.getResourceType();
        
        result = creep.pickup(creep.room.lookForAt(resourceType,structure.pos)[0]);

        creep.say(_.sum(creep.carry) + "/" + creep.carryCapacity);
        if(creep.withdraw(structure, resourceType) == ERR_NOT_IN_RANGE){
            creep.moveTo(structure, {ignoreCreeps: false});
        } else if (result != OK) {
            return false;
        }
        
        return true;
    }
}

module.exports = pickupStructure;