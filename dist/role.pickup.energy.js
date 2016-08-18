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
        var energy = false;
        
        energy = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.resourceType == resourceType})
                .concat(creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == 'container' && structure.store[resourceType] > 0}))
            .sort((a, b) => {
                var firstAmount = a.amount;
                if(!firstAmount) { 
                    firstAmount = a.store[resourceType];
                }

                var secondAmount = b.amount;
                if(!secondAmount) { 
                    secondAmount = b.store[resourceType];
                }

                return secondAmount - firstAmount;
            });

        if(energy.length > 0) {
            energy = energy[0];

            var result = -1;
            if(energy.amount) {
                result = creep.pickup(energy);
            } else {
                result = creep.withdraw(energy, resourceType);
            }

            if(result == OK) {
                creep.report("scavenged", Math.min(energy.amount, creep.carryCapacity - _.sum(creep.carry)));
            }
            

            creep.say(_.sum(creep.carry) + "/" + creep.carryCapacity);
            if(result == ERR_NOT_IN_RANGE){
                creep.moveTo(energy, {ignoreCreeps: false});
            } else if (result != OK) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
}

module.exports = pickupEnergy;