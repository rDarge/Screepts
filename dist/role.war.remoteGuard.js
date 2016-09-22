guard = {
    pickup: function(creep) {

        //Move to the offending room
        if(creep.memory.pickupRoom && creep.pos.roomName != creep.memory.pickupRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.pickupRoom), {ignoreCreeps: false});
            return true;
        }
            
        
        //Hurt the things there 
        var hurtThis = creep.room.find(FIND_HOSTILE_CREEPS, 
            {filter: (hostile) => {return (hostile.pos.roomName != 'W15N46');}});
        if(hurtThis.length > 0) {
            hurtThis = hurtThis[0];

            var result;

            if(creep.getActiveBodyparts(ATTACK) > 0) {
                result = creep.attack(hurtThis);
            } else if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                result = creep.rangedAttack(hurtThis);
            } else {
                console.log(creep.name + " with role " + creep.memory.role + " from room " + creep.memory.room + " has no business attacking anything!");
                return false;
            }

            if(result == ERR_NOT_IN_RANGE){
                creep.moveTo(hurtThis);
            } else if (result == OK){
                console.log("attacking " + hurtThis);
            }
        } else {
            creep.say("hooray");
            creep.reportAllClear();
            if(creep.hits < creep.hitsMax) {
                creep.heal(creep);
            }
            creep.moveTo(new RoomPosition(25, 25, creep.memory.pickupRoom));
        }
    }
}

module.exports = guard;