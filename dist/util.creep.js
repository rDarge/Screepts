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
	},

	Creep.prototype.getResourceType = function() {
		resourceType = this.memory.resourceType;
        if(resourceType == undefined) {
            resourceType = RESOURCE_ENERGY;
        }
		// console.log(this.name + " testing member access " + resourceType);
        return resourceType;
	},

	Creep.prototype.tryToRepairRoads = function () {
		if(this.memory.repairRoads && this.getActiveBodyparts(WORK) > 0 && this.carry.energy > 0) {
            var maybeRoad = this.room.lookForAt(LOOK_STRUCTURES, this.pos);
            // console.log("Maybe a road " + maybeRoad);
            if(maybeRoad.length > 0 && maybeRoad[0].structureType == 'road' && maybeRoad[0].hits < maybeRoad[0].hitsMax){
                this.say("tink!");
                this.repairAndReport(maybeRoad[0]);
            } else {
            	var maybeConstruction = this.room.lookForAt(LOOK_CONSTRUCTION_SITES, this.pos);
	            // console.log("Maybe a road " + maybeRoad);
	            if(maybeConstruction.length > 0){
	                this.say("tink!");
	                this.buildAndReport(maybeConstruction[0]);
	            }
            }
        }
	},

	Creep.prototype.report = function(key, amount) {
		try {
			// console.log("trying to increment " + key + " by " + amount);
			if(amount > 0 && this.getResourceType() == RESOURCE_ENERGY) {
				Memory["cached_rooms"][this.pos.roomName]["stats"]["creep"][key] = Memory["cached_rooms"][this.pos.roomName]["stats"]["creep"][key] + amount;
				// console.log(this.name + " " + key + " " + amount + " " + this.getResourceType());
				// console.log("total so far is " +JSON.stringify(Memory["cached_rooms"][this.pos.roomName]["stats"]["creep"][key]));
			}
		} catch (err) {
			console.log (err);
		}
	},

	Creep.prototype.getReportValue = function(key) {
		return Memory["cached_rooms"][this.pos.roomName]["stats"]["creep"][key];
	}

	Creep.prototype.clearReportValue = function(key) {
		Memory["cached_rooms"][this.pos.roomName]["stats"]["creep"][key] = 0;
	}

	Creep.prototype.harvestAndReport = function(target) {
        result = this.harvest(target);
        if(result == OK && this.getResourceType() == RESOURCE_ENERGY) {
        	amount = Math.min(this.getActiveBodyparts(WORK) * 2, this.carryCapacity - _.sum(this.carry));
			this.report("harvested", amount);
			this.report("harvested_keeper_count", amount);
        }
        return result;
	},

	Creep.prototype.buildAndReport = function(target) {
		result = this.build(target);
        if(result == OK) {
            this.report("constructed", this.getActiveBodyparts(WORK));
        }
        return result;
	},

	Creep.prototype.repairAndReport = function(target) {
		result = this.repair(target);
        if(result == OK) {
            this.report("repaired", this.getActiveBodyparts(WORK));
        }
        return result;
	},

	Creep.prototype.dropAndReport = function(resourceType) {
		result = this.drop(resourceType);
        if(result == OK) {
            this.report("dropped", this.carry[resourceType]);
        }
        return result;
	},

	Creep.prototype.transferAndReport = function(amount, resourceType) {
		result = this.transfer(target, resourceType);

		if(target.structureType == 'tower') {
			//Deposit to tower
            amount = Math.min(target.energyCapacity - target.energy, this.carry[resourceType]);
            this.report("towered", amount);

        } else if(target.structureType == 'storage') {
        	//Deposit to storage
            amount = Math.min(target.storeCapacity - _.sum(target.store), this.carry[resourceType]);
            this.report("stored", amount);

        } else if(target.structureType == 'link') {
        	//Deposit to link
            amount = Math.min(target.energyCapacity - target.energy, this.carry[resourceType]);
            this.report("linked", amount);
        }
	},

	Creep.prototype.reportInvasion = function(invader) {
		//Set the evacuation time
		Memory["cached_rooms"][this.pos.roomName].evacuating = Game.time + invader.ticksToLive;

		//Notify via email the amount harvested
		harvestedSoFar = this.getReportValue("harvested_keeper_count");
		Game.notify("There was " + harvestedSoFar + " harvested before an invasion occured in " + this.pos.roomName + "!");
		this.clearReportValue("harvested_keeper_count");
	}

	Creep.prototype.reportAllClear = function() {
		//Set the evacuation time
		// console.log("derp");
		Memory["cached_rooms"][this.pos.roomName].evacuating = false;
	}

};
