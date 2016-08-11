/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.war.wallBreaker');
 * mod.thing == 'a thing'; // true
 */
 
wallBreaker = {
    pickup: function(creep) {
        
        if(creep.memory.fighting && creep.hits < 3000) {
            creep.memory.fighting = false;
	    }
	    if(!creep.memory.fighting && creep.hitsMax == creep.hits) {
	        creep.memory.fighting = true;
	    }
        
        console.log(creep.pos.roomName + Game.flags.entrypoint.pos.roomName);
        if(creep.memory.fighting && creep.pos.roomName == Game.flags.entrypoint.pos.roomName) {
            
            //Break the first wall
            var breakThis = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags.entrypoint);
            
            //Break the second wall
            if(breakThis.length == 0) {
                breakThis = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags.entrypoint2);
            }
            
            //Break their spawn
            if(breakThis.length == 0) {
                breakThis = creep.room.find(FIND_HOSTILE_SPAWNS);
            }
            
            
            if(breakThis.length != 0) {
                breakThis = breakThis[0];
                if(creep.dismantle(breakThis) == ERR_NOT_IN_RANGE){
                    creep.moveTo(breakThis);
                } else {
                    console.log("attacking " + breakThis);
                }
            }
        } else if (creep.memory.fighting) {
            creep.moveTo(Game.flags.entrypoint);
        } else {
            creep.moveTo(Game.flags.trenches);
        }
    }
}

module.exports = wallBreaker;