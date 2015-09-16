var Match = require('../../../models/match.js');

exports.get = function(matches, teams) {
	var outputFileNames = [];
	var outputPath = './public/data/';
	var sample = matches[0];
	
	Match.getSchema.schema.eachPath(function(path) {
		outputFileNames.push(outputPath + path);
	});
	console.log(outputFileNames);
};