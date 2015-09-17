var Team = require('../../../models/team.js');
var Match = require('../../../models/match.js');
var timelines = require('./timelines.js');

function indexOfWithAttr(arr, attr, criteria) {
	for(var i=0; i<arr.length; i++) {
		if(arr[i][attr] == criteria) {
			return i;
		}
	}
	return -1;
}

exports.getTimeline = function(attr, cb) {
	Match.find({}).sort('gameCreation').exec(function(err, matches) {
		if(err) console.error(err);
		if(matches) {
			Team.find({}, function(err, teams) {
				if(err) console.error(err);
				if(teams) {
					cb(timelines.get(matches, teams, attr));
				}
			});
		}
	});
}