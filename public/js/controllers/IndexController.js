app.controller('IndexController', function($scope){
	$scope.choice = {};
	$scope.choices = [
		{ name: 'Elo', detail: 'elo ratings by game', key: 'elo', yLabel: 'elo rating'},
		{ name: 'Win Rate', detail: 'win rate by game', key: 'win', yLabel: 'win %'},
		{ name: 'First Blood Rate', detail: "# of games where first blood was secured / # of games", key: 'firstBlood', yLabel: 'fb %'},
		{ name: 'Avg. Dragon Kills', detail: '# of dragons secured / # of games', key: 'dragonKills', yLabel: 'dragon kills' },
		{ name: 'First Dragons Rate', detail: "# of games where first dragon was secured / # of games", key: 'firstDragon', yLabel: 'first dragon %'},
		{ name: 'Avg. Baron Kills', detail: '# of barons secured / # of games', key: 'baronKills', yLabel: 'baron kills' },
		{ name: 'Avg. First Barons', detail: "# of games where first baron was secured / # of games", key: 'firstBaron', yLabel: 'first baron %'},
		{ name: 'Avg. Tower Kills', detail: "# of towers destroyed / # of games (includes Azir's passive)", key: 'towerKills', yLabel: 'tower kills'},
		{ name: 'Avg. First Towers', detail: "# of games where first tower was secured / # of games", key: 'firstTower', yLabel: 'first tower rate'},
		{ name: 'Avg. Inhibitor Kills', detail: "# of inhibitors destroyed / # of games", key: 'inhibitorKills', yLabel: 'inhibitor kills'},
		{ name: 'Avg. First Inhibitor', detail: "# of games where first inhibitor was secured / # of games", key: 'firstInhibitor', yLabel: 'first inhibitor %'}
	];
	function update(id, yLabel) {
		d3.json('/api/timeline/' + id).header("Content-Type", "application/json").send("GET",function(err, data) {
			$scope.data = {
				data: data,
				yLabel: yLabel
			};
			$scope.$apply();
		});
	}
	
	$scope.$watch('choice.selected', function(chosen) {
		if(chosen) update(chosen.key, chosen.yLabel);
	});
});