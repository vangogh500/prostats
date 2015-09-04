var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({
	ign: String,
	fullName: String,
	imgUrl: String,
	bio: String,
	nationality: String,
	age: String,
	position: String,
	contractExpDate: { type: Date },
	matches: []
});

var Player = mongoose.model('Player', playerSchema);
module.exports = Player;