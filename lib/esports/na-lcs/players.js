var Player = require('../../../models/player.js');
var Team = require('./team.js');

exports.formatPlayer = function(player, teamName) {
	console.log("\t searching for player: " + player.name + "...");
	Player.findOne({ name: player.name }, function(err, found) {
		if(err) console.error(err);
		if(found) {
			console.log("\t \t Player found!");
			Team.update({ name: teamName, roster: found._id }, { $push: { roster: found._id }});
		}
		else {
			console.log("\t \t Player not found. Adding to database...");
			var toAdd = new Player({
				name: player.name,
				firstName: player.firstname,
				lastName: player.lastName,
				photoUrl: player.photoUrl,
				profileUrl: player.profileUrl,
				bio: '',
				hometown: player.hometown,
				role: player.role,
				contractExpiration: new Date(player.contractExpiration),
				matches: []
			}).save(function(err) {
				Team.update({ name: teamName, roster: toAdd._id }, { $push: { roster: toAdd._id }});
			});
		}
		
	});
};