var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
	name: String,
	acronym: String,
	logoUrl: String,
	profileUrl: String,	
	bio: String,
	roster: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Player'
	}],
	matches: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Match'
	}]
});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;