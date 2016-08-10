/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.deposit.controller');
 * mod.thing == 'a thing'; // true
 */
 
var depositController = {
    deposit: function(creep) {
        if(creep.memory.depositRoom && creep.memory.depositRoom != creep.pos.roomName) {
            creep.moveTo(new RoomPosition(25,25,creep.memory.depositRoom));
        } else if(creep.memory.room != creep.pos.roomName && creep.memory.depositRoom != creep.pos.roomName) {
            creep.moveTo(new RoomPosition(25,25,creep.memory.room));
        } else {
            
            result = creep.upgradeController(creep.room.controller);
            if(creep.memory.depositWaypoint) {
                creep.moveTo(Game.flags[creep.memory.depositWaypoint]);
            } else if(result == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
        }
    }, 
    
    name: "depositController"
}

module.exports = depositController;