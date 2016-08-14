/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.pickup.source');
 * mod.thing == 'a thing'; // true
 */
 
var pickupSource = {
    pickup: function(creep) {
        if(!creep.memory.pickupSource) {
            console.log("Creep " + creep.name + creep.memory.role  +" not properly configured to use pickupSource behavior!");
            return ERR_INVALID_TARGET;
        }
        
        var sourceId = creep.memory.pickupSource;
        var source = Game.getObjectById(sourceId);
        if(source == null) {
            //Short circuit here to move to the appropriate room that we haven't been to yet
            creep.moveTo(new RoomPosition(25, 25, creep.memory.pickupRoom), {ignoreCreeps: false});
            return true;
        }
        
        
        var container = false;
        if(source.pos.roomName == creep.pos.roomName) {
            container = creep.room.lookForAtArea(LOOK_STRUCTURES, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true)
                                                .filter((container)=>container.structure.structureType == 'container');
        }
        
        if(container.length > 0) {
            container = container[0].structure;
        } else {
            container = false;
        }
        
        if(container && (creep.pos.x != container.pos.x || creep.pos.y != container.pos.y)) {
            result = creep.moveTo(container, {ignoreCreeps: false});
        } else {
            result = creep.moveTo(source, {ignoreCreeps: false});
        }

        if(result == ERR_NO_PATH){
            return false;
        }
        
        result = creep.harvest(source);
        if(result == OK && Game.time % 2 == 0) {
            creep.say("Yum!");
        } else if (result != ERR_NOT_IN_RANGE) {
            return false;
        }
        
        return true;
    }
}

module.exports = pickupSource;