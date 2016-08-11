/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.deposit.tower');
 * mod.thing == 'a thing'; // true
 */
 
var depositTower = {
    deposit: function(creep) {
        var towers = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == 'tower' && structure.energy < 600})
        if(towers.length > 0 && creep.transfer(towers[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(towers[0]);
        }
        
        return towers.length > 0;
    }, 
    
    name: "depositTower"
}

module.exports = depositTower;