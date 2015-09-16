app.controller('IndexController', function($scope){
	$scope.choice;
	$scope.choices = [
		{ name: 'Kills', detail: 'Avg Kills' },
		{ name: 'Deaths', detail: 'Avg Deaths' },
		{ name: 'Assists', detail: 'Avg Assists'}
	];
	d3.json('data/elo.json', function(err, data) {
		$scope.data = data;
		$scope.$apply();
	});
});