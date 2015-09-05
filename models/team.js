var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
	name: String,
	acronym: String,
	logoUrl: String,
	profileUrl: String,	
	bio: String,
	roster: [],
	matches: []
});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;