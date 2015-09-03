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
			console.log($team('span', this).html());
			if($team('span', $team(this)).eq(0).html() == "Nationality:") 
				nationality = $team('span', $team(this)).eq(1).html();
			else if($team('span', $team(this)).eq(0).html() == "Founded:")
				date = new Date($team('span', $team(this)).eq(1).html());
		});
		/*
		console.log("team name: " + teamName);
		console.log("\t logo: " + $team('.logo img').attr('src'));
		console.log("\t nationality: " + nationality);
		console.log("\t founded: " + date); 
		console.log("\t bio: " + $team('.destress .even').html());*/
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