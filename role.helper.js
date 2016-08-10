var backupBehavior = require('role.upgrader');

var helper = { 
 
    run: function(creep) {
        var helperRoomFlag = Game.flags.HOME;
        
        //console.log(creep + " is trying to help!");
        /*=======================
            HELPER LOGIC HERE
        =======================*/
        var theStorage = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_STORAGE}})[0];
                        
        creep.say("H");
        
        if(theStorage) {
            
            // Game.spawns.Spawn1.memory.path.forEach(function(element, index, array) {
            //     //GTFO out of the way if you're not supposed to be here
            //     if(creep.pos.x + "|" + creep.pos.y == element) {
            //         //console.log(creep.name + " is in the way!");
            //         creep.moveTo(creep.room.controller.pos);
            //         return;
            //     } else {
            //         //console.log(creep.name + " should not be in the way at " + creep.pos.x + "|" +creep.pos.y + " since it isn't " + element);
            //     }
            // });
            
            // if(creep.pos.x + "|" + creep.pos.y == helpThisGuy.memory.chainPosition) {
            //     creep.moveTo(creep.room.controller);
            // } else {
            //     //console.log(creep.name + " should not be in the way at " + creep.pos.x + "|" +creep.pos.y + " since it isn't " + helpThisGuy.memory.chainPosition);
            // }
        
            //Handle toggling upgrade flag
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
    	    }
    	    if(!creep.memory.upgrading && creep.carry.energy > creep.carryCapacity / 2) {
    	        creep.memory.upgrading = true;
    	    }
    	    
    	    //Handle distributing the wealth
    	   // var helpers = _.filter(Game.creeps, (helper) => helper.memory.helper);
    	   // //console.log("helper" + helpers.length)
        //     helpers.forEach(function(element, index, array) {
        //         result = creep.transfer(element, RESOURCE_ENERGY, creep.body.length);
        //         //console.log("trying to help " + element.name + " results in " + result);
                
        //     });
    
            //Either upgrade the controller or move to the helpmaster
    	    if(creep.memory.upgrading) {
    	        //TODO refactor this into a different behavior?
    	        if(creep.room.memory.crisis) {
    	            var towers = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
    	            
    	            //TODO make this support more than just one tower
                    if(towers[0].energy < towers[0].energyCapacity && creep.transfer(towers[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(towers[0]);
                    }
    	        } else {
    	            if(creep.room.name != helperRoomFlag.pos.roomName) {
        	            creep.moveTo(helperRoomFlag);
        	        } else {
                        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
        	        }
    	        }
            } else {
                if(creep.withdraw(theStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(theStorage);
                }
            }
        } else {
            // console.log("helper is done");
            backupBehavior.run(creep);
        }
    }
}

module.exports = helper;