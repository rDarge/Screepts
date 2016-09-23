module.exports = function() {

	printUsage = function(label, delegate) {
		if(CPU_PROFILING) {
			var start = Game.cpu.getUsed();
			var returnValue = delegate();
			console.log(label + ": " + Math.round((Game.cpu.getUsed() - start)*100)/100 + " out of " + Game.cpu.limit);
			
			return returnValue;			

		} else {
			//Otherwise just do the function
			return delegate();
		}
	};
}