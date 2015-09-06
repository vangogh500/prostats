var request = require('request');
var cheerio = require('cheerio');
var phantom = require('phantom');

var options = {
  hostname: process.env.OPENSHIFT_NODEJS_IP,
  path: require('path').dirname('/var/lib/openshift/55e75cb52d52715313000090/app-root/data/phantomjs/bin/phantomjs') + '/'
};

exports.get = function(url, cb) {
	request(url, function(err, res, body) {
		if(!err && res.statusCode == 200) {
			var $ = cheerio.load(body);
			cb($);
		}
		else console.error("There was an error fetching the page " + url);
	});
};

exports.getWithJs = function(url) {
	phantom.create(function(ph) {
		ph.createPage(function(page) {
			page.open(url, function(status) {
				if (status !== 'success') console.log(url + " : success");
				else console.log("unable to connect to: " + url);
			});
		});
	}, options);
};