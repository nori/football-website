var footballApp = angular.module('footballApp', ['ngRoute', 'ngResource', 'ngSanitize', 'ngAnimate', 'ui.calendar', 'mgcrea.ngStrap']);

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
                        '$compile',
                        'Rankings', 
                        'Fixtures', function($scope, $routeParams, $compile, Rankings, Fixtures) {
    Rankings.get({id: $routeParams.id}, function(rankObject) {
        $scope.rankings = rankObject.ranking;
        $scope.logos = {};
        for (var i = 0; i < rankObject.ranking.length; i++) {
            $scope.logos[rankObject.ranking[i].team] = rankObject.ranking[i].crestURI;
        }
    });

    $scope.events = [];
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
        $scope.fixtures = fixtures;
        $scope.prevFixtures = prevFixtures;
        $scope.nextFixtures = nextFixtures;

        var dates = {};
        for (i = 0; i < fixtures.length; i++) {
            var dateNoTime = new Date(fixtures[i].date);
            dateNoTime.setHours(0, 0, 0, 0);
            if (!dates[dateNoTime]) {
                dates[dateNoTime] = [];
            }
            var d = new Date(fixtures[i].date);
            var seperator = " - ";
            if (fixtures[i].goalsHomeTeam > -1) {
                seperator = " " + fixtures[i].goalsHomeTeam + " - " + fixtures[i].goalsAwayTeam + " ";
            }

            var homeTeam = fixtures[i].homeTeam;
            var awayTeam = fixtures[i].awayTeam;
            if (fixtures[i].goalsHomeTeam > fixtures[i].goalsAwayTeam) {
                homeTeam = "<b>" + homeTeam + "</b>";
            }
            if (fixtures[i].goalsHomeTeam < fixtures[i].goalsAwayTeam) {
                awayTeam = "<b>" + awayTeam + "</b>";
            }

            var eventObject = {
                title: $scope.addZero(d.getHours()) + ":" + $scope.addZero(d.getMinutes()) + " " +
                        homeTeam + seperator + awayTeam,
                date: fixtures[i].date,
                matchday: fixtures[i].matchday
            };
            dates[dateNoTime].push(eventObject);
        }

        for (var date in dates) {
            if (dates.hasOwnProperty(date)) {
                var e = {};
                var texts = [];
                for (i = 0; i < dates[date].length; i++) {
                    texts.push(dates[date][i].title);
                }
                e.start = date;
                e.fixtures = texts.join("<br>");
                // e.title = dates[date].length + " leikir";
                e.title = dates[date][0].matchday + ". umferð";
                $scope.events.push(e);
            }
        }
        
        angular.element('#myCalendar').fullCalendar('addEventSource', $scope.events);
    });

    $scope.addZero = function(i) {
        if (i < 10) {
            return "0" + i;
        }
        return i;
    };

    $scope.selectedTeam = null;
    $scope.toggleTeam = function(team) {
        if ($scope.selectedTeam !== team) {
            $scope.selectedTeam = team;
        } else {
            $scope.selectedTeam = null;
        }
    };

    $scope.eventRender = function( event, element, view ) {
        var gamlaHtml = element.html();
        var rettHtml = "<button type='button' class='eventButton btn btn-primary fc-event-inner' data-content='" + event.fixtures + "' " +
                    "data-html='html' data-title='Leikir' bs-popover " +
                    "data-animation='am-flip-x' container='body' trigger='focus'>";
        gamlaHtml = gamlaHtml.replace("<div class=\"fc-event-inner\">", rettHtml);
        gamlaHtml = gamlaHtml.replace("</div>", "</button>");
        element.html(gamlaHtml);

        $compile(element)($scope);
    };

    $scope.uiConfig = {
        calendar:{
            height: 450,
            width: 450,
            editable: false,
            header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventRender: $scope.eventRender,
            dayNames: ['Sunnudagur', 'Mánudagur', 'Þriðjudagur', 'Miðvikudagur', 'Fimmtudagur', 'Föstudagur', 'Laugardagur'],
            dayNamesShort: ['Sun', 'Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau'],
            monthNames: ['Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí', 'Júní', 'Júlí', 'Ágúst', 'September', 'Október', 'Nóvember', 'Desember'],
            buttonText: {
                today: 'Í dag'
            }
        }
    };

    $scope.eventSources = [];
}]);

