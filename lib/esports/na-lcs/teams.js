/*
 * Responsible for parsing html pages on teams
 */
 
var crawler = require('./crawler.js');
var Team = require('../../../models/team.js');
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
		callback();
	});
}

exports.test = function() {
	crawler.get('http://na.lolesports.com/na-lcs/2015/spring/teams', function($teams) {
		// get links to team profiles
		async.eachSeries($teams('div.team-title a'), function(a, cb) {
			var link = $teams(a).attr('href');
			var name = $teams(a).html();
			scrapeTeamInfo(link, name, function() {
				console.log("test if cheerio each is asynchronious");
				cb();
			});
		});
	});
};