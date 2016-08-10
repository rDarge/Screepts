/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.explorer');
 * mod.thing == 'a thing'; // true
 */
 
explorer = {
    
    //TODO distribute miners better
    run: function(creep) {
        var target = Game.flags.reserved;
        var home = Game.flags.reserved;
        
        if(creep.memory.target) {
            target = Game.flags[creep.memory.target]
        }
        
        if(creep.memory.home) {
            home = Game.flags[creep.memory.home]
        }
        
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	    }
        
        if(target && home) {
            if(!creep.memory.upgrading) {
                 //Boogie on down there
                if(creep.room.name != target.pos.roomName) {
                    creep.say("cya!");
                    creep.moveTo(target);
                } else {
                    var sources = creep.room.find(FIND_SOURCES);
                    var index = creep.memory.sourceIndex;
                    var source = sources[1];
                    
                    if(index !== undefined) {
                        source = sources[parseInt(index)];
                    }
                    
                    //console.log(creep.memory.sourceIndex + " " + source.pos);
                    if(Game.flags.entryPoint && Game.flags.entryPoint.pos.roomName == creep.memory.room) {
                        var breakThisWall = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags.entrypoint);
                        if(breakThisWall.length > 0 && breakThisWall[0]) {
                            creep.say("breakin it");
                            if(creep.dismantle(breakThisWall[0]) == ERR_NOT_IN_RANGE){
                                creep.moveTo(breakThisWall[0]);
                            } else {
                                console.log("dismantling " + breakThisWall);
                            }
                        }   
                    } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.say("hunting!");
                        creep.moveTo(source);
                    }
                }
            } else {
                if(creep.room.name != home.pos.roomName) {
                    var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    var repairTargets = creep.room.find(FIND_STRUCTURES, {filter: function(structure) { return ((structure.structureType == 'road' || structure.structureType =='container') && structure.hits < structure.hitsMax/2);}});
                    if(buildTargets.length > 0) {
                        creep.say("makin it!");
                        if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(buildTargets[0]);
                        } 
                    } else if(repairTargets && repairTargets.length > 0) {
                        creep.say("fixin it!");
                        result = creep.repair(repairTargets[0]);
                        // console.log("Repairing "+ repair[0] + " resulting in " + result);
                        if(result == ERR_NOT_IN_RANGE) {
                            creep.moveTo(repairTargets[0]);
                        }
                    } else {
                        creep.say("Goin home...")
                        creep.moveTo(home);
                    }
                } else {
                    
                    var targetStructure = false;
                    var targetId = creep.memory.targetStructure;
                    if(targetId) {
                        targetStructure = Game.getObjectById(targetId);
                    } 
                    
                    if(targetStructure) {
                        if(creep.transfer(targetStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targetStructure);
                        }
                    } else {
                        var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
                        var enemyCreeps = creep.room.find(FIND_HOSTILE_CREEPS, {filter: function(hostile) { return hostile.getActiveBodyparts(ATTACK) + hostile.getActiveBodyparts(RANGED_ATTACK) + hostile.getActiveBodyparts(HEAL) > 0;}});
                        var towers = creep.room.find(FIND_STRUCTURES, {filter: (structure) => structure.structureType == 'tower' && structure.energy < 600})
                        //console.log(towers);
                        if(enemyCreeps.length > 0) {
                            creep.say("grr!");
                            if(creep.attack(enemyCreeps[0]) == ERR_NOT_IN_RANGE){
                                creep.moveTo(enemyCreeps[0]);
                            } else {
                                console.log("attacking creep " + enemyCreeps[0]);
                            }
                        } else if(towers.length > 0 && creep.transfer(towers[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(towers[0]);
                        } else if(buildTargets.length > 0) {
                            if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(buildTargets[0]);
                            } 
                        } else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                }
            }
        }
    }
}

module.exports = explorer;