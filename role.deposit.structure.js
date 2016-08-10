/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.deposit.structure');
 * mod.thing == 'a thing'; // true
 */
 
var depositStructure = {
    deposit: function(creep) {
        creep.say("dst");
        if(!creep.memory.depositStructure) {
            console.log("Creep " + creep.name + creep.memory.role +" not properly configured to use depositStructure behavior!");
            return ERR_INVALID_TARGET;
        }
        
       
        var targets = false;
        var targetIds = creep.memory.depositStructure.split(",");
        if(targetIds) {
            targets = targetIds.map((id) => Game.getObjectById(id));
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
        
        if(target.pos.roomName != creep.pos.roomName) {
            creep.moveTo(target);
        } else if(target) {
            // creep.moveTo(target);
            // console.log(creep.name + Object.keys(target));
            
            result = -1;
            while(result != OK && result != ERR_NOT_IN_RANGE && index < targets.length){
                target = targets[index++];
                result = result = creep.transfer(target, resourceType);
            }
            // console.log(creep.name + result + " and " + resourceType + RESOURCE_ZYNTHIUM);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else if (result == OK) {
                return true;   
            }
            
        }
        return false;   
    }, 
    
    name: "depositStructure"
}

module.exports = depositStructure;