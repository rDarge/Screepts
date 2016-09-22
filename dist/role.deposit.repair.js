/*
 * Return true if you did this operation
 */
 
var wallHits = 4000000;

var depositRepair = {
    deposit: function(creep) {
        
        if(creep.memory.wallHits) {
            wallHits = creep.memory.wallHits;
        }
        
        if(!creep.memory.repairTargetTypes){
            console.log("Creep " + creep.name + " not configured to repair any types, but is using depositRepair behavior!");
            return ERR_INVALID_TARGET;
        }

        if(creep.memory.depositRoom && creep.memory.depositRoom != creep.pos.roomName) {
            creep.tryToRepairRoads();
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
                         //TODO this sort is busted
            }}).sort((a, b) => creep.getDistanceTo(a) - creep.getDistanceTo(b) /*(Math.round(a.hits/5000)*5000/Math.min(a.hitsMax,wallHits)*100.0) - (Math.round(b.hits/5000)*5000/Math.min(a.hitsMax,wallHits)*100.0)*/);
            // console.log(targetTypes[index] + targets.length);
            index = index + 1;
        }
        
        // console.log(creep.name + " should repair " + targets.length + "things");
        if(targets.length > 0) {

            result = creep.repair(targets[0]);
            if(result == OK) {
                creep.report("repaired", creep.getActiveBodyparts(WORK));
            }

            if(result == ERR_NOT_IN_RANGE) {
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