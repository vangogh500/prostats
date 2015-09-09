var fs = require('fs');
var Match = require('../../models/match.js');

var outputFilename = '../../public/data/elo.json';
var data = [];

Match.find({}).sort('




fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
		if(err) console.log(err);
		else console.log("JSON saved to " + outputFilename);
});