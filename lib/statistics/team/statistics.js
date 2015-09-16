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

exports.get = function() {
	Match.find({}, function(err, matches) {
		if(err) console.error(err);
		if(matches) {
			Team.find({}, function(err, teams) {
				if(err) console.error(err);
				if(teams) {
					timelines.get(matches, teams);
				}
			});
		}
	});
}