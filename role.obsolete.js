/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.obsolete');
 * mod.thing == 'a thing'; // true
 */
 
var obsolete = {
    run: function(creep) {
        if(creep.pos.roomName != creep.memory.room) {
            creep.moveTo(new RoomPosition(25,25, creep.memory.room));
        } else {
            spawn = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}})[0];
            if(spawn.recycleCreep(creep) != OK){
                creep.moveTo(spawn);
            }
        }
    }
}

module.exports = obsolete;