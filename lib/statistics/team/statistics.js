var Team = require('../../../models/team.js');
var Match = require('../../../models/match.js');
var timelines = require('./timelines.js');
var fs = require('fs');
var path = require('path');

function indexOfWithAttr(arr, attr, criteria) {
	for(var i=0; i<arr.length; i++) {
		if(arr[i][attr] == criteria) {
			return i;
		}
	}
	return -1;
}

exports.getTimeline = function(attr, cb) {
	var outputFilename = '/data/' + attr + '.json';
	console.log(outputFilename);
	fs.readFile(outputFilename, function(err, data) {
		if(err) console.error(err);
		if(data) {
			console.log('JSON found. Returning...');
			cb(JSON.parse(data));
		}
		else {
			Match.find({}).sort('gameCreation').exec(function(err, matches) {
				if(err) console.error(err);
				if(matches) {
					Team.find({}, function(err, teams) {
						if(err) console.error(err);
						if(teams) {
							var timeline = timelines.get(matches, teams, attr);
							console.log('JSON not found. Writing to file...');
							if(err) console.error(err);
							fs.writeFileSync(outputFilename, JSON.stringify(timeline, null, 4));
							cb(timeline);
						}
					});
				}
			});
		}
	});
}