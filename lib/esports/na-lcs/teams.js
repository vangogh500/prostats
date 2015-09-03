/*
 * Responsible for parsing html pages on teams
 */
 
var crawler = require('./crawler.js');
var Team = require('../../../models/team.js');

function scrapeTeamInfo(teamLink, teamName) {
	crawler.get('http://na.lolesports.com' + teamLink, function($team) {
		var nationality;
		var founded;
		$team('.team--extra-info').each(function() {
			if($team('span:eq(0)', this).html() == "Nationality:") 
				nationality = $team('span:eq(1)', this).html();
			else if($team('span:eq(0)',this).html() == "Founded:")
				date = new Date($team('span:eq(1)', this).html();
		});
		console.log("team name: " + teamName);
		console.log("\t logo: " + $team('.logo img').attr('src'));
		console.log("\t nationality: " + nationality);
		console.log("\t founded: " + date); 
		console.log("\t bio: " + $team('.destress .even').html());
	});
}

exports.test = function() {
	crawler.get('http://na.lolesports.com/na-lcs/2015/spring/teams', function($teams) {
		// get links to team profiles
		$teams('div.team-title a').each(function() {
			var link = $teams(this).attr('href');
			var name = $teams(this).html();
			scrapeTeamInfo(link, name);
		});
	});
};