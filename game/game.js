angular.module('game', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('game').config(function ($stateProvider) {
    $stateProvider
        .state('game', {
            url: '/game',
            templateUrl: 'game/game.html',
            controller:'gameWrapperController'
        });
})
.controller('gameWrapperController', function($scope, requireService, $injector, $window) {
        $window.createGame({
            $scope: $scope,
            $injector: $injector,
            requireService: requireService
        }, null);
    })
;

