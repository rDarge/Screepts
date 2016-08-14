/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.pickup.energy');
 * mod.thing == 'a thing'; // true
 */
 
var pickupEnergy = {
    pickup: function(creep) {
        
        if(creep.memory.pickupRoom && creep.pos.roomName != creep.memory.pickupRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.pickupRoom), {ignoreCreeps: false});
            return true;
        }

        var resourceType = creep.getResourceType();
        
        if(creep.memory.pickupEnergy) {
            var energyId = creep.memory.pickupEnergy;
            var energy = Game.getObjectById(energyId);
        } else  {
            energy = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.resourceType == resourceType})
                .sort((a, b) => creep.getDistanceTo(a) - creep.getDistanceTo(b));

            if(energy) {
                energy = energy[0];
            }
        }
        
        result = creep.pickup(energy);
        creep.say(_.sum(creep.carry) + "/" + creep.carryCapacity);
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(energy, {ignoreCreeps: false});
        } else if (result != OK) {
            return false;
        }
        
        return true;
    }
}

module.exports = pickupEnergy;