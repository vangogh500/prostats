var request = require('request');
var cheerio = require('cheerio');

module.exports = function() {
	return {
		queue: [],
		get: function(url, cb) {
			request(url, function(err, res, body) {
				if(!err && res.statusCode == 200) {
					var $ = cheerio.load(body);
					queue.push(url);
					cb($);
				}
				else console.error("There was an error fetching the page " + url);
			});
	};
};