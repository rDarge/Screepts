/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.navigator');
 * mod.thing == 'a thing'; // true
 */
 
var navigator = {
    run: function(creep, room) {
        creep.moveTo(new RoomPosition(24, 24, room.name));
    }
}

module.exports = navigator;