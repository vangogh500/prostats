var mongoose = require('mongoose');

var matchSchema = mongoose.Schema({
	matchId: Number,
	gameId: Number,
	matchName: String,
	matchAcronym: String,
	url: String,
	statUrl: String,
	gameDuration: Number,
	gameVersion: String,
	blue: {
		acronym: String,
		win: Boolean,
		firstBlood: Boolean,
		firstTower: Boolean,
		firstInhibitor: Boolean,
		firstBaron: Boolean,
		firstDragon: Boolean,
		towerKills: Number,
		inhibitorKills: Number,
		baronKills: Number,
		dragonKills: Number,
		bans: [{
			championId: Number,
			pickTurn: Number,
		}],
		players: [{
			player: String
			championId: Number,
			spell1Id: Number,
			spell2Id: Number,
			itemIds: [Number],
			kills: Number,
			deaths: Number,
			assists: Number,
			largestKillingSpree: Number,
			largestMultiKill: Number,
			killingSprees: Number,
			longestTimeSpentLiving: Number,
			doubleKills: Number,
			tripleKills: Number,
			quadraKills: Number,
			pentaKills: Number,
			totalDamageDealt: Number,
			magicDamageDealt: Number,
			physicalDamageDealt: Number,
			trueDamageDealt: Number,
			largestCriticalStrike: Number,
			totalDamageDealtToChampions: Number,
			magicDamageDealtToChampions: Number,
			physicalDamageDealtToChampions: Number,
			trueDamageDealtToChampions: Number,
			totalHeal: Number,
			totalDamageTaken: Number,
			magicalDamageTaken: Number,
			physicalDamageTaken: Number,
			trueDamageTaken: Number,
			goldEarned: Number,
			goldSpent: Number,
			turretKills: Number,
			inhibitorKills: Number,
			totalMinionsKilled: Number,
			neutralMinionsKilled: Number,
			neutralMinionsKilledTeamJungle: Number,
			neutralMinionsKilledEnemyJungle: Number,
			totalTimeCrowdControlDealt: Number,
			champLevel: Number,
			visionWardsBought: Number,
			sightWardsBought: Number,
			wardsPlaced: Number,
			wardsKilled: Number,
			firstBloodKill: Boolean,
			firstBloodAssist: Boolean,
			firstTowerKill: Boolean,
			firstTowerAssist: Boolean,
			firstInhibitorKill: Boolean,
			firstInhibitorAssist: Boolean,
			timeline: {
				creepsPerMinDeltas: {
					30-end: Number,
					10-20: Number,
					20-30: Number,
					0-10: Number
				},
				xpPerMinDeltas: {
					30-end: Number,
					10-20: Number,
					20-30: Number,
					0-10: Number
				},
				goldPerMinDeltas: {
					30-end: Number,
					10-20: Number,
					20-30: Number,
					0-10: Number
				},
				damageTakenPerMinDeltas: {
					30-end: Number,
					10-20: Number,
					20-30: Number,
					0-10: Number
				}
			}
		}]
	},
	red: {
		acronym: String,
		win: Boolean,
		firstBlood: Boolean,
		firstTower: Boolean,
		firstInhibitor: Boolean,
		firstBaron: Boolean,
		firstDragon: Boolean,
		towerKills: Number,
		inhibitorKills: Number,
		baronKills: Number,
		dragonKills: Number,
		bans: [{
			championId: Number,
			pickTurn: Number,
		}],
		players: [{
			player: String
			championId: Number,
			spell1Id: Number,
			spell2Id: Number,
			itemIds: [Number],
			kills: Number,
			deaths: Number,
			assists: Number,
			largestKillingSpree: Number,
			largestMultiKill: Number,
			killingSprees: Number,
			longestTimeSpentLiving: Number,
			doubleKills: Number,
			tripleKills: Number,
			quadraKills: Number,
			pentaKills: Number,
			totalDamageDealt: Number,
			magicDamageDealt: Number,
			physicalDamageDealt: Number,
			trueDamageDealt: Number,
			largestCriticalStrike: Number,
			totalDamageDealtToChampions: Number,
			magicDamageDealtToChampions: Number,
			physicalDamageDealtToChampions: Number,
			trueDamageDealtToChampions: Number,
			totalHeal: Number,
			totalDamageTaken: Number,
			magicalDamageTaken: Number,
			physicalDamageTaken: Number,
			trueDamageTaken: Number,
			goldEarned: Number,
			goldSpent: Number,
			turretKills: Number,
			inhibitorKills: Number,
			totalMinionsKilled: Number,
			neutralMinionsKilled: Number,
			neutralMinionsKilledTeamJungle: Number,
			neutralMinionsKilledEnemyJungle: Number,
			totalTimeCrowdControlDealt: Number,
			champLevel: Number,
			visionWardsBought: Number,
			sightWardsBought: Number,
			wardsPlaced: Number,
			wardsKilled: Number,
			firstBloodKill: Boolean,
			firstBloodAssist: Boolean,
			firstTowerKill: Boolean,
			firstTowerAssist: Boolean,
			firstInhibitorKill: Boolean,
			firstInhibitorAssist: Boolean,
			timeline: {
				creepsPerMinDeltas: {
					30-end: Number,
					10-20: Number,
					20-30: Number,
					0-10: Number
				},
				xpPerMinDeltas: {
					30-end: Number,
					10-20: Number,
					20-30: Number,
					0-10: Number
				},
				goldPerMinDeltas: {
					30-end: Number,
					10-20: Number,
					20-30: Number,
					0-10: Number
				},
				damageTakenPerMinDeltas: {
					30-end: Number,
					10-20: Number,
					20-30: Number,
					0-10: Number
				}
			}
		}]
	}
});

var Match = mongoose.model('Match', matchSchema);
module.exports = Match;