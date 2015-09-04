var crawler = require('./crawler.js');
var async = require('async');

function scrapePlayerInfo(link, cb) {
	crawler.get('http://na.lolesports.com' + link, function($player) {
		console.log('\t player ign:' + $player('.player-summoner-name').text());
		console.log('\t \t player name:' + $player('.player-first-name').text()+$player('.player-last-name').text());
		console.log('\t \t player nationality:' + $player('.hometown .player-hometown').text());
		console.log('\t \t player age:' + $player('.age .date-display-interval').text());
		console.log('\t \t player position:' + $player('.position .player-position').text());
		console.log('\t \t player contract expiration:' + $player('.contract-expiration .player-contract-expires').text().split(' ').pop());
	});
}


exports.get = function($team, mainCallback) {
	async.eachSeries($team('.view-team-players ul .content a'), function(a, callback) {
		console.log("TEST");
		var link = $teams(a).attr('href');
		scrapePlayerInfo(link, callback);
	}, mainCallback);
}
