var acs = require('../acs.js');
var data = require('../../../supplements/matches.json');
var Match = require('../../../models/team.js');
var Team = require('../../../models/team.js');
var Player = require('../../../models/player.js');

function formatMatch(data, game) {
	Match.findOne({ matchId: game.matchId, gameId: game.gameId }, function(err, found) {
		if(err) console.error(err)
		var dbMatch;
		if(found) {
			console.log("Match " + game.matchId + ":" + game.gameId + " found!");
			dbMatch = found;
		}
		else {
			console.log("Match " + game.matchId + ":" + game.gameId + " was not found in the database. Adding...");
			function getTeamById(id) {
				for (var i=0; i<data.teams.length; i++) {
					if(data.teams[i].teamId == id) return data.teams[i];
				}
			}
			function getWinnerAcronym() {
				var winnerId = game.winnerId;
				if(game.blue.id == game.winnerId) return game.blue.acronym;
				else return game.red.acronym;
			}
	
			var blueTeam = getTeamById(100);
			var redTeam = getTeamById(200);
			console.log("\t creating match template...");
			var matchToAdd = {
				matchId: game.matchId,
				gameId: game.gameId,
				matchName: game.matchName,
				matchAcronym: game.blue.acronym + " vs " + game.red.acronym,
				url: game.url,
				statUrl: game.statUrl,
				gameDuration: data.gameDuration,
				gameVersion: data.gameVersion,
				winnerAcronym: getWinnerAcronym(),
				blue: {
					acronym: game.blue.acronym,
					win: (blueTeam.win == "Win"),
					firstBlood: blueTeam.firstBlood,
					firstTower: blueTeam.firstTower,
					firstInhibitor: blueTeam.firstInhibitor,
					firstBaron: blueTeam.firstBaron,
					firstDragon: blueTeam.firstDragon,
					towerKills: blueTeam.towerKills,
					inhibitorKills: blueTeam.inhibitorKills,
					baronKills: blueTeam.baronKills,
					dragonKills: blueTeam.dragonKills,
					bans: blueTeam.bans,
					players: []
				},
				red: {
					acronym: game.red.acronym,
					win: (redTeam.win == "Win"),
					firstBlood: redTeam.firstBlood,
					firstTower: redTeam.firstTower,
					firstInhibitor: redTeam.firstInhibitor,
					firstBaron: redTeam.firstBaron,
					firstDragon: redTeam.firstDragon,
					towerKills: redTeam.towerKills,
					inhibitorKills: redTeam.inhibitorKills,
					baronKills: redTeam.baronKills,
					dragonKills: redTeam.dragonKills,
					bans: redTeam.bans,
					players: []
				}
			};
	
			data.participants.forEach(function(participant) {
				function getPlayerNameById(playerId) {
					for(var i=0; i<data.participantIdentities.length; i++) {
						if(data.participantIdentities[i].participantId == playerId) return data.participantIdentities[i].player.summonerName;
					}
				}
		
				console.log("\t adding player " + getPlayerNameById(participant.participantId) + "...");
				var playerToAdd = {
					playerName: getPlayerNameById(participant.participantId),
					championId: participant.championId,
					spell1Id: participant.spell1Id,
					spell2Id: participant.spell2Id,
					itemIds: [participant.stats.item0, participant.stats.item1, participant.stats.item2, participant.stats.item3, participant.stats.item4, participant.stats.item5, participant.stats.item6],
					kills: participant.stats.kills,
					deaths: participant.stats.deaths,
					assists: participant.stats.assists,
					largestKillingSpree: participant.stats.largestKillingSpree,
					largestMultiKill: participant.stats.largestMultiKill,
					killingSprees: participant.stats.killingSprees,
					longestTimeSpentLiving: participant.stats.longestTimeSpentLiving,
					doubleKills: participant.stats.doubleKills,
					tripleKills: participant.stats.tripleKills,
					quadraKills: participant.stats.quadraKills,
					pentaKills: participant.stats.pentaKills,
					totalDamageDealt: participant.stats.totalDamageDealt,
					magicDamageDealt: participant.stats.magicDamageDealt,
					physicalDamageDealt: participant.stats.physicalDamageDealt,
					trueDamageDealt: participant.stats.trueDamageDealt,
					largestCriticalStrike: participant.stats.largestCriticalStrike,
					totalDamageDealtToChampions: participant.stats.totalDamageDealtToChampions,
					magicDamageDealtToChampions: participant.stats.magicDamageDealtToChampions,
					physicalDamageDealtToChampions: participant.stats.physicalDamageDealtToChampions,
					trueDamageDealtToChampions: participant.stats.trueDamageDealtToChampions,
					totalHeal: participant.stats.totalHeal,
					totalDamageTaken: participant.stats.totalDamageTaken,
					magicalDamageTaken: participant.stats.magicalDamageTaken,
					physicalDamageTaken: participant.stats.physicalDamageTaken,
					trueDamageTaken: participant.stats.trueDamageTaken,
					goldEarned: participant.stats.goldEarned,
					goldSpent: participant.stats.goldSpent,
					turretKills: participant.stats.turretKills,
					inhibitorKills: participant.stats.inhibitorKills,
					totalMinionsKilled: participant.stats.totalMinionsKilled,
					neutralMinionsKilled: participant.stats.neutralMinionsKilled,
					neutralMinionsKilledTeamJungle: participant.stats.neutralMinionsKilledTeamJungle,
					neutralMinionsKilledEnemyJungle: participant.stats.neutralMinionsKilledEnemyJungle,
					totalTimeCrowdControlDealt: participant.stats.totalTimeCrowdControlDealt,
					champLevel: participant.stats.champLevel,
					visionWardsBought: participant.stats.visionWardsBought,
					sightWardsBought: participant.stats.sightWardsBought,
					wardsPlaced: participant.stats.wardsPlaced,
					wardsKilled: participant.stats.wardsKilled,
					firstBloodKill: participant.stats.firstBloodKill,
					firstBloodAssist: participant.stats.firstBloodAssist,
					firstTowerKill: participant.stats.firstTowerKill,
					firstTowerAssist: participant.stats.firstTowerAssist,
					firstInhibitorKill: participant.stats.firstInhibitorKill,
					firstInhibitorAssist: participant.stats.firstInhibitorAssist,
					timeline: {
						creepsPerMinDeltas: participant.timeline.creepsPerMinDeltas,
						xpPerMinDeltas: participant.timeline.xpPerMinDeltas,
						goldPerMinDeltas: participant.timeline.goldPerMinDeltas,
						damageTakenPerMinDeltas: participant.timeline.damageTakenPerMinDeltas
					}
				};
		
				if(participant.teamId == 100) matchToAdd.blue.players.push(playerToAdd);
				else matchToAdd.red.players.push(playerToAdd);
			});
			dbMatch = new Match(matchToAdd).save(function(err) {
				console.error(err);
			});
		}
		Team.findOneAndUpdate({ acronym: game.blue.acronym }, { $push: { matches: dbMatch._id }}, function(err, updated) {
			if(err) console.error(err);
			if(updated) console.log("\t added match to team " + game.blue.acronym);
			else console.log("\t WARNING: Could not find team. Make sure to get teams first");
		});
		Team.findOneAndUpdate({ acronym: game.red.acronym }, { $push: { matches: dbMatch._id }}, function(err, updated) {
			if(err) console.error(err);
			if(updated) console.log("\t added match to team " + game.blue.acronym);
			else console.log("\t WARNING: Could not find team. Make sure to get teams first");
		});
		data.participantIdentities.forEach(function(participant) {
			var summoner = participant.player.summonerName;
			var playerName = summoner.substring(summoner.indexOf(" ") + 1, summoner.length);
			Player.findOneAndUpdate({ name: playerName }, { $push: { matches: dbMatch._id }}, function(err, updated) {
				if(err) console.log(err);
				if(updated) console.log("\t added match to player " + playerName);
				else console.log("\t WARNING: Could not find player. Make sure to get players first");
			});
		});
	});
}

exports.get = function() {
	data.forEach(function(match) {
		acs.getMatch(match.statUrl, function(res) {
			formatMatch(res, match);
		});
	});
};
