var fs = require('fs');
var webPage = require('webpage');
var async = require('async');

var outputFilename = "matches.json";
var data = JSON.parse(fs.read(outputFilename));

async.eachSeries(data, function(match, cb) {
	if(!match.statUrl) console.log("Match " + match.matchId " already exists!");
	else {
		var dest = 'http://na.lolesports.com' + match.url;
		console.log("Getting match history link for " + match.matchId + "...");
		getMatchHistoryLink(dest, function(link, pg){
			console.log("\t" + link);
			match.statUrl = link.substring(link.indexOf('match-details')+13, link.length);
			pg.close();
			cb();
		});
	}
}, function() {
	console.log("writing into file...");
	fs.write(outputFilename, JSON.stringify(data, null, 4), function(err) {
		if(err) console.log(err);
		else console.log("JSON saved to " + outputFilename);
	});
	phantom.exit();
});

function getMatchHistoryLink(matchUrl, callback) {
	var page = webPage.create();
	page.open(matchUrl, function(status) {
		console.log(matchUrl + " : " + status);
		if(status == "success") {
			var test = page.evaluate(function() {
				return document.querySelector('span.robust-link-container a').getAttribute('href');
			});
			callback(test, page);
		}
	});
}