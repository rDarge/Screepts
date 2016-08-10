
var display = function(value) {
    return Math.round(value * 100) / 100
}

energyManager = {
    
    calculate: function(config) {
        config.forEach(function(value, key, map) {
            var creepProfile = value.creeps;
            
            var roomSum = 0;
            var creepSum = 0;
            var roadSum = 0;
            var rampartSum = 0;
            var containerSum = 0;
            
            creepProfile.forEach(function(record, index, collection) {
                var stats = record.stats;
                var costMap = function(obj){ 
                    switch(obj) {
                        case MOVE: return 50;
                        case WORK: return 100;
                        case CARRY: return 50;
                        case ATTACK: return 80;
                        case RANGED_ATTACK: return 150;
                        case HEAL: return 250;
                        case CLAIM: return 600 * 3; //Account for reduced lifespan
                        case TOUGH: return 10;
                        default: return 0;
                    }
                };
                // var costReduce = ( pre, cur ) => Math.max( pre.x, cur.x );
                
                var cost = stats.map(costMap).reduce((pre,cur) => pre + cur);
                // console.log(cost);
                //Evaluate room-based calculated counts
                count = record.count;
                if(typeof count == "string") {
                    //Convert it to the corresponding memory value
                    count = value.spawn.memory[count];
                    // console.log(record.role + ": "+ count);
                    if(count == undefined) {
                        count = 0;
                    }
                }
                
                creepSum += (cost * count) / 1500.0;
            });
            
            var roads = value.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_ROAD}});
            roadSum += (roads.length * 0.1) / 200 * 10;
            
            var ramparts = value.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_RAMPART}});
            rampartSum += (ramparts.length * 3) / 200 * 10;
            
            var containers = value.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
            containerSum += (containers.length * 10) / 200 * 10;
            
            roomSum = creepSum + roadSum + rampartSum + containerSum;
            console.log(value.name + " total upkeep per tick: " + display(roomSum) +
                " (creep: " + display(creepSum) +
                " road: " + display(roadSum) +
                " rampart: " + display(rampartSum) +
                " container: "+ display(containerSum) + ")");
        });
    }
}
module.exports = energyManager