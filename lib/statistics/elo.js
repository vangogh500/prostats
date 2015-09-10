var fs = require('fs');
var Match = require('../../models/match.js');

var outputFilename = 'elo.json';
var data = [];

var initialRating = 1000;

function indexOfTeam(arr, teamAcronym) {
	for(var i=0; i<arr.length; i++) {
		if(arr[i].acronym == teamAcronym) {
			return i;
		}
	}
	return -1;
}
function swe(selfElo, oppElo) {
	return 1 / (1+Math.pow(10, -(selfElo - oppElo)/400));
}
function kFactor(selfElo) {
	var constant = 50;
	if(selfElo < 2100) return constant*4;
	else if(selfElo < 2400) return constant*3;
	else return constant*2;
}

function rate(selfElo, oppElo, score) {
	return selfElo + kFactor(selfElo)*(score - swe(selfElo, oppElo));
}

exports.get = function() {
	console.log("Calculating elo...");
	Match.find({}).sort('gameCreation').exec(function(err, matches) {
		if(err) console.error(err);
		if(matches) {
			matches.forEach(function(match) {
				console.log("\t calculating " + match.matchId + ":" + match.gameId);
				var redIdx = indexOfTeam(data, match.red.acronym);
				var red;
				var redElo;
				if(redIdx == -1) {
					red = {
						acronym: match.red.acronym,
						event: []
					};
					data.push(red);
					redElo = initialRating;
				}
				else {
					red = data[redIdx];
					redElo = red.events[red.events.length -1].elo;
				}
				var blueIdx = indexOfTeam(data, match.blue.acronym);
				var blue;
				var blueElo;
				if(blueIdx == -1) {
					blue = {
						acronym: match.blue.acronym,
						event: []
					};
					data.push(blue);
					blueElo = initialRating;
				}
				else {
					blue = data[blueIdx];
					blueElo = blue.events[blue.events.length -1].elo;
				}
				blue.events.push({
					elo: rate(blueElo, redElo, match.blue.win),
					acronym: match.matchAcronym,
					matchId: match.matchId,
					gameId: match.gameId,
					gameCreation: match.gameCreation
				});
				red.events.push({
					elo: rate(redElo, blueElo, match.red.win),
					acronym: match.matchAcronym,
					matchId: match.matchId,
					gameId: match.gameId,
					gameCreation: match.gameCreation
				});
			});
		}
		fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
			if(err) console.log(err);
			else console.log("JSON saved to " + outputFilename);
		});
	});
};