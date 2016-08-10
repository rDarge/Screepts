/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('main.roadBuilder');
 * mod.thing == 'a thing'; // true
 */
 

var harvesterChain = {
    
    calculatePath: function(room, spawn, source, destination, leadMiner) {
        //Game.spawns.Spawn1
        if(spawn.memory.path == undefined) {
            spawn.memory.path = new Map();
        }
        
        var path = spawn.memory.path;
        if(!path[0]) {
            path = room.findPath(source, destination, ignoreCreeps = true);
            path.forEach(function(element, index, array) {
                path[index] = element.x + "|" + element.y;
                //console.log(index + " is " + path[index]);
            });
            path.splice(0,0,source.x + "|" + source.y);
        }
        //console.log(Object.keys(path));

        var workers = _.filter(Game.creeps, (creep) => (creep.memory.role == 'chainMember') && creep.memory.room == room.name);
        if(leadMiner != null) {
            workers.splice(0,0,leadMiner);
        }
        
        
        //console.log("there are " + workers.length + " members of a " + path.length + " chain!");
        workers.forEach(function(element, index, array) {
            
            if(workers.length < path.length) {
                //console.log("wiping out " + element);
                delete element.memory.chainPosition;
                delete element.memory.dropoffPosition;
                delete element.memory.pickupPosition;
                delete element.memory.chainHead;
                delete element.memory.baseLocation;
                element.memory.helper = true;
            } else {
                if(path[index]) {
                    delete element.memory.helper;
                    //console.log(index + " is " + element + " at " + path[index]) ;
                    
                    //Everyone has their place in line
                    element.memory.chainPosition = path[index];
                    element.memory.index = index;
                    
                    //Logic for the pickup locations
                    if(index == 0) {
                        element.memory.pickupPosition = source.x + "|" + source.y;
                        element.memory.chainHead = true;
                    } else {
                        element.memory.pickupPosition = path[index - 1];
                        delete element.memory.chainHead;
                    }
                    
                    //Logic for the handoffs
                    if(index == path.length - 1) {
                        element.memory.baseLocation = true;
                        element.memory.dropoffPosition = destination.x + "|" + destination.y;
                    } else {
                        element.memory.dropoffPosition = path[index + 1];
                        delete element.memory.baseLocation;
                    }
                    //console.log(element.name + " is at position " + index);
                    
                } else {
                    //console.log("wiping out " + element);
                    delete element.memory.chainPosition;
                    delete element.memory.dropoffPosition;
                    delete element.memory.pickupPosition;
                    delete element.memory.chainHead;
                    delete element.memory.baseLocation;
                    element.memory.helper = true;
                    //console.log(element.name + " is a helper");
                }
            }
            
           //console.log(element.memory.chainPosition); 
        });
        
        
        spawn.memory.path = path;
    }
}


module.exports = harvesterChain;