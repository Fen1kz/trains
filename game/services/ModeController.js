;'use strict';
angular.module('game').run(function(requireService, $rootScope) {
    requireService.define('game.controller', function (data) {
        var $game = data.game;
        var debug = !true; // quicker than rewrite true/false every time
        var controller = new function ModeController() {
            var self = this;
            var modes = {};
            var currentModeData = null;
            Object.defineProperty(this, 'mode', {
                get: function() {
                    return currentModeData;
                }
            });
            this.load = function (name, $mode) {
                modes[name] = {
                    Constructor: $mode
                };
            };
            this.start = function(name, source) {
                if (currentModeData !== null){
                    this.stop();
                }
                if (debug) console.log('start.mode:', name);
                if (!modes[name]) throw new Error('ModeController::start: ['+name+'] doesn\'t exist');
                var modeConstructor = modes[name].mode;
                currentModeData = {
                    name: name,
                    mode: new modes[name].Constructor($game),
                    data: modes[name]
                };
                if (source !== 'ui.controller') {
                    $rootScope.$broadcast('game.mode.start', currentModeData);
                }
            };
            this.stop = function() {
                if (debug) console.log('stop.mode:', currentModeData.name);
                $rootScope.$broadcast('game.mode.stop', currentModeData);
                currentModeData.mode.destroy();
                currentModeData = null;
            };
            $rootScope.$on('ui.controller.mode', function(event, data){
                self.start(data.name, 'ui.controller');
            });
        };

        function Mode (game, data) {
            this.game = game;
            this.data = data;
        }

        function ModeDMU (game, data) {
            Mode.apply(this, arguments);
            var self = this;

            this.destroy = function() {
                if (self.onDown) self.onDown.detach();
                self.game.input.deleteMoveCallback(self.onMove);
                if (self.onUp) self.onUp.detach();
            };

            return this;
        }

        //function extend(Child, Parent) {
        //    var F = function() {};
        //    F.prototype = Parent.prototype;
        //    Child.prototype = new F();
        //    Child.prototype.constructor = Child;
        //    Child.superclass = Parent.prototype
        //}

        controller.load('mode.camera.pan', function PanMode(game, data) {
            ModeDMU.apply(this, arguments);
            var self = this;
            var debug = true;

            self.onDown = self.game.input.onDown.add(function (pointer) {
                if (debug) console.log('mode.camera.pan::onDown');
                var start = Phaser.Point.parse(pointer, 'worldX', 'worldY');
                self.onMove = self.game.input.addMoveCallback(function (pointer, x, y) {
                    if (debug) console.log('mode.camera.pan::onMove');
                    self.game.camera.x = start.x - x;
                    self.game.camera.y = start.y - y;
                });
                self.onUp = self.game.input.onUp.addOnce(function (pointer) {
                    if (debug) console.log('mode.camera.pan::onUp');
                    self.game.input.deleteMoveCallback(self.onMove);
                });
            });

            var parentDestroy = this.destroy;
            this.destroy = function() {
                parentDestroy.apply(this);
            }
        });

        var Railway = requireService.require('game.entities.Railway');
        controller.load('mode.draw.railway', function RailwayDrawMode(game, data) {
            ModeDMU.apply(this, arguments);
            var self = this;
            var debug = true;

            var railway = new Railway();
            self.onDown = self.game.events.onCellDown.add(function(cell, pointer){
                if (debug) console.log('mode.draw.railway::onDown');
                railway.onDown(cell);
                self.onMove = game.input.addMoveCallback(function(pointer) {
                    if (debug) console.log('mode.draw.railway::onMove');
                    railway.onMove(pointer);
                }, this);
                self.onUp = self.game.input.onUp.addOnce(function () {
                    if (debug) console.log('mode.draw.railway::onUp');
                    self.game.input.deleteMoveCallback(self.onMove);
                    railway.onUp();
                }, this);
            }, this);

            var parentDestroy = this.destroy;
            this.destroy = function() {
                parentDestroy.apply(this);
                railway.destroy();
            }
        });
        return controller;
    });
});
