var crawler = require('./crawler');
var async = require('async');


function iterateGames($week, mainCb) {
	async.eachSeries($week('.week-schedule ul'), function(ul, cb) {
		async.eachSeries($week(ul).find('li .team-logo-link'), function(logoLinks, innerCb) {
			console.log($week(logoLinks).eq(0).attr('href'));
			innerCb();
		}, cb);
	}, mainCb);
}

function iterateWeeks($schedule) {
	async.eachSeries($schedule('.week-nav li a'), function(a, cb) {
		crawler.get('http://na.lolesports.com' + $schedule(a).attr('href'), function($week) {
			iterateGames($week, cb);
		});
	});
}


exports.get = function() {
	crawler.get('http://na.lolesports.com/na-lcs/2015/spring/overview', function($overview) {
		crawler.get('http://na.lolesports.com' + $overview('.full-schedule a').attr('href'), function($schedule) {
			iterateWeeks($schedule);
		});
	});
};