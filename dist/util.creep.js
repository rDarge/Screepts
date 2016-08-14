/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.navigator');
 * mod.thing == 'a thing'; // true
 */

module.exports = function() {

	Creep.prototype.getDistanceTo = function(target) {
	    return Math.sqrt(Math.pow(target.pos.x - this.pos.x,2) + Math.pow(target.pos.y - this.pos.y,2));
	}

	Creep.prototype.getResourceType = function() {
		resourceType = this.memory.resourceType;
        if(resourceType == undefined) {
            resourceType = RESOURCE_ENERGY;
        }
		// console.log(this.name + " testing member access " + resourceType);
        return resourceType;
	}

	Creep.prototype.tryToRepairRoads = function () {
		if(this.memory.repairRoads && this.getActiveBodyparts(WORK) > 0 && this.carry.energy > 0) {
            var maybeRoad = this.room.lookForAt(LOOK_STRUCTURES, this.pos);
            // console.log("Maybe a road " + maybeRoad);
            if(maybeRoad.length > 0 && maybeRoad[0].structureType == 'road' && maybeRoad[0].hits < maybeRoad[0].hitsMax){
                this.say("tink!");
                this.repair(maybeRoad[0]);
            }
        }
	}

};
