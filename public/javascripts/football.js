var footballApp = angular.module('footballApp', ['ngRoute', 'ngResource']);

footballApp.config(function($routeProvider) {
  $routeProvider
  	.when('/rankings/:id', {
      templateUrl:'/partials/rankings/',
      controller:'RankingsController'
    })
    .when('/', {
      templateUrl:'/partials/seasons/',
      controller:'FootballController'
    })
    .otherwise({
      redirectTo:'/rankings/:id'
    });
});

footballApp.factory('Seasons', ['$resource', 
    function($resource) {
        return $resource('/api/seasons', {}, {
            query: {method:'GET', params:{}, isArray:true}
        });
}]);

footballApp.factory('Rankings', ['$resource', 
    function($resource) {
        return $resource('/api/seasons/:id/ranking', {}, {
            query: {method:'GET', params:{id:'id'}, isArray:false}
        });
}]);

footballApp.controller('FootballController', ['$scope', 'Seasons', function($scope, Seasons) {
    $scope.seasons = Seasons.query();
}]);

footballApp.controller('RankingsController', ['$scope', '$routeParams', 'Rankings', function($scope, $routeParams, Rankings) {
	Rankings.get({id: $routeParams.id}, function(rankObject) {
    	$scope.rankings = rankObject.ranking;
  	});
  	/*
	var rankingObject = Rankings.query();
	rankingObject.$promise.then(function(rankObject) {
		$scope.rankings = rankObject.ranking;
	});
*/
}]);
