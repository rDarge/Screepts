/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('main.roadBuilder');
 * mod.thing == 'a thing'; // true
 */
 

var roadBuilder = {
    
    // buildRoad: function(value, key, map) {
    //     console.log("m[" + key + "] = " + value);
    // }
    
    // buildRoads: function(positions) {
    //     Object.keys(positions).forEach(buildRoad);
    // }
    
    reportLocation: function(creep, positions) {
        key = creep.pos.x+'|'+creep.pos.y;
        if(positions[key]) {
            if(positions[key] != -1) {
                positions[key]++;    
            }
        } else {
           positions[key] = 1; 
        }
        
        if(creep.fatigue > 5) {
            positions[key] += 5;
        }
    }
}


module.exports = roadBuilder;