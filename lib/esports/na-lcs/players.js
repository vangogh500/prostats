var Player = require('../../../models/player.js');

exports.formatPlayer = function(player) {
	console.log("\t searching for player: " + player.name + "...");
	Player.findOne({ name: player.name }, function(err, found) {
		if(err) console.error(err);
		if(found) {
			console.log("\t \t Player found!");
			return found;
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
			}).save();
			return toAdd;
		}
	});
};