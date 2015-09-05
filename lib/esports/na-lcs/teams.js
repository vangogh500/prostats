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
		console.log("team name: " + teamName);
		console.log("\t nationality: " + nationality);
		console.log("\t founded: " + date);
		console.log("\t logo: " + $team('.logo img').attr('src'));
		console.log("\t bio: " + $team('.destress .even').html());
		players.get($team, callback);
	});
}

exports.get = function() {
	esports.getTournament(197, function(tournament) {
		for(var contestant in tournament.contestants) {
			esports.getTeam(tournament.contestants[contestant].id, function(team) {
				console.log(team.logoUrl);
			});
		}
	});
};