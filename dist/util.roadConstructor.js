var roadConstructor = {

    /** @param {Creep} creep **/
    buildStructure: function(room, source, destination, structure) {
        path = room.findPath(source, destination, {
            ignoreDestructibleStructures: true,
            ignoreCreeps: true
        }
        );
        path.forEach(function(element, index, array) {
            room.createConstructionSite(element.x, element.y, structure);
            //console.log(index + " is " + path[index]);
        });
    }
};

module.exports = roadConstructor;