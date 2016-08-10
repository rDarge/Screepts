/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.war.healer');
 * mod.thing == 'a thing'; // true
 */

healer = {
    pickup: function(creep) {
        //Short circuit here to move to the appropriate room that we haven't been to yet
        
        var helpTheseCreeps = creep.room.find(FIND_MY_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax});
        
        if(helpTheseCreeps.length > 0) {
            index = 0; 
            result = ERR_NOT_IN_RANGE;
            while(result != OK  && index < helpTheseCreeps.length){
                helpThisGuy = helpTheseCreeps[index];
                result = creep.heal(helpThisGuy);
                xdiff = Math.abs(Game.flags.trenches.pos.x - helpThisGuy.pos.x);
                ydiff = Math.abs(Game.flags.trenches.pos.y - helpThisGuy.pos.y);
                console.log(xdiff +"  " + ydiff);
                if(result == ERR_NOT_IN_RANGE && xdiff < 3 && ydiff < 3) {
                    creep.say("lol");
                    creep.moveTo(helpThisGuy);
                }
                index++;
            }
            if(result != OK) {
                creep.moveTo(Game.flags.trenches);
            }
        } else {
            creep.moveTo(Game.flags.trenches);
        }
    }
}

module.exports = healer;