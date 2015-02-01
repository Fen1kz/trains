angular.module('game', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('game').config(function ($stateProvider) {
    $stateProvider
        .state('game', {
            url: '/game',
            templateUrl: 'game-wrapper/game.html',
            controller:'gameWrapperController'
        });
})
.controller('gameWrapperController', function($scope, $injector, requireService, gameService, $modal) {
        var game = gameService.createGame({
            $scope: $scope,
            $injector: $injector,
            requireService: requireService
        }, {
            width: 800, height: 500
        });
        //var $canvas = $(game.canvas);
        //console.log(game, game.canvas);

        //$canvas.click(function() {
        //    $('#ui').popover('destroy');
        //    $('#ui')
        //        .popover({
        //            trigger: 'manual'
        //            //,container: 'body'
        //            ,viewport: '#canvas-wrapper'
        //            , content: "asdfasdfsadf"
        //        })
        //        .popover('show');
        //});


        //$modal.open({
        //    template: "hey hey"
        //})

        //$('<div>')
        //    .css('left', 20)
        //    .css('top', 20)
        //    .attr('class', 'confirmbox')
        //    .text('asdfasdf')
        //    .appendTo('#canvas-wrapper');
    })
;

