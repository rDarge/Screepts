/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.war.healer');
 * mod.thing == 'a thing'; // true
 */

claimer = {
    pickup: function(creep) {
        
        var target = -1;
        if(creep.memory.pickupRoom) {
            target = new RoomPosition(25,25, creep.memory.pickupRoom);
        } else {
            console.log("claimer " + creep + " from room " + creep.memory.room + " and role " + creep.memory.role + " is misconfigured!");
            return false;
        }

        if(creep.pos.roomName != creep.memory.pickupRoom) {
            var moveResult =creep.moveTo(target);
        }  else {
            if(creep.memory.claim) {
                claim = creep.claimController(creep.room.controller);
                if(claim == ERR_NOT_IN_RANGE) {
                    creep.say("gonna claim it!");
                    creep.moveTo(creep.room.controller);
                }
            } else {
                creep.say("reserve!");
                var reserve = creep.reserveController(creep.room.controller);
                // console.log("claimerreserve " +reserve);
                if(reserve == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                } 
            }
        }
    }
}

module.exports = claimer;