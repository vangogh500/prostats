var Match = require('../../../models/match.js');

exports.get = function(matches, teams, category) {
	console.log("retrieving information about: " + category); 
	var data = [];
	
	function indexOfWithAttr(arr, attr, criteria) {
		for(var i=0; i<arr.length; i++) {
			if(arr[i][attr] == criteria) {
				return i;
			}
		}
		return -1;
	}
	
	matches.forEach(function(match) {
		console.log("\t calculating: " + match.matchId + ":" + match.gameId);
		var redIdx = indexOfWithAttr(data, 'id', match.red.acronym);
		var red;
		var redAvg;
		
		if(redIdx == -1) {
			red = {
				id: match.red.acronym,
				img: teams[indexOfWithAttr(teams, 'acronym', match.red.acronym)].logoUrl,
				plots: []
			};
			data.push(red);
			redAvg = 0;
		}
		else {
			red = data[redIdx];
			redAvg = red.plots[red.plots.length -1];
		}
		
		var blueIdx = indexOfWithAttr(data, 'id', match.blue.acronym);
		var blue;
		var blueAvg;
		
		if(blueIdx == -1) {
			blue = {
				id: match.blue.acronym,
				img: teams[indexOfWithAttr(teams, 'acronym', match.blue.acronym)].logoUrl,
				plots: []
			};
			data.push(blue);
			blueAvg = 0;
		}
		else {
			blue = data[blueIdx];
			blueAvg = blue.plots[blue.plots.length -1];
		}
		blue.plots.push({
			y: blueAvg + (match.blue[category] - blueAvg)/(blue.plots.length+1),
			label: match.matchAcronym,
			matchId: match.matchId,
			gameId: match.gameId,
			x: match.gameCreation
		});
		red.plots.push({
			y: redAvg + (match.red[category] - redAvg)/(red.plots.length+1),
			label: match.matchAcronym,
			matchId: match.matchId,
			gameId: match.gameId,
			x: match.gameCreation
		});
	});
	console.log(data);
	return data;
};