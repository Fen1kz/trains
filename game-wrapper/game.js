angular.module('game', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate'])
.config(function ($stateProvider) {
    $stateProvider
        .state('game', {
            url: '/game',
            templateUrl: 'game-wrapper/game.html',
            controller:'gameWrapperController'
        });
})
.controller('gameWrapperController', function($scope) {
    //window.drawCircle = function(x,y,r) {
    //    $scope.game.add.graphics().beginFill(0xFF0000).drawCircle(x,y,r || 5);
    //};
});
