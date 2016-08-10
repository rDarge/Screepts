var decoy = {
    run: function(creep) {
        var target = Game.flags.DECOY;
        
        //See if we got to the waypoint
        if(creep.room.name == Game.flags.waypoint.pos.roomName){
            creep.memory.waypoint = true;
        } else {
            console.log("" + Game.flags.waypoint.pos.roomName + " != " + creep.room.name);
        }
        
        //Boogie on down there
        if(creep.room.name != target.pos.roomName) {
            if(!creep.memory.waypoint) {
                creep.moveTo(Game.flags.waypoint);
            } else {
                creep.moveTo(target);
            }
        }
    }
}
module.exports = decoy;