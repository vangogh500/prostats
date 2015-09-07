var https = require('https');

function makeRequest(opts, callback) {
	https.request(opts, function(res) {
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('error', function(e) {
			console.log(e);
		});
		res.on('end', function() {
			if(res.statusCode == 429) {
				console.log(res.headers);
				setTimeout(makeRequest(opts, callback), 1000);
			}
			else {
				console.log(opts.path + " : " + res.statusCode);
				callback(JSON.parse(data));
			}
		});
	}).end();
}


exports.getMatch = function(url, cb) {
	var opts = {
		hostname: 'acs.leagueoflegends.com',
		method: 'GET',
		path: '/v1/stats/game' + url
	}
	makeRequest(opts, cb);
};