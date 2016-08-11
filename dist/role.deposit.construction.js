/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.deposit.construction');
 * mod.thing == 'a thing'; // true
 */

var depositConstruction = {
    deposit: function(creep) {
        //Short-circuit if we don't have any parts
        if(creep.getActiveBodyparts(WORK) == 0) {
            return false; 
        }

        //Otherwise do work!
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length > 0) {
            // console.log("There are " + targets.length + " things to build in room "+creep.room.name+"!");
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {ignoreCreeps: false});
            }
        }
        return targets.length > 0;
    }, 
    
    name: "depositConstruction"
}

module.exports = depositConstruction;