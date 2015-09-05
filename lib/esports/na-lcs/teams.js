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
	console.log("searching for team: " + team.name + "...");
	Team.findOne({ name: team.name }, function(err, found) {
		if(err) console.error(err);
		var dbTeam;
		if(found) {
			dbTeam = found;
			console.log("\t Found! Will not add to the database");
		}
		else {
			console.log("\t Cannot find team. Will add to the database...");
			dbTeam = new Team({
				name: team.name,
				acronym: team.acronym,
				logoUrl: team.logoUrl,
				profileUrl: team.profileUrl,
				bio: '',
				roster: []
				matches: []
			}).save();
		}
		for(var player in team.roster) {
			var dbPlayer = players.formatPlayer(team.roster[player])
			console.log("\t \t Searching if player exists in team...");
			if(Arrays.asList(dbTeam.matches).contains(dbPlayer._id)) console.log("\t \t \t Found!");
			else {
				console.log("\t \t \t Was not found to be on the team's roster. Adding...");
				dbTeam.matches = dbTeam.matches.push(dbPlayer._id);
				dbTeam.save();
			}
		}
	});
	
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