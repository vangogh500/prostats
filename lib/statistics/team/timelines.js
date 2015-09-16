var Match = require('../../../models/match.js');

exports.get = function(matches, teams) {
	var outputFileNames = [];
	var outputPath = './public/data/';
	var sample = matches[0];
	
	for(var x in Match.schema) {
		outputFileNames.push(outputPath + x);
	}
	console.log();
};