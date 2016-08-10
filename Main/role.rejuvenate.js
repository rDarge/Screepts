var rejuvenate = {
    run: function(creep) {
        creep.drop(RESOURCE_ENERGY);
        creep.moveTo(Game.flags.HOME);
    }
}

module.exports = rejuvenate;