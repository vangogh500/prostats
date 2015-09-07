var request = require('request');
var cheerio = require('cheerio');

exports.get = function(url, cb) {
	request(url, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var $ = cheerio.load(body);
			cb($);
		}
		else console.error(err);
	});
};

exports.getJSON = function(url, cb) {
	request(url, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			cb(JSON.parse(body));
		}
		else console.error(err);
	});
}