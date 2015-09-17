var statistics = require('../lib/statistics/team/statistics.js');


exports.index = function(req, res){
	res.render('index.jade', {title: 'Welcome to Lol Pro!'});
};

exports.timeline = function(req, res){
	res.json(statistics.getTimeline(req.params.id));
};