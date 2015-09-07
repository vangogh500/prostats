var acs = require('../acs.js');
var async = require('async');
var data = require('../../../supplements/matches.json');
var Match = require('../../../models/team.js');

function formatMatch(data) {
	new Match

}


exports.get = function() {
	data.forEach(function(match) {
		acs.getMatch(match.statUrl, function(res) {
			formatMatch(res);
		});
	});
};
