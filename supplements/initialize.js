var esports = require('../lib/esports/esports.js');
var fs = require('fs');

var outputFilename = 'matches.json';

var data = [];

function contains(matchId, gameId) {
	if(data.length) {
		for(var i=0; i< data.length; i++) {
			if(data[i].matchId == matchId && data[i].gameId == gameId) {
				return true;
			}
		}
	}
	return false;
}

function getMatch(match, game) {
	var blueInfo;
	var redInfo;
	var matchTitle;
	
	if(match.maxGames == 1) matchTitle = match.matchName;
	else matchTitle = match.matchName + " Game " + (Number(game.substr(game.length -1))+1); 
	
	if(Number(game.substr(game.length -1)) % 2 == 0) {
		blueInfo = {
			id: match.contestants.blue.id,
			acronym: match.contestants.blue.acronym
		};
		redInfo = {
			id: match.contestants.red.id,
			acronym: match.contestants.red.acronym
		};	
	}
	else {
		blueInfo = {
			id: match.contestants.red.id,
			acronym: match.contestants.red.acronym
		};
		redInfo = {
			id: match.contestants.blue.id,
			acronym: match.contestants.blue.acronym
		};
	}
	
	var newMatch = {
		matchId: match.matchId,
		gameId: match.gamesInfo[game].id,
		dateTime: new Date(match.dateTime),
		matchName: matchTitle,
		url: match.url,
		statUrl: "",
		blue: blueInfo,
		red: redInfo,
		winnerId: match.gamesInfo[game].winnerId
	}
	return newMatch;
}



fs.exists(outputFilename, function(exists) {
	if(exists) {
		console.log("File already exists. Updating...");
		data = JSON.parse(fs.readFileSync(outputFilename, 'utf8'));
	}
	else { 
		console.log("File doesn't exist. Creating new file...");
	}
	esports.getProgramming(197, function(programming) {
		for(var day in programming) {
			programming[day].matches.forEach(function(match) {
				for(var game in match.gamesInfo) {				
					if(contains(match.matchId, match.gamesInfo[game].id)) { console.log("\t Match " + match.matchId + ":" + match.gamesInfo[game].id + " already exists!"); }
					else {
						console.log("\t Match " + match.matchId + " does not exist. Adding...");
						data.push(getMatch(match, game));
					}
				}
			});
		}
		fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
			if(err) console.log(err);
			else console.log("JSON saved to " + outputFilename);
		});
	});
});

