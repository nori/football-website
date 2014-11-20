var footballApp = angular.module('footballApp', ['ngResource']);

footballApp.factory('Seasons', ['$resource', 
    function($resource) {
        console.log("TESTasd");
        return $resource('/api/seasons', {}, {
            query: {method:'GET', params:{}, isArray:true}
        });
}]);

footballApp.controller('FootballController', ['$scope', 'Seasons', function($scope, Seasons) {
    console.log(Seasons.query());
    $scope.seasons = Seasons.query();
}]);

// todo route dót
