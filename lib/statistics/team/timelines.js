exports.get = function(matches, teams) {
	var outputFileNames = [];
	var outputPath = './public/data/';
	var sample = matches[0];
	
	for(var x in sample.blue) {
		outputFileNames.push(outputPath + x);
	}
	console.log(outputFileNames);
};