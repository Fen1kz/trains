angular.module('game')
.constant('GAME', {
    CONTAINER_ID: '#gameCanvas',
    WIDTH: 1600, HEIGHT: 1600,
    CELL_SIZE: 64
})
.directive('gameCanvas', function($window, $rootScope, $injector, GAME, requireService) {
    return {
        restrict: 'E',
        //scope: {
        //    players: '=',
        //    mapId: '='
        //},
        template: '<div id="' + GAME.CONTAINER_ID.slice(1) + '"><div id="ui"></div></div>',
        link: function($scope, $e, attrs) {
            var $game = new Phaser.Game(GAME.WIDTH, GAME.HEIGHT, Phaser.CANVAS, 'gameCanvas');
            requireService.setData({game: $game});

            requireService.require('game.services.GameOjects');

            //$scope.$on('$destroy', function() {
            //    $game.destroy(); // Clean up the this.gamewhen we leave this scope
            //});

            //$scope.$on(
            //    $game.input.onUp
            //);


            $game.state.add('bootState', requireService.require('game.states.bootState'));
            $game.state.add('mainState', requireService.require('game.states.mainState'));

            $game.state.start('bootState');
        }
    }
});

//$game.selection = (function(){
//    return {
//        _selection: {},
//        start: function(type) {
//            if (type === void 0) type = null;
//            this.type = type;
//            this._selection = {};
//            return this;
//        },
//        set: function (name, object, data) {
//            if (arguments.length === 1) {
//                name = '_';
//                object = arguments[0];
//                data = {};
//            } else if (arguments.length === 2) {
//                name = '_';
//                object = arguments[0];
//                data = arguments[1];
//            }
//            data.object = object;
//            this._selection[name] = data;
//            return this;
//        }, get: function (name) {
//            if (arguments.length === 0) {
//                name = '_';
//            }
//            if (!this._selection.hasOwnProperty(name))
//                throw new Error ('cant get ['+name+'] from selection');
//            return this._selection[name];
//        }, map: function ($callback) {
//            for (var key in this._selection) {
//                $callback.call(this._selection[key]);
//            }
//            return this;
//        }, processUpdate: function() {
//            this.map(function(){
//                if (this.hasOwnProperty('update')) {
//                    this.update.call(this);
//                }
//            });
//            return this;
//        }, processRender: function() {
//            this.map(function(){
//                if (this.hasOwnProperty('render')) {
//                    this.update.call(this);
//                }
//            });
//            return this;
//        }
//    }
//})().start();
