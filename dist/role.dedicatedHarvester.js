var backupBehavior = require('role.harvester');

var dedicatedHarvester = {
    
    run: function(creep) {
        
        var index = creep.memory.sourceIndex;
        var sources = creep.room.find(FIND_SOURCES);
        var source = sources[0];
        if(index) {
            source = sources[parseInt(index)];
        }
        var container = creep.room.lookForAtArea(LOOK_STRUCTURES, source.pos.y-1, source.pos.x-1, source.pos.y+1, source.pos.x+1, true)
                            .filter((container)=>container.structure.structureType == 'container')[0].structure;
        // console.log(container);
        
        var link = creep.room.lookForAtArea(LOOK_STRUCTURES, creep.pos.y-1, creep.pos.x-1, creep.pos.y+1, creep.pos.x+1, true)
                            .filter((container)=>container.structure.structureType == 'link');
        // console.log("link" + link);
        if(link.length > 0) {
            result = creep.transfer(link[0].structure,RESOURCE_ENERGY);
            // console.log("LinkDeposit " + result + Object.keys());
        }
        
        //Gotta make sure these guys get fed
        var helpers = _.filter(Game.creeps, (helper) => helper.memory.role == "hauler" && helper.memory.room == creep.room.name);
        if(helpers.length == 0) {
            creep.say("backup behavior go!");
            backupBehavior.run(creep);
        } else{
            
            //This should end up taking priority???
            helpers.forEach(function(element, index, array) {
                result =  creep.transfer(element, RESOURCE_ENERGY)
                //console.log("trying to help " + element.name + " results in " + result);
                
            });
            
            //2nd class creeps
            var otherHelpers = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            otherHelpers.forEach(function(element, index, array) {
                result =  creep.transfer(element, RESOURCE_ENERGY)
                //console.log("trying to help " + element.name + " results in " + result);
                
            });
            
            if(creep.pos.x != container.pos.x || creep.pos.y != container.pos.y) {
                creep.say("blah");
                creep.moveTo(container);
            } else {
                creep.say("derp");
                creep.harvest(source);
            }
            
            //turns out you can harvest more than you can hold
            var whoops = creep.room.lookForAt(LOOK_ENERGY, creep.pos);
            if(whoops) {
                //console.log("trying to pick up " + whoops);
                success = creep.pickup(whoops[0]);
                //console.log("whoops " + success);
            }
        }
    }
}

module.exports = dedicatedHarvester;