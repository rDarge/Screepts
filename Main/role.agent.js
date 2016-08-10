var agent = { 
    
    run: function(creep) {
        waypoint = Game.flags.trenches0;
        target = Game.flags.trenches;
        
        //See if we got to the waypoint
        if(creep.room.roomName == Game.flags.waypoint.pos.name || !waypoint){
            creep.memory.waypoint = true;
        } else {
            //console.log("" + Game.flags.waypoint.pos.roomName + " != " + creep.room.name);
        }
        
        
        //Boogie on down there
        if(creep.room.name != target.pos.roomName) {
            if(!creep.memory.waypoint) {
                creep.moveTo(Game.flags.waypoint);
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
                result = creep.rangedAttack(breakThisWall)
                if(result == ERR_NOT_IN_RANGE){
                    creep.moveTo(breakThisWall);
                } else {
                    console.log("attacking " + breakThisWall + " " + result);
                }
            } else {
            //var towers = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            var towers = creep.room.find(FIND_HOSTILE_CREEPS);   
            //console.log(towers);
            if(towers.length > 0) {
                if(creep.rangedAttack(towers[0]) == ERR_NOT_IN_RANGE){
                    creep.moveTo(towers[0]);
                } else {
                    console.log("attacking tower " + towers[0]);
                }
            } else {
                var hostiles = creep.room.find(FIND_HOSTILE_SPAWNS);   
                if(hostiles.length > 0) {
                    if(creep.rangedAttack(hostiles[0]) == ERR_NOT_IN_RANGE){
                        creep.moveTo(hostiles[0]);
                        console.log("moving to " + hostiles[0]);
                    } else {
                        console.log("attacking spawn " + hostiles[0]);
                    }
                } else {
                    
                    var structures = creep.room.find(FIND_HOSTILE_STRUCTURES, {filter: (structure) => structure.structureType != 'controller'});
                    if(structures.length > 0) {
                        if(creep.rangedAttack(structures[0]) == ERR_NOT_IN_RANGE){
                            creep.moveTo(structures[0]);
                            console.log("moving to " + structures[0]);
                        } else {
                            console.log("attacking structure " + structures[0]);
                        }
                    } else {
                        creep.say("bleh");
                        var construction_sites = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
                        if(construction_sites.length > 0) {
                            if(creep.rangedAttack(construction_sites[0]) != OK){
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
};

module.exports = agent;