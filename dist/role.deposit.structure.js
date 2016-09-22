/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.deposit.structure');
 * mod.thing == 'a thing'; // true
 */

function getEnergy(structure) {
    if(structure.store) {
        structure.energy = structure.store[RESOURCE_ENERGY];
    }

    return structure.energy;
};

function getSpaceForEnergy(structure) {
    if(structure.store) {
        structure.spaceForEnergy = structure.storeCapacity - _.sum(structure.store);
    } else {
        structure.spaceForEnergy = structure.energyCapacity - getEnergy(structure);
    }

    return structure.spaceForEnergy;
}
 
var depositStructure = {
    deposit: function(creep) {
        // creep.say("dst");
        if(!creep.memory.depositStructure) {
            console.log("Creep " + creep.name + creep.memory.role +" not properly configured to use depositStructure behavior!");
            return ERR_INVALID_TARGET;
        }

        //ABSTRACT THIS
        creep.tryToRepairRoads();
        if(creep.memory.depositWaypoint && !creep.memory.depositWaypointVisited) {
            waypoint = Game.flags[creep.memory.depositWaypoint];
            creep.say(creep.getDistanceTo(waypoint));
            if(creep.pos.roomName == waypoint.pos.roomName && creep.getDistanceTo(waypoint) < 1) {
                creep.say("fouuuuu" + creep.getDistanceTo(waypoint));
                // console.log("woof " + creep.memory.depositWaypointVisited);
                creep.memory.depositWaypointVisited = true;
                // console.log("woof " + creep.memory.depositWaypointVisited);
            }

            creep.moveTo(waypoint);
            
            return;
        }
        
        
        if(!creep.memory.depositWaypoint || creep.memory.depositWaypointVisited) {
            var targets = false;
            var targetIds = creep.memory.depositStructure.split(",");
            if(targetIds) {
                targets = targetIds.map((id) => Game.getObjectById(id)).filter((structure) => getSpaceForEnergy(structure) > 0);
                // target = Game.getObjectById(targetId);
            }
            
            //Transfer type logic:
            resourceType = RESOURCE_ENERGY;
            if(creep.memory.resourceType) {
                resourceType = creep.memory.resourceType;
            } else {
                if(creep.carry.Z > 0) {
                    creep.drop(RESOURCE_ZYNTHIUM);
                } else if (creep.carry.O > 0) {
                    creep.drop(RESOURCE_OXYGEN);
                }
            }
            
            var index = 0;
            var target = targets[index];
            
            if(target && target.pos.roomName != creep.pos.roomName) {
                creep.moveTo(target);
            } else if(target) {
                // creep.moveTo(target);
                // console.log(creep.name + Object.keys(target));
                
                result = -1;
                while(result != OK && result != ERR_NOT_IN_RANGE && index < targets.length){
                    target = targets[index++];

                    result = result = creep.transfer(target, resourceType);

                    if(creep.carry[resourceType] == 0) {
                        creep.memory.depositWaypointVisited = false;
                    }
                }
                // console.log(creep.name + result + " and " + resourceType + RESOURCE_ZYNTHIUM);
                if(result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else if (result == OK) {
                    if(target.structureType == 'tower') {
                        amount = Math.min(target.energyCapacity - target.energy, creep.carry[resourceType]);
                        creep.report("towered", amount);
                    } else if(target.structureType == 'storage') {
                        amount = Math.min(target.storeCapacity - _.sum(target.store), creep.carry[resourceType]);
                        creep.report("stored", amount);
                    } else if(target.structureType == 'link') {
                        amount = Math.min(target.energyCapacity - target.energy, creep.carry[resourceType]);
                        creep.report("linked", amount);
                    }
                    return true;   
                }
                
            }
            return false;  
        }
        
        return true;
    }, 
    
    name: "depositStructure"
}

module.exports = depositStructure;