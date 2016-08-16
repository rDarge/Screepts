var keeperKiller = {

    pickup: function(creep) {
        if(!creep.memory.target) {
            console.log(creep.name + " not configured to kill keepersss right!!!");
            return false;
        }

        var target = Game.flags[creep.memory.target];

        // console.log(target);
        if(target.pos.roomName != creep.pos.roomName) {
            creep.say("en route!");
            creep.moveTo(target);
        } else {
            creep.say("attack!");

            hostiles = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), 
                {filter: (hostile) => {return creep.getDistanceTo(hostile) < 5;}})
                .sort((a, b) => creep.getDistanceTo(a) - creep.getDistanceTo(b));

            if(hostiles.length > 0) {
                result = creep.attack(hostiles[0]);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostiles[0]);
                }
            } else {
                if(creep.hits < creep.hitsMax) {
                    creep.heal(creep);
                }
                creep.moveTo(target);
            }
        }
        
        return false; //Do whatever else you'd do
    }
}

module.exports = keeperKiller;