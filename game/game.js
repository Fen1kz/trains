angular.module('game').factory('gameService', function($window) {
    function addGameServices() {
        // constants
        this.game.c = {
            mode: {
                RAILWAY: 'input.mode.railway'
            }
        };
        // entities
        this.game.e = {};
        // this.gamemanagement
        this.game.gm = {
            _xy: false
            ,get xy () {
                return this._xy = !this._xy;
            }
            ,_mark: false
            ,get mark () {
                return this._xy = !this._xy;
            }
        };
    }

    return {
        game: undefined,
        createGame: function($app, $data) {
            var game = new Phaser.Game($data.width, $data.height, Phaser.CANVAS, 'canvas-wrapper');
            this.game = game;
            addGameServices.call(this);

            $app.$scope.$on('$destroy', function() {
                game.destroy(); // Clean up the this.gamewhen we leave this scope
            });

            $window.game = game;
            $window.gm = game.gm;

            game.state.add('mainState', $app.requireService.require('game.states.mainState', {game: game}));
            game.state.start('mainState');
        }
    };
});
