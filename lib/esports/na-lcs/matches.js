var crawler = require('./crawler.js');
var esports = require('../esports.js');
var async = require('async');


function iterateGames($week, mainCb) {
	console.log($week('.week-schedule ul li').length);
	async.eachSeries($week('.week-schedule ul li'), function(li, cb) {
		async.eachSeries($week(li).find('.team-logo-link'), function(logoLinks, innerCb) {
			console.log($week(logoLinks).html());
			console.log($week(logoLinks).eq(0).attr('href'));
			innerCb();
		}, cb);
	}, mainCb);
}

function iterateWeeks($schedule) {
	async.eachSeries($schedule('.week-nav li a'), function(a, cb) {
		console.log("week #: " + $schedule(a).html());
		crawler.get('http://na.lolesports.com' + $schedule(a).attr('href'), function($week) {
			console.log($week.html());
			iterateGames($week, cb);
		});
	});
}

exports.get = function() {
	esports.getProgramming(197, function(programming) {
		console.log(programming);
	});
};