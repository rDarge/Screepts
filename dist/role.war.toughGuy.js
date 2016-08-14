/*
 * This guy is supposed to peek into the room and drain the room's energy! He'll crack away at the entryPoint while he's tanking hits
 */
 
toughGuy = {
    pickup: function(creep) {
        //Short circuit here to move to the appropriate room that we haven't been to yet
        
        if(creep.getActiveBodyparts(HEAL) > 0) {
            creep.heal(creep);
        }
        
        if(creep.memory.fighting && creep.hits < 3000) {
            creep.memory.fighting = false;
	    }
	    if(!creep.memory.fighting && creep.hitsMax == creep.hits) {
	        creep.memory.fighting = true;
	    }
        
        if(creep.memory.fighting && creep.pos.roomName == Game.flags.entrypoint.pos.roomName) {
            var breakThisWall = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags.entrypoint);
            if(breakThisWall.length > 0) {
                breakThisWall = breakThisWall[0];
                if(creep.dismantle(breakThisWall) == ERR_NOT_IN_RANGE){
                    creep.moveTo(breakThisWall);
                } else {
                    console.log("attacking " + breakThisWall);
                }
            } else {
                

                var helpTheseCreeps = creep.room.find(FIND_MY_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax - 100});
        
                if(helpTheseCreeps.length > 0) {
                    index = 0; 
                    result = ERR_NOT_IN_RANGE;
                    while(result != OK  && index < helpTheseCreeps.length){
                        helpThisGuy = helpTheseCreeps[index];
                        result = creep.heal(helpThisGuy);
                        xdiff = Math.abs(creep.pos.x - helpThisGuy.pos.x);
                        ydiff = Math.abs(creep.pos.y - helpThisGuy.pos.y);
                        console.log(xdiff +"  " + ydiff);
                        if(result == ERR_NOT_IN_RANGE && xdiff < 3 && ydiff < 3) {
                            creep.say("lol");
                            creep.moveTo(helpThisGuy);
                        }
                        index++;
                    }
                    if(result != OK) {
                        creep.moveTo(Game.flags.entrypoint);
                    }
                } else {
                    creep.moveTo(Game.flags.entrypoint);
                }
            }
        } else if (creep.memory.fighting) {
            creep.moveTo(Game.flags.entrypoint);
        } else {
            creep.moveTo(Game.flags.trenches);
        }
    }
}

module.exports = toughGuy;