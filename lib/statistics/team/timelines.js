var Match = require('../../../models/match.js');

exports.get = function(matches, teams) {
	var attributes = [];
	var timelines = [];
	var outputPath = './public/data/';
	var sample = matches[0];
	// set an output path for each attr
	Match.schema.eachPath(function(path) {
		if(path.indexOf('blue') != -1) {
			if(path.indexOf('players') == -1 && path.indexOf('acronym') != -1) {
				attributes.push(path.replace('blue.', ''));
				timelines.push([]);
			}
		}
	});
	
	matches.forEach(function(match) {
		
	});
};