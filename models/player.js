var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
	name: String,
	firstName: String,
	lastName: String,
	photoUrl: String,
	profileUrl: String,
	bio: String,
	hometown: String,
	role: String,
	contractExpiration: { type: Date },
	matches: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Match'
	}]
});

var Player = mongoose.model('Player', playerSchema);
module.exports = Player;