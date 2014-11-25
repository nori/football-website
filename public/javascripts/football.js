var footballApp = angular.module('footballApp', ['ngRoute', 'ngResource']);

footballApp.config(['$routeProvider', function($routeProvider) {
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
      redirectTo:'/'
    });
}]);

footballApp.factory('Seasons', ['$resource', 
    function($resource) {
        return $resource('/api/seasons', {}, {
            query: {method:'GET', params:{}, isArray:true}
        });
}]);

footballApp.factory('Rankings', ['$resource', 
    function($resource) {
    	console.log("test");
        return $resource('/api/seasons/351/ranking', {}, {
            query: {method:'GET', params:{}, isArray:false}
        });
}]);

footballApp.controller('FootballController', ['$scope', 'Seasons', function($scope, Seasons) {
	console.log("seasons");
    $scope.seasons = Seasons.query();
}]);

footballApp.controller('RankingsController', ['$scope', 'Rankings', function($scope, Rankings) {
	console.log("rankings controller");
    $scope.rankings = Rankings.query().rankings;
}]);
