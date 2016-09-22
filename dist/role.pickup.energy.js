/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.pickup.energy');
 * mod.thing == 'a thing'; // true
 */
 
var pickupEnergy = {
    pickup: function(creep) {
        
        if(creep.memory.pickupRoom && creep.pos.roomName != creep.memory.pickupRoom) {

            var target = new RoomPosition(25, 25, creep.memory.pickupRoom)
            if(creep.memory.pickupWaypoint && !creep.memory.pickupWaypointVisited) {
                target = Game.flags[creep.memory.pickupWaypoint]
                creep.say(creep.getDistanceTo(target));
            } 

            //Pickup energy you find by you
            var maybeEnergy = _.filter(creep.room.lookForAt(LOOK_ENERGY, creep.pos), ((resource) => resource.resourceType == creep.getResourceType()));
            if(maybeEnergy.length > 0) {
                creep.pickup(maybeEnergy[0]);
            }

            //Short circuit here to move to the appropriate room that we haven't been to yet
            creep.moveTo(target, {ignoreCreeps: false});

            if(creep.memory.pickupWaypoint && creep.pos.roomName == target.pos.roomName && creep.getDistanceTo(target) < 2) {
                creep.memory.pickupWaypointVisited = true;
            }
            return true;
        }

        var resourceType = creep.getResourceType();
        var energy = false;
        
        energy = creep.room.find(FIND_DROPPED_ENERGY, {filter: (resource) => resource.resourceType == resourceType})
                .concat(creep.room.find(FIND_STRUCTURES, {filter: (structure) => (structure.structureType == 'container' && structure.store[resourceType] > 0) /*|| 
                                                                                 (structure.owner != 'Garland' && structure.energy != null && structure.energy > 0)*/
                }))
            .sort((a, b) => {
                var firstAmount = Memory["amountCache"][a.id];
                // console.log("retrieving first amount from memory resulted in " + firstAmount);
                if(!firstAmount) {
                    // console.log("getting from amount");
                    firstAmount = a.amount;
                } 
                if(!firstAmount) { 
                    // console.log("getting from store");
                    firstAmount = a.store[resourceType];
                }

                var secondAmount = Memory["amountCache"][b.id];
                // console.log("retrieving second amount from memory resulted in " + secondAmount);
                if(!secondAmount) {
                    // console.log("getting from amount");
                    secondAmount = b.amount;
                }
                if(!secondAmount) { 
                    // console.log("getting from store");
                    secondAmount = b.store[resourceType];
                }
                
                a.totalStuff = firstAmount;
                b.totalStuff = secondAmount;

                if(creep.name=='Avery') console.log(Math.round(secondAmount/200 - firstAmount/200));
                return Math.round(secondAmount/200 - firstAmount/200);
            }).filter((resource) => {
                var theAmount = Memory["amountCache"][resource.id] ? Memory["amountCache"][resource.id] : (resource.amount ? resource.amount : resource.store[resourceType]);
                if(creep.name=='Avery') console.log("filter value = " + theAmount + " for " + resource.id);
                return theAmount > 0;
            });
            
        if (creep.name == 'Avery')
         console.log("Avery sees " + energy.length);

        if(energy.length > 0) {
            energy = energy[0];

            var result = -1;
            if(energy.amount) {
                result = creep.pickup(energy);
            } else {
                result = creep.withdraw(energy, resourceType);
            }
            
            theAmount = Memory["amountCache"][energy.id] ? Memory["amountCache"][energy.id] : energy.totalStuff;//(energy.amount ? energy.amount : energy.store[resourceType]);
            // console.log("There should be " + theAmount + " energy available for " + creep.name);
            claimed = Math.min(theAmount, creep.carryCapacity - _.sum(creep.carry));
            Memory["amountCache"][energy.id] = theAmount - claimed;
            // console.log(creep.name + " is claiming " + claimed + " resource from " + energy.id + " and there is " + Memory["amountCache"][energy.id] + " energy left in " + energy.pos)

            if(result == OK) {
                creep.report("scavenged", Math.min(energy.amount, creep.carryCapacity - _.sum(creep.carry)));
                Memory["amountCache"][energy.id] = undefined;
            }
            

            creep.say(_.sum(creep.carry) + "/" + creep.carryCapacity);
            if(result == ERR_NOT_IN_RANGE){
                creep.moveTo(energy, {ignoreCreeps: false});
            } else if (result != OK) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
}

module.exports = pickupEnergy;