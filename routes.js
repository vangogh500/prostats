var mainHandler = require('./handlers/main.js');

module.exports = function(app) {
	// index page
	app.get('/', mainHandler.index);
	app.get('/api/timeline/:id', mainHandler.timeline);
};
