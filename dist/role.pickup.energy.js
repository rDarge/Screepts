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
        // if(!creep.memory.pickupEnergy) {
        //     console.log("Creep " + creep.name + " not properly configured to use pickupStructure behavior!");
        //     return ERR_INVALID_TARGET;
        // }
        
        if(creep.memory.pickupRoom && creep.pos.roomName != creep.memory.pickupRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.pickupRoom), {ignoreCreeps: false});
            return true;
        }
        
        if(creep.memory.pickupEnergy) {
            var energyId = creep.memory.pickupEnergy;
            var energy = Game.getObjectById(energyId);
        } else  {
            energy = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.resourceType == RESOURCE_ENERGY});

            if(energy) {
                energy = energy[0];
            }
        }
        // console.log(energy);
        // creep.say("fuck!");
        
        result = creep.pickup(energy);
        if(result == ERR_NOT_IN_RANGE){
            creep.moveTo(energy, {ignoreCreeps: false});
        } else if (result != OK) {
            return false;
        }
        
        return true;
    }
}

module.exports = pickupEnergy;