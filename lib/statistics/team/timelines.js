var Match = require('../../../models/match.js');

exports.get = function(matches, teams) {
	var outputFileNames = [];
	var outputPath = './public/data/';
	var sample = matches[0];
	// set an output path for each attr
	Match.schema.eachPath(function(path) {
		console.log(Math.schema.blue);
		if(path.indexOf('blue') != -1) {
			if(path.indexOf('players') == -1 && path.indexOf('acronym') != -1) outputFileNames.push(outputPath + path.replace('blue.', ''));
		}
	});
	
	matches.forEach(function(match) {
	
	});
};