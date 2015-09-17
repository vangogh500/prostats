var statistics = require('../lib/statistics/team/statistics.js');


exports.index = function(req, res){
	res.render('index.jade', {title: 'Welcome to Lol Pro!'});
};

exports.timeline = function(req, res){
	statistics.getTimeline(req.params.id, function(timeline){
		console.log(timeline);
		res.json(timeline);
	});
};