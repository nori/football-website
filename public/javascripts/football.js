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

footballApp.factory('Fixtures', ['$resource', 
    function($resource) {
        return $resource('/api/seasons/:id/fixtures', {}, {
            query: {method:'GET', params:{id:'id'}, isArray:true}
        });
}]);

footballApp.controller('FootballController', ['$scope', 'Seasons', function($scope, Seasons) {
    $scope.seasons = Seasons.query();
}]);

footballApp.controller('RankingsController', 
                        ['$scope', 
                        '$routeParams', 
                        'Rankings', 
                        'Fixtures', function($scope, $routeParams, Rankings, Fixtures) {
    Rankings.get({id: $routeParams.id}, function(rankObject) {
        $scope.rankings = rankObject.ranking;
        $scope.logos = {};
        for (var i = 0; i < rankObject.ranking.length; i++) {
            $scope.logos[rankObject.ranking[i].team] = rankObject.ranking[i].crestURI;
        }
    });
    Fixtures.query({id: $routeParams.id}, function(fixtures) {
        var prevFixtures = [];
        var nextFixtures = [];
        for (var i = 0; i < fixtures.length; i++) {
            if (fixtures[i].goalsHomeTeam > -1) {
                prevFixtures.push(fixtures[i]);
            } else {
                nextFixtures.push(fixtures[i]);
            }
        }
        $scope.prevFixtures = prevFixtures;
        $scope.nextFixtures = nextFixtures;
    });

    $scope.selectedTeam = null;
    $scope.toggleTeam = function(team) {
        if ($scope.selectedTeam !== team) {
            $scope.selectedTeam = team;
        } else {
            $scope.selectedTeam = null;
        }
    };
}]);
