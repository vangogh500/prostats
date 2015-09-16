var Match = require('../../../models/match.js');

exports.get = function(matches, teams) {
	var outputFileNames = [];
	var outputPath = './public/data/';
	var sample = matches[0];
	
	Match.schema.eachPath(function(path) {
		if(path.indexOf('blue') != -1) {
			outputFileNames.push(outputPath + path.replace('blue.', ''));
		}
	});
	console.log(outputFileNames);
};