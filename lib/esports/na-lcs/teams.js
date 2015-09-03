var crawler = require('./crawler.js');

exports.test = function() {
	crawler.get('http://na.lolesports.com/na-lcs/2015/spring/teams', function($) {
		$('div.view-teams tbody > tr').each(function() {
			console.log($(this).html());
		});
	});
};