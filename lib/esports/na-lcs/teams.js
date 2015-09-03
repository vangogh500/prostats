/*
 * Responsible for parsing html pages on teams
 */
 
var crawler = require('./crawler.js');


function scrapeTeamInfo(teamLink) {
	crawler.get('http://na.lolesports.com' + teamLink, function($) {
		
	});
}

exports.test = function() {
	crawler.get('http://na.lolesports.com/na-lcs/2015/spring/teams', function($) {
		// get links to team profiles
		$('div.team-title a').each(function() {
			var link = $(this).attr('href');
		});
	});
};