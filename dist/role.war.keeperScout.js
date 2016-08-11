/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.war.keeperScout');
 * mod.thing == 'a thing'; // true
 */
 
var keeperScout = {
    pickup: function(creep) {
        creep.moveTo(Game.flags.scout);
        if(creep.pos.roomName == Game.flags.scout.pos.roomName) {
            hostiles = creep.room.find(FIND_HOSTILE_CREEPS)
            spawn = Game.rooms[creep.memory.room].find(FIND_MY_SPAWNS)[0];
            if(hostiles.length > 0) {
                ticksToLive = hostiles[0].ticksToLive;
                // console.log(ticksToLive + " ticks till the room is open again: Tick " + (Game.time + ticksToLive) + "!");
                spawn.memory.keeperRoomOpen = (Game.time + ticksToLive);
                spawn.memory.keeperRoomClosed = (Game.time + ticksToLive + 300);
                // console.log(Game.rooms[creep.memory.room].find(FIND_MY_SPAWNS)[0].memory.ticksToLive)
                //Alert the troops
                //Obsolete miners, haulers, and yourself
                //Set new timer
            } else {
                sourceKeeperSpawns = creep.room.find(FIND_STRUCTURES,{filter: {structureType: STRUCTURE_KEEPER_LAIR}} );
                ticksToSpawn = sourceKeeperSpawns[0].ticksToSpawn;
                // console.log("Ticks to spawn: " + sourceKeeperSpawns[0].ticksToSpawn);
                spawn.memory.keeperRoomClosed = (Game.time + ticksToSpawn);
                // spawn.memory.keeperRoomOpen = (Game.time - ticksToSpawn);
                
                //Keep track of the hostile creep countdown!
                //Make sure we get outta here in time
            }
        }
        
        return false; //Do whatever else you'd do
    }
}

module.exports = keeperScout;