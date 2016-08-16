/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.keeperHarvester');
 * mod.thing == 'a thing'; // true
 */
 
var escape_buffer = 20; //20 ticks to vacate the premises
var create_buffer = 20; //20 ticks to get ahead of the curve
 
var keeperHarvester = {
    run: function(spawn, scout_memory_string, miner_memory_string, hauler_memory_string) {
        
        keeperRoomOpen = spawn.memory.keeperRoomOpen;
        keeperRoomClosed = spawn.memory.keeperRoomClosed;
        
        if((!keeperRoomOpen || !keeperRoomClosed) || (keeperRoomOpen < Game.time && keeperRoomClosed < (Game.time + escape_buffer))) {
            //State 1: Both keeperRoomOpen and keeperRoomClosed are stale or not defined. This happens when the keepers are active or this is the first time we're scouting!
            //We're waiting for the room to open up, so we don't need anyone atm
            spawn.memory[scout_memory_string] = 1; 
            spawn.memory[miner_memory_string] = 0; 
            spawn.memory[hauler_memory_string] = 0;
        } else if (keeperRoomOpen < (Game.time + 3*17) && keeperRoomClosed > Game.time) {
            //State 2: The keeperRoom is open! This happens when the Keepers despawn.
            //Spawn your dudes to get that loot!
            spawn.memory[scout_memory_string] = 0; 
            spawn.memory[miner_memory_string] = 1; 
            spawn.memory[hauler_memory_string] = 1;
        } else if (keeperRoomOpen > Game.time && keeperRoomClosed > (Game.time + 20)){
            //State 3: The keepers are out! Get outta there... but pop a scout in to figure out when it's safe to hang out again
            spawn.memory[scout_memory_string] = 0; 
            spawn.memory[miner_memory_string] = 0; 
            spawn.memory[hauler_memory_string] = 0;
        }

        //TODO move this outta here
        // if(Game.time % 5 == 0 && keeperRoomOpen && keeperRoomClosed) {
        //     console.log("The keeper room is open from tick " + keeperRoomOpen + "(" + (keeperRoomOpen - Game.time) + " ticks away) until tick " + keeperRoomClosed);
        // }
        
        
        // if(spawn.memory.ticksToSpawn && spawn.memory.ticksToSpawn > 1) {
        //     ticksToSpawn = thisSpawn.memory.ticksToSpawn;
        //     console.log("Ticks to spawn: " + spawn.memory.ticksToSpawn);
        //     if(ticksToSpawn < 20) {
        //         var evacuateCreeps = _.filter(Game.creeps, (creep) => (/*creep.memory.role == 'keeper_scout' ||*/ creep.memory.role == 'remote_miner_f') && creep.memory.room == thisRoom.name);
        //         evacuateCreeps.forEach(creep => {creep.say("evacuate!")});
        //         console.log("oh no!");
        //         // evacuateCreeps.forEach(creep => {creep.memory.role = 'obsolete'});
        //     }
        // } else if (spawn.memory.ticksToLive) {
        //     ticksToLive = spawn.memory.ticksToLive;
        //     console.log("We'll be mining again in " + ticksToLive);
        // }
    }
}

module.exports = keeperHarvester;