angular.module('game').run(function ($window, GAME, requireService) {
    requireService.define('game.states.bootState', function (data) {
        return {
            preload: function () {
                this.game.load.image('hex', 'game/assets/hex.png');
                this.game.load.image('c', 'game/assets/circle.png');
                this.game.load.spritesheet('rails', 'game/assets/tiles/rails3.png', 64, 64);
            },
            create: function () {
                var $game = this.game;
                this.game.stage.backgroundColor = 0xffffff;
                this.game.world.setBounds(0, 0, this.game.c.WORLD_WIDTH, this.game.c.WORLD_HEIGHT);
                this.game.camera.x = this.game.world._width / 2;
                this.game.camera.y = this.game.world._height / 2;

                $game.ui.init($game);
                $game.controller = requireService.require('game.controller');

                // resizing
                angular.element($window).on('resize', function (evt) {
                    var size = {
                        width: angular.element(GAME.CONTAINER_ID).width(),
                        height: angular.element($window).height() - $('#game-header').height() - $('#game-footer').height()
                    };
                    size.width = size.width > GAME.WIDTH ? GAME.WIDTH : size.width;
                    size.height = size.height > GAME.WIDTH ? GAME.WIDTH : size.height;

                    $game.width = size.width;
                    $game.height = size.height;
                    $game.canvas.width = size.width;
                    $game.canvas.height = size.height;
                    //game.world.setBounds(0, 0, size.width, size.height);
                    $game.scale.width = size.width;
                    $game.scale.height = size.height;
                    $game.camera.setSize(size.width, size.height);
                    //game.camera.setBoundsToWorld();
                    // resize debug offscreen canvas
                    if ($game.debug.sprite) {
                        $.game.debug.sprite.removeStageReference();
                    }
                    $game.debug.boot();

                    //(<any>this.game.renderer).resize(size.width, size.height);

                    // Tell ScaleManager that we have changed sizes
                    $game.scale.setSize();
                }).trigger('resize');

                $game.state.start('mainState', false, false);
            }
        };
    });
});
