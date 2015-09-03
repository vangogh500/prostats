var request = require('request');
var cheerio = require('cheerio');

exports.test = function() {
	request("http://na.lolesports.com/na-lcs/2015/spring/teams", function(err, res, body) {
		if(!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
			console.log($.html());
		}
		else console.log("there was an error fetching the page");
	});
};