/*
 * Responsible for parsing html pages on teams
 */
 
var players = require('./players.js');
var Team = require('../../../models/team.js');
var esports = require('../esports.js');

/*
 * Format team from api team object
 */
function formatTeam(team) {
	console.log("team name: " + team.name);
	console.log("\t acronym: " + team.acronym);
	console.log("\t logo: " + team.logoUrl);
	console.log("\t profileUrl: " + team.profileUrl);
	console.log("\t roster:");
	for(var player in team.roster) {
		players.formatPlayer(team.roster[player]);
	}
}

exports.get = function() {
	esports.getTournament(197, function(tournament) {
		for(var contestant in tournament.contestants) {
			esports.getTeam(tournament.contestants[contestant].id, function(team) {
				formatTeam(team);
			});
		}
	});
};