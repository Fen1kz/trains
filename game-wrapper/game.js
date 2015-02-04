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
        var GAME_SIZE = {
            WIDTH: 600, HEIGHT: 600
        };
        var game = gameService.createGame({
            $scope: $scope,
            $injector: $injector,
            requireService: requireService
        }, {
            width: GAME_SIZE.WIDTH, height: GAME_SIZE.WIDTH
        });

        $(window).resize(function() { window.resizeGame(); } );
        window.resizeGame = function () {
            var size = {
                width: $('#canvas-wrapper').width(),
                height: $(window).height() - 100
            };
            size.width = size.width > GAME_SIZE.WIDTH ? GAME_SIZE.WIDTH : size.width;
            size.height = size.height > GAME_SIZE.WIDTH ? GAME_SIZE.WIDTH : size.height;


            game.width = size.width;
            game.height = size.height;
            game.canvas.width = size.width;
            game.canvas.height = size.height;
            //game.world.setBounds(0, 0, size.width, size.height);
            game.scale.width = size.width;
            game.scale.height = size.height;
            game.camera.setSize(size.width, size.height);
            //game.camera.setBoundsToWorld();
            // resize debug offscreen canvas
            if (game.debug.sprite) {
                game.debug.sprite.removeStageReference();
            }
            game.debug.boot();

            //(<any>this.game.renderer).resize(size.width, size.height);

            // Tell ScaleManager that we have changed sizes
            game.scale.setSize();
        }

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

