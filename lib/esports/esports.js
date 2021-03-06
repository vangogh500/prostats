var http = require('http');

function makeRequest(opts, callback) {
	http.request(opts, function(res) {
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
		path: '/api/programming.json?parameters[method]=all&parameters[expand_matches]=1&parameters[tournament]=' + tournamentId
	};
	makeRequest(opts, cb);
};

exports.getTournament = function(tournamentId, cb) {
	var opts = {
		hostname: 'na.lolesports.com',
		method: 'GET',
		path: '/api/tournament/' + tournamentId + '.json'
	};
	makeRequest(opts, cb);
};

exports.getTeam = function(teamId, cb) {
	var opts = {
		hostname: 'na.lolesports.com',
		method: 'GET',
		path: '/api/team/' + teamId + '.json?expandPlayers=1'
	};
	makeRequest(opts, cb);
};