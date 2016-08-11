/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.war.wallBreaker');
 * mod.thing == 'a thing'; // true
 */
 
murderer = {
    pickup: function(creep) {
        
        if(creep.memory.fighting && creep.hits < 2000) {
            creep.memory.fighting = false;
	    }
	    if(!creep.memory.fighting && creep.hitsMax == creep.hits) {
	        creep.memory.fighting = true;
	    }
        
        if(creep.memory.fighting && creep.pos.roomName == Game.flags.trenches.pos.roomName) {
            
            // //Break the first wall
            var hurtThis = creep.room.find(FIND_HOSTILE_CREEPS);
            console.log(hurtThis);
            
            // //Break the second wall
            // if(hurtThis.length == 0) {
            //     hurtThis = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags.entrypoint2);
            // }
            
            //Break their spawn
            // if(hurtThis.length == 0) {
            //     hurtThis = creep.room.find(FIND_HOSTILE_CREEPS);
            // }
            
            
            if(hurtThis.length != 0) {
                hurtThis = hurtThis[0];
                if(creep.rangedAttack(hurtThis) == ERR_NOT_IN_RANGE){
                    creep.moveTo(hurtThis);
                } else {
                    console.log("attacking " + hurtThis);
                }
            }
        } else {
            creep.moveTo(Game.flags.trenches);
        }
    }
}

module.exports = murderer;