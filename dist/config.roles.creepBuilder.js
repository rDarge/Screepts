//Old roles
var agent = require('role.agent');
var obsolete = require('role.obsolete');

//new atomic behaviors
var pickupSource = require('role.pickup.source');
var pickupStructure = require('role.pickup.structure');
var pickupEnergy = require('role.pickup.energy');

var depositSpawn = require('role.deposit.spawn');
var depositStructure = require('role.deposit.structure');
var depositController = require('role.deposit.controller');
var depositConstruction = require('role.deposit.construction');
var depositRepair = require('role.deposit.repair');
var depositStationary = require('role.deposit.stationary');

var warClaimer = require('role.war.claimer');
var warToughGuy = require('role.war.toughGuy');
var warHealer = require('role.war.healer');
var warWallBreaker = require('role.war.wallBreaker');
var warMurderer = require('role.war.murderer');
var warKeeperScout = require('role.war.keeperScout');
var warKeeperKiller = require('role.war.keeperKiller');
var warRemoteGuard = require('role.war.remoteGuard');

var labPickup = require('role.lab.pickup');
var labDeposit = require('role.lab.deposit');

module.exports = function() {

	CreepModel = function CreepModel(name, stats) {
		this.role = name;
		this.count = 1;
		this.stats = stats;
		this.pickupBehavior = [];
		this.depositBehavior = [];
		this.memory = {};
		this.memory.repairRoads = true;
	};

	LabTender = function LabTender(name, stats, priority, labs) {
		CreepModel.call(this, name, stats);
		this.pickupBehavior = [labPickup];
		this.depositBehavior = [labDeposit];
	}
	LabTender.prototype = new CreepModel();

	CreepModel.prototype.setResourceType = function(resourceType) {
		if(resourceType == undefined) {
			this.memory.resourceType = RESOURCE_ENERGY;
		} else {
			this.memory.resourceType = resourceType;
		}
	}

	/*
		Pickup Behaviors
	*/

	CreepModel.prototype.harvests = function(source, resourceType) {
		this.pickupBehavior.push(pickupSource);
		this.memory.pickupSource = source;
		this.setResourceType(resourceType);
		// if(resourceType != undefined) {
		// 	console.log(resourceType);
		// }
		return this;
	}
	
	CreepModel.prototype.picksUp = function(structure, resourceType) {
		this.pickupBehavior.push(pickupStructure);
		this.memory.pickupStructure = structure;
		this.setResourceType(resourceType);
		return this;
	}

	CreepModel.prototype.finds = function(resourceType) {
		this.pickupBehavior.push(pickupEnergy);
		this.setResourceType(resourceType);
		return this;
	}

	CreepModel.prototype.claims = function() {
		this.pickupBehavior.push(warClaimer);
		return this;
	}

	CreepModel.prototype.attacks = function() {
		this.pickupBehavior.push(warRemoteGuard);
		return this.andIsBrave();
	}

	/*
		Helpers
	*/

	CreepModel.prototype.in = function(room) {
		if(this.memory.pickupRoom == undefined) {
			this.memory.pickupRoom = room;
		} else if (this.depositRoom == undefined) { 
			this.memory.depositRoom = room;
		} else {
			console.log(this.name + " is using the 'in' function improperly");
		}

		if(Memory["cached_rooms"][room] == undefined) {
			Memory["cached_rooms"][room] = {};
		}

		return this;
	}

	CreepModel.prototype.via = function(waypointFlag) {
		if(this.depositBehavior.length == 0) {
			this.memory.pickupWaypoint = waypointFlag;
		} else {
			this.memory.depositWaypoint = waypointFlag;
		}
		return this;
	}

	/*
		Deposit Behaviors
	*/
	CreepModel.prototype.andDeposits = function(target) {
		this.depositBehavior.push(depositStructure);
		this.memory.depositStructure = target;
		return this;
	}

	CreepModel.prototype.andRepairs = function(types, maxHits) {
		this.depositBehavior.push(depositRepair);
		this.memory.repairTargetTypes = types;
		if(maxHits) {
			this.memory.wallHits = maxHits;
		}
		return this;
	}

	CreepModel.prototype.andBuilds = function(types){
		this.depositBehavior.push(depositConstruction);
		if(types) { 
			this.memory.constructionTargetTypes = types;
		}
		return this;
	}

	CreepModel.prototype.andWorships = function() {
		this.depositBehavior.push(depositController);
		return this;
	}

	CreepModel.prototype.andNurses = function() {
		this.depositBehavior.push(depositSpawn);
		return this;
	}

	CreepModel.prototype.andDropsIt = function() {
		this.depositBehavior.push(depositStationary);
		return this;
	}

	/*
		Modifiers
	*/
	CreepModel.prototype.withFriends = function(count) {
		this.count = count;
		return this;
	}

	CreepModel.prototype.butOnlyIf = function(check) {
		this.count = check ? this.count : 0;
		return this;
	}

	CreepModel.prototype.andIsBrave = function() {
		this.memory.brave = true;
		return this;
	}
}