var fs = require('fs');
var Match = require('../../models/match.js');
var Team = require('../../models/team.js');

var outputFilename = 'elo.json';
var data = [];

var initialRating = 1000;

function indexOfWithAttr(arr, attr, criteria) {
	for(var i=0; i<arr.length; i++) {
		if(arr[i][attr] == criteria) {
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
			Team.find({}, function(err2, teams) {
				if(err) console.error(err2);
				if(teams) {
					matches.forEach(function(match) {
						console.log("\t calculating " + match.matchId + ":" + match.gameId);
						var redIdx = indexOfWithAttr(data, 'id', match.red.acronym);
						var red;
						var redElo;
						if(redIdx == -1) {
							red = {
								id: match.red.acronym,
								img: teams[indexOfWithAttr(teams, 'acronym', match.red.acronym)].logoUrl,
								plots: []
							};
							data.push(red);
							redElo = initialRating;
						}
						else {
							red = data[redIdx];
							redElo = red.plots[red.plots.length -1].y;
						}
						var blueIdx = indexOfWithAttr(data, 'id', match.blue.acronym);
						var blue;
						var blueElo;
						if(blueIdx == -1) {
							blue = {
								id: match.blue.acronym,
								img: teams[indexOfWithAttr(teams, 'acronym', match.blue.acronym)].logoUrl,
								plots: []
							};
							data.push(blue);
							blueElo = initialRating;
						}
						else {
							blue = data[blueIdx];
							blueElo = blue.plots[blue.plots.length -1].y;
						}
						blue.plots.push({
							y: rate(blueElo, redElo, match.blue.win),
							label: match.matchAcronym,
							matchId: match.matchId,
							gameId: match.gameId,
							x: match.gameCreation
						});
						red.plots.push({
							y: rate(redElo, blueElo, match.red.win),
							label: match.matchAcronym,
							matchId: match.matchId,
							gameId: match.gameId,
							x: match.gameCreation
						});
					});
				}
				fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
					if(err) console.log(err);
					else console.log("JSON saved to " + outputFilename);
				});
			});
		}
	});
};