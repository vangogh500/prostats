var crawler = require('./crawler.js');
var async = require('async');

exports.formatPlayer = function(player) {
	console.log("\t \t" + player.name);
	console.log("\t \t \t firstName: " + player.firstName);
	console.log("\t \t \t lastName: " + player.lastName);
	console.log("\t \t \t hometown: " + player.hometown);
	console.log("\t \t \t role: " + player.role);
	console.log("\t \t \t photoUrl: " + player.photoUrl);
	console.log("\t \t \t profileUrl: " + player.profileUrl);
	console.log("\t \t \t contractExpiration: " + player.contractExpiration);
};