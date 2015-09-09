var fs = require('fs');
var Match = require('../../models/match.js');

var outputFilename = '../../public/data/elo.json';
var data = [];

exports.get = function() {
	console.log("Calculating elo...");
	Match.find({}).sort('-matchCreation').exec(function(err, matches) {
		if(err) console.error(err);
		if(matches) {
			matches.forEach(function(match) {
				console.log(match.matchCreation);
			});
		}
	});
};