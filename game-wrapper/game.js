angular.module('game', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('game').config(function ($stateProvider) {
    $stateProvider
        .state('game', {
            url: '/game',
            templateUrl: 'game-wrapper/game.html',
            controller:'gameWrapperController'
        });
})
.controller('gameWrapperController', function($scope, requireService, gameService, $injector) {
        gameService.createGame({
            $scope: $scope,
            $injector: $injector,
            requireService: requireService
        }, {
            width: 800, height: 500
        });
    })
;

