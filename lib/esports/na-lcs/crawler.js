var request = require('request');
var cheerio = require('cheerio');

exports.test = function() {
	request("http://na.lolesports.com/na-lcs/2015/spring/teams", function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var $ = cheerio.load(body);
			console.log($('div.view-teams tbody').html());
		}
		else console.log("there was an error fetching the page");
	});
};