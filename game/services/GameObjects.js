angular.module('game').run(function($window, GAME, requireService, UIService) {
    requireService.define(['game.services.Railmap', 'game.states.mainState', 'game.controller']
        ,'game.services.GameOjects', function (data) {
            var $game = data.game;
            // constants
            $game.c = {
                WORLD_WIDTH: GAME.WIDTH
                ,WORLD_HEIGHT: GAME.HEIGHT
                ,CELL_SIZE: GAME.CELL_SIZE
            };
            $game.RAILMAP = new (requireService.require('game.services.Railmap'))();
            // entities
            $game.e = {};
            // gamemanagement
            $game.gm = {
                _xy: false
                ,get xy () {
                    return this._xy = !this._xy;
                }
                ,_mark: false
                ,get mark () {
                    return this._xy = !this._xy;
                }
            };

            $game.ui = UIService;
            $game.events = {
                onCellDown: new Phaser.Signal(),
                onCellOver: new Phaser.Signal()
            };

            $window.game = $game;
            $window.gm = $game.gm;
    });
});
