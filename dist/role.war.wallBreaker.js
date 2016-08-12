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

        // creep.moveTo(Game.flags.cs);
        //See if we got to the waypoint
        if(!creep.memory.waypoint && creep.pos.roomName == Game.flags.waypoint.pos.roomName){
            creep.memory.waypoint = true;
        } else if(!creep.memory.waypoint) {
            creep.moveTo(Game.flags.waypoint);
        }
        
        if (creep.memory.waypoint && !creep.memory.waypoint2 && creep.pos.roomName == Game.flags.waypoint2.pos.roomName){
            creep.memory.waypoint2 = true;
        } else if (!creep.memory.waypoint2 && creep.memory.waypoint) {
            creep.moveTo(Game.flags.waypoint2);
        }

        if (creep.memory.waypoint2 && !creep.memory.waypoint4 && creep.pos.roomName == Game.flags.waypoint4.pos.roomName){
            creep.memory.waypoint4 = true;
        } else if (!creep.memory.waypoint4 && creep.memory.waypoint2) {
            creep.moveTo(Game.flags.waypoint4);
        }
        
        if(creep.memory.waypoint4) {
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
                    breakThis = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: (structure) => structure.structureType == 'extension'});
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
                // creep.moveTo(Game.flags.trenches);
            }
        }
        
    }
}

module.exports = wallBreaker;