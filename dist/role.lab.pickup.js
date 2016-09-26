labPickup = {
    pickup: function(creep) {
    	/*
    		Determine priority based on:
				0. Terminal needs more energy? Grab energy
				1. Any exit labs full? Deplete lab
				2. Any source labs empty? Find and pick up from terminal/storage
    	*/

    // 	var terminal = Game.getObjectById(creep.memory.terminal);
    // 	var storage = Game.getObjectById(creep.memory.storage);

  		// var resourceType = creep.getResourceType();

    // 	if(terminal.store[RESOURCE_ENERGY] < 100000) {
    // 		var result = creep.withdraw(structure, resourceType);
    // 		if( == ERR_NOT_IN_RANGE){
    //         	creep.moveTo(structure, {ignoreCreeps: false});
	   //      } else if (result != OK) {
	   //          return false;
	   //      }
    // 	}
    	

    }
}

module.exports = labPickup;