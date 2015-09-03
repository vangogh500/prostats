/*
 * Responsible for parsing html pages on teams
 */
 
var crawler = require('./crawler.js');

exports.test = function() {
	crawler.get('http://na.lolesports.com/na-lcs/2015/spring/teams', function($) {
		// get links to team profiles
		$('div.team-title a').each(function() {
			console.log($(this).html());
			console.log(crawler.queue);
		});
	});
};