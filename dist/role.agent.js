
function getDistance(first, second) {
    return Math.sqrt(Math.pow(second.pos.x - first.pos.x,2) + Math.pow(second.pos.y - first.pos.y,2));
}

var agent = { 
    
    run: function(creep) {
        waypoint = Game.flags.agent;
        target = Game.flags.agent;
        
        // if(!creep.memory.waypoint && creep.pos.roomName == Game.flags.waypoint.pos.roomName){
        //     creep.memory.waypoint = true;
        // } else if(!creep.memory.waypoint) {
        //     creep.moveTo(Game.flags.waypoint);
        // }
        
        // if (creep.memory.waypoint && !creep.memory.waypoint2 && creep.pos.roomName == Game.flags.waypoint2.pos.roomName){
        //     creep.memory.waypoint2 = true;
        // } else if (!creep.memory.waypoint2 && creep.memory.waypoint) {
        //     creep.moveTo(Game.flags.waypoint2);
        // }

        // if (creep.memory.waypoint2 && !creep.memory.waypoint4 && creep.pos.roomName == Game.flags.waypoint4.pos.roomName){
        //     creep.memory.waypoint4 = true;
        // } else if (!creep.memory.waypoint4 && creep.memory.waypoint2) {
        //     creep.moveTo(Game.flags.waypoint4);
        // }


        
        if(true || creep.memory.waypoint4) {
            //Boogie on down there
            if(creep.room.name != target.pos.roomName) {
                hostiles = creep.room.find(FIND_HOSTILE_CREEPS).sort((a, b) => getDistance(a, creep) - getDistance(b, creep));
                //console.log(towers);
                if(hostiles.length > 0) {
                    creep.say(getDistance(hostiles[0],creep));
                    result = creep.attack(hostiles[0]);
                    // console.log(result);
                    if(result == ERR_NOT_IN_RANGE){
                        creep.moveTo(hostiles[0]);
                    } else {
                        console.log("attacking tower " + hostiles[0]);
                    }
                    return;
                } else {
                    creep.moveTo(target);
                }
            } else {
                if(creep.hits < creep.hitsMax){
                    creep.heal(creep);
                }
                var breakThisWallList = creep.room.lookForAt(LOOK_STRUCTURES, Game.flags.entrypoint);
                if(breakThisWallList.length > 0) {
                    breakThisWall = breakThisWallList[0];
                    creep.moveTo(breakThisWall);
                    result = creep.attack(breakThisWall)
                    if(result == ERR_NOT_IN_RANGE){
                        creep.moveTo(breakThisWall);
                    } else {
                        console.log("attacking " + breakThisWall + " " + result);
                    }
                } else {
                //var towers = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                var towers = creep.room.find(FIND_HOSTILE_CREEPS).sort((a, b) => getDistance(a, creep) - getDistance(b, creep));   
                //console.log(towers);
                if(towers.length > 0) {
                    creep.say(getDistance(towers[0],creep));
                    result = creep.attack(towers[0]);
                    // console.log(result);
                    if(result == ERR_NOT_IN_RANGE){
                        creep.moveTo(towers[0]);
                    } else {
                        console.log("attacking tower " + towers[0] + " resulting in " + result);
                    }
                } else {
                    var hostiles = creep.room.find(FIND_HOSTILE_SPAWNS);   
                    if(hostiles.length > 0) {
                        if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE){
                            creep.moveTo(hostiles[0]);
                            console.log("moving to " + hostiles[0]);
                        } else {
                            console.log("attacking spawn " + hostiles[0]);
                        }
                    } else {
                        
                        var structures = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: (structure) => structure.structureType != 'controller'});
                        if(structures.length > 0) {
                            if(creep.attack(structures[0]) == ERR_NOT_IN_RANGE){
                                creep.moveTo(structures[0]);
                                console.log("moving to " + structures[0]);
                            } else {
                                console.log("attacking structure " + structures[0]);
                            }
                        } else {
                            creep.say("bleh");
                            var construction_sites = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
                            if(construction_sites.length > 0) {
                                if(creep.attack(construction_sites[0]) != OK){
                                    creep.moveTo(construction_sites[0]);
                                } else {
                                    console.log("attacking construction site" + construction_sites[0]);
                                }
                            } else {
                                creep.moveTo(target.pos);
                            }
                        }
                    }
                }
                }
                
                
            }  
        }
        
    }
};

module.exports = agent;