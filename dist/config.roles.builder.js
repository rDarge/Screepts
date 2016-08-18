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

module.exports = function() {

	CreepModel = function CreepModel(name, stats) {
		this.role = name;
		this.count = 1;
		this.stats = stats;
		this.pickupBehavior = [];
		this.depositBehavior = [];
		this.memory = {};
	};

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

	CreepModel.prototype.andRepairs = function(types) {
		this.depositBehavior.push(depositRepair);
		this.memory.repairTargetTypes = types;
		return this;
	}

	CreepModel.prototype.andBuilds = function(){
		this.depositBehavior.push(depositConstruction);
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

	//TODO make an "if" function to separate these two logical bits
	CreepModel.prototype.withFriends = function(count) {
		this.count = count;
		return this;
	}

	CreepModel.prototype.andIsBrave = function() {
		this.memory.brave = true;
		return this;
	}
}