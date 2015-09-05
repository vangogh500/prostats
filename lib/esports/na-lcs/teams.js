/*
 * Responsible for parsing html pages on teams
 */
 
var players = require('./players.js');
var crawler = require('./crawler.js');
var Team = require('../../../models/team.js');
var esports = require('../esports.js');
var async = require('async');

function scrapeTeamInfo(teamLink, teamName, callback) {
	crawler.get('http://na.lolesports.com' + teamLink, function($team) {
		var nationality;
		var founded;
		$team('.team--extra-info').each(function() {
			if($team(this).find('span').eq(0).text() == "Nationality: ") { 
				nationality = $team(this).clone().children().remove().end().text();
			}
			else if($team(this).find('span').eq(0).text() == "Founded: ") {
				date = new Date($team(this).find('span').eq(1).html());
			}
		});
		
	});
}

function formatTeam(team) {
	console.log("team name: " + team.name);
	console.log("\t acronym: " + team.acronym);
	console.log("\t logo: " + team.logoUrl);
	console.log("\t profileUrl: " + team.profileUrl);
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