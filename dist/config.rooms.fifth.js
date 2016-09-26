//Old roles
var obsolete = require('role.obsolete');

module.exports = function() {

    //GENERAL
    var THIS_ROOM       = Game.rooms.W12N48;
    var THIS_SPAWN      = Game.spawns.Spawn10;
    var TOWERS          = "57d398a64d53f52b2b88582b,57d83bd79556127743796684,57e6d7de8ea5732e51503bbf";
    var WALL_TARGET     = 100000;
    var BUILD_THRESHOLD = 100000;

    //STORAGE AND LINK
    var STORAGE         = "57d52c282a95196b4fb63f12";
    var STORAGE_LINK    = "57d81dfd8259c7b14c346863";

    //SOURCES AND LINKS
    var CLOSE_SOURCE    = "577b93530f9d51615fa47fd3";
    var CLOSE_LINK      = "57dec602c9294e4b45f1ade6";
    var FAR_SOURCE      = "577b93530f9d51615fa47fd4";
    var FAR_LINK        = "57d8289e4883f2bb52e83a14";
    var REMOTE_LINK     = FAR_LINK;
    
    //MINERALS
    var MINERAL         = Game.getObjectById("577b954d4cfed28730762680");
    var TERMINAL        = "57de7af6240aa7590ea79884";

    //Remote Rooms
    var REMOTE_ROOMS = {
        "W11N48": {
            SOURCES:        ["577b93560f9d51615fa48015","577b93560f9d51615fa48016"],
            DESTINATION:    REMOTE_LINK
        }
    }

    var INVADED_ROOMS = Object.keys(REMOTE_ROOMS).filter((value) => Memory["cached_rooms"][value].evacuating > 0);

    //For reclaiming
    var droppedEnergy = THIS_ROOM.find(FIND_DROPPED_ENERGY);

    //CREEP CONFIGURATION
    var roomCreeps = [];

    //IN CASE OF EMERGENCY ==================================================
    wrap("Emergency Creep ", function() {
        Array.prototype.push.apply(roomCreeps, new BackupGroup(STORAGE_LINK, RESOURCE_ENERGY, CLOSE_SOURCE, THIS_ROOM));
    });

    //Local Creeps ==========================================================
    wrap("Local Creeps for " + THIS_ROOM.name, function() {
        Array.prototype.push.apply(roomCreeps, new HomeTeam(CLOSE_SOURCE, CLOSE_LINK, FAR_SOURCE, FAR_LINK, STORAGE, STORAGE_LINK, TOWERS, droppedEnergy));
    });

    //Maintenance guys ======================================================
    wrap("Maintenance Creeps for " + THIS_ROOM.name, function() {
        Array.prototype.push.apply(roomCreeps, new MaintenanceCrew(THIS_ROOM, STORAGE, WALL_TARGET, BUILD_THRESHOLD));
    });
    
    //Lab Junkies ===========================================================
    wrap("Lab Creeps for " + THIS_ROOM.name, function() {
        Array.prototype.push.apply(roomCreeps, new MineralCrew(MINERAL, STORAGE));
    });

    //Upgrade team ==========================================================
    wrap("Upgrade Creeps for " + THIS_ROOM.name, function() {
        Array.prototype.push.apply(roomCreeps, new UpgradeCrew(STORAGE));
    });

    //Remote Mining Team ====================================================
    wrap("Remote Creeps for " + THIS_ROOM.name, function() {
        Array.prototype.push.apply(roomCreeps, new RemoteCrew(REMOTE_ROOMS, INVADED_ROOMS));
    });

    //And the obslete role===============================================
    //I'll get around to updating this eventually
    Array.prototype.push.apply(roomCreeps,[
            {
                role: 'obsolete',
                count: 0,
                stats: [MOVE],
                action: obsolete
            }
    ]);
    
    //Out pops a lil' ol room config
    var room = {
        name: "Hodor",
        room: THIS_ROOM,
        spawn: THIS_SPAWN,
        link: STORAGE_LINK,
        towerDefense: 1000,
        creeps: roomCreeps,
    }

    return room;
}