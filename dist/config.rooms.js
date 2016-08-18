var firstRoom = require('config.rooms.first');
var secondRoom = require('config.rooms.second');
var thirdRoom = require('config.rooms.third');

var config = {

	rooms: [
		firstRoom.configuration,
		secondRoom.configuration,
		thirdRoom.configuration,
    ]
}

module.exports = config;