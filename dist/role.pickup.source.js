/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.pickup.source');
 * mod.thing == 'a thing'; // true
 */
 
var pickupSource = {
    pickup: function(creep) {
        if(!creep.memory.pickupSource) {
            console.log("Creep " + creep.name + creep.memory.role  +" not properly configured to use pickupSource behavior!");
            return ERR_INVALID_TARGET;
        }
        
        var sourceId = creep.memory.pickupSource;
        var source = Game.getObjectById(sourceId);
        if(creep.memory.pickupRoom && creep.pos.roomName != creep.memory.pickupRoom) {
            var target = new RoomPosition(25, 25, creep.memory.pickupRoom)
            if(creep.memory.pickupWaypoint && !creep.memory.pickupWaypointVisited) {
                creep.say("to waypoint");
                target = Game.flags[creep.memory.pickupWaypoint]
                if(creep.getDistanceTo(target) < 2 && creep.pos.roomName == target.roomName) {
                    console.log("welp");
                    creep.memory.pickupWaypointVisited = true;
                }
            } 

            //Short circuit here to move to the appropriate room that we haven't been to yet
            creep.moveTo(target, {ignoreCreeps: false});
            return true;
        }
        
        
        var container = false;
        if(source.pos.roomName == creep.pos.roomName) {
            container = creep.room.lookForAtArea(LOOK_STRUCTURES, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true)
                                                .filter((container)=>container.structure.structureType == 'container');
        }
        
        if(container.length > 0) {
            container = container[0].structure;
        } else {
            container = false;
        }
        
        var targetX = source.pos.x;
        var targetY = source.pos.y;
        if(container && (creep.pos.x != container.pos.x || creep.pos.y != container.pos.y)) {
            result = creep.moveTo(container);
            targetX = container.pos.x;
            targetY = container.pos.y;
        } else {
            result = creep.moveTo(source);
        }

        if(result == ERR_NO_PATH){
            return false;
        }

        // console.log(creep.name + result);
        

        resourceType = creep.getResourceType();
        if(!container || (container.store[RESOURCE_ENERGY] < container.storeCapacity) || (container.hits < container.hitsMax)) {
            result = creep.harvestAndReport(source);
        } else {
            console.log("lame! Skipping harvest opportunity in room " + creep.pos.roomName);
            creep.report("skipped_harvesting", creep.getActiveBodyparts(WORK) * 2);
        }

        if(result == OK && Game.time % 2 == 0) {
            creep.say("Yum!");
        } else if (creep.room.lookForAt(LOOK_CREEPS, new RoomPosition(targetX,targetY,creep.pos.roomName)).length > 0) {
            creep.say("Welp!");
            return false;
        }
        
        creep.say("Tally-ho!");
        return true;
    }
}

module.exports = pickupSource;