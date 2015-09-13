app.controller('IndexController', function($scope){
	d3.json('data/elo.json', function(err, data) {
		$scope.data = data;
		$scope.$apply();
	});
});