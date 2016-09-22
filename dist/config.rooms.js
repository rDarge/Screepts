

var firstRoomConfig = require('config.rooms.first');
var secondRoomConfig = require('config.rooms.second');
var thirdRoomConfig = require('config.rooms.third');
var fourthRoomConfig = require('config.rooms.fourth');
var fifthRoomConfig = require('config.rooms.fifth');
var sixthRoomConfig = require('config.rooms.sixth');

module.exports = function() {

	//See the required classes for room configuration details, this is just glue.
	return printUsage ("Room Setup: ", function() {
		return [
			printUsage('First Room  ', firstRoomConfig),
			printUsage('Second Room ', secondRoomConfig),
			printUsage('Third Room  ', thirdRoomConfig),
			printUsage('Fourth Room ', fourthRoomConfig),
			printUsage('Fifth Room  ', fifthRoomConfig),
			printUsage('Sixth Room  ', sixthRoomConfig),
	    ];
	});
}