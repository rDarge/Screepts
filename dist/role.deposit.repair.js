/*
 * Return true if you did this operation
 */
 
var wallHits = 150000;

var depositRepair = {
    deposit: function(creep) {
        if(!creep.memory.repairTargetTypes){
            console.log("Creep " + creep.name + " not configured to repair any types, but is using depositRepair behavior!");
            return ERR_INVALID_TARGET;
        }

        if(creep.memory.depositRoom && creep.memory.depositRoom != creep.pos.roomName) {
            creep.moveTo(new RoomPosition(25,25, creep.memory.depositRoom));
            creep.say("I don't belong here");
            return true;
        }
        
        var targetTypes = creep.memory.repairTargetTypes.split(",");
        var index = 0;
        
        var targets = [];
        while(targets.length == 0 && index < targetTypes.length) {
            // console.log(index);
            targets = creep.room.find(FIND_STRUCTURES, {filter: function(structure) { 
                return targetTypes[index]==structure.structureType && 
                        ((structure.structureType == 'constructedWall' && structure.hits < wallHits) ||
                         (structure.structureType == 'rampart' && structure.hits < wallHits) ||
                         (structure.structureType == 'road' && structure.hits < structure.hitsMax) ||
                         (structure.structureType == 'container' && structure.hits < structure.hitsMax));
            }});
            // console.log(targetTypes[index] + targets.length);
            index = index + 1;
        }
        
        // console.log(creep.name + " should repair " + targets.length + "things");
        if(targets.length > 0) {
            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
                creep.say(targets[0].structureType);
            }
        }
        // console.log(targets.length > 0)
        return targets.length > 0;
    }, 
    
    name: "depositRepair"
}

module.exports = depositRepair;