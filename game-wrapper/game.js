angular.module('game', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('game').config(function ($stateProvider) {
    $stateProvider
        .state('game', {
            url: '/game',
            templateUrl: 'game-wrapper/game.html',
            controller:'gameWrapperController'
        });
})
.constant('GAME', {
    WIDTH: 1600, HEIGHT: 1600
})
.controller('gameWrapperController', function($scope, $injector, GAME, requireService, gameService) {
    $scope.game = gameService.createGame({
        $scope: $scope,
        $injector: $injector,
        requireService: requireService
    }, {
        width: GAME.WIDTH, height: GAME.HEIGHT
    }, function createCallback() {
        resizeGame();
    });

    window.drawCircle = function(x,y,r) {
        $scope.game.add.graphics().beginFill(0xFF0000).drawCircle(x,y,r || 5);
    };
    $(window).resize(function() { resizeGame(); } );
    function resizeGame () {
        var size = {
            width: $('#canvas-wrapper').width(),
            height: $(window).height() - 100
        };
        size.width = size.width > GAME.WIDTH ? GAME.WIDTH : size.width;
        size.height = size.height > GAME.WIDTH ? GAME.WIDTH : size.height;

        $scope.game.width = size.width;
        $scope.game.height = size.height;
        $scope.game.canvas.width = size.width;
        $scope.game.canvas.height = size.height;
        //game.world.setBounds(0, 0, size.width, size.height);
        $scope.game.scale.width = size.width;
        $scope.game.scale.height = size.height;
        $scope.game.camera.setSize(size.width, size.height);
        //game.camera.setBoundsToWorld();
        // resize debug offscreen canvas
        if ( $scope.game.debug.sprite) {
            $scope.game.debug.sprite.removeStageReference();
        }
        $scope.game.debug.boot();

        //(<any>this.game.renderer).resize(size.width, size.height);

        // Tell ScaleManager that we have changed sizes
        $scope.game.scale.setSize();
    }
});
