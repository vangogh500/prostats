var page = require('webpage').create();
page.onCallback = function() {
  page.render('snapshot.png');
  phantom.exit();
};
page.open('http://na.lolesports.com/na-lcs/2015/spring/matches/week-1/team-solomid-vs-cloud9');