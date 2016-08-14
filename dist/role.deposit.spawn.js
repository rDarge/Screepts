/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.deposit.spawn');
 * mod.thing == 'a thing'; // true
 */
// var nav = require('')
function getDistance(first, second) {
    return Math.sqrt(Math.pow(second.pos.x - first.pos.x,2) + Math.pow(second.pos.y - first.pos.y,2));
}

var depositSpawn = {
    
    deposit: function(creep) {
        // start = Game.cpu.tickLimit;
        try {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            }).sort((a, b) => creep.getDistanceTo(a) - creep.getDistanceTo(b));
            // console.log("Sort took "+  (start - Game.cpu.tickLimit) + " cpu");
        } catch (err) {
            return false;
        }
        
        
        if(targets.length > 0) {
            creep.say(getDistance(creep,targets[0]));
            // creep.say("on the way to " + targets[0]);
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        } else {
            creep.say("welp");
        }
        
        return targets.length > 0;
    }, 
    
    name: "depositSpawn"
}

module.exports = depositSpawn;