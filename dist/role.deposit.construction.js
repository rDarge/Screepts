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

        //ABSTRACT THIS
        creep.tryToRepairRoads();
        
        if(creep.memory.depositWaypoint && !creep.memory.depositWaypointVisited) {
            waypoint = Game.flags[creep.memory.depositWaypoint];
            creep.moveTo(waypoint);
            
            if(creep.pos.roomName == waypoint.pos.roomName && creep.pos.x == waypoint.pos.x && creep.pos.y == waypoint.pos.y) {
                creep.memory.depositWaypointVisited = true;
            }
        }
        
        
        if(!creep.memory.depositWaypoint || creep.memory.depositWaypointVisited) {

            if(creep.memory.depositRoom && creep.memory.depositRoom != creep.pos.roomName) {
                creep.moveTo(new RoomPosition(25,25, creep.memory.depositRoom));
                creep.say("I don't belong here");
                return true;
            }

            //Otherwise do work!
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES).sort((a, b) => creep.getDistanceTo(a) - creep.getDistanceTo(b));
            if(targets.length > 0) {
                // console.log("There are " + targets.length + " things to build in room "+creep.room.name+"!");
                creep.say(creep.getDistanceTo(targets[0]));

                result = creep.build(targets[0]);
                if(result == OK) {
                    creep.report("constructed", creep.getActiveBodyparts(WORK));
                }

                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {ignoreCreeps: false});
                }
            }
            return targets.length > 0;
        }
        return true;
    }, 
    
    name: "depositConstruction"
}

module.exports = depositConstruction;