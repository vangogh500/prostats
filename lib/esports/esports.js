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

exports.getProgramming = function(tournamentId, cb) {
	var opts = {
		hostname: 'na.lolesports.com',
		method: 'GET',
		path: '/api/match/4531.json'
	};
	makeRequest(opts, cb);
};