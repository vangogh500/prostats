var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
	name: String,
	logoURL: String,
	founded: { type: Date },
	nationality: String,
	bio: String,
	roster: [],
	matches: []
});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;