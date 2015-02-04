angular.module('game').factory('gameService', function($window, UIService, requireService) {
    return {
        createGame: function($app, $data) {
            this.game = new Phaser.Game($data.width, $data.height, Phaser.CANVAS, 'canvas-wrapper');
            var $game = this.game;
            // constants
            $game.c = {
                CELL_SIZE: 64
                ,mode: {
                    RAILWAY: 'input.mode.railway'
                }
            };
            $game.RAILMAP = new (requireService.require('game.services.Railmap', {game: $game}))();
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
            window.drawCircle = function(x,y,r) {
                $game.add.graphics().beginFill(0xFF0000).drawCircle(x,y,r || 5);
            };
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
            var Railway = requireService.require('game.entities.Railway', {game: $game});
            $game.selectionMode = {
                railway: {
                    start: function(cell, pointer) {
                        //$game.selection.start('railway')
                        //    .set(new Railway())
                        new Railway().startDraw(cell);
                        //$game.input.onUp.addOnce(function(pointer){
                        //});
                    }
                }
            };

            $app.$scope.$on('$destroy', function() {
                $game.destroy(); // Clean up the this.gamewhen we leave this scope
            });

            $window.game = $game;
            $window.gm = $game.gm;

            $game.ui = UIService;

            $game.state.add('mainState', $app.requireService.require('game.states.mainState', {game: $game}));
            $game.state.start('mainState');

            return $game;
        }
    };
});
