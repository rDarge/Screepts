var claimer = {
    run: function(creep) {
        
        var target = Game.flags.reserved;
        
        if(creep.memory.target) {
            target = Game.flags[creep.memory.target]
        }
        
        // creep.say("find me");
        // console.log(creep.pos);
        if(creep.room.name != target.pos.roomName) {
            var moveResult =creep.moveTo(target);
            // console.log("claimer on the go in " + creep.pos + ":" + moveResult + " with " + creep.ticksToLive + " ticks to go!");
        }  else {
            if(creep.room.name == 'W14N47') {
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