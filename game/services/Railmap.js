angular.module('trains').run(function(requireService) {
    requireService.define('game.services.Railmap', function (data) {
        var $game = data.game;
        return function() {
            this.init = function() {
                this.NORTH_WEST = 5;
                this.NORTH      = 0;
                this.NORTH_EAST = 1;
                this.SOUTH_EAST = 2;
                this.SOUTH      = 3;
                this.SOUTH_WEST = 4;
                this.ALL = [
                     this.NORTH_WEST
                    ,this.NORTH
                    ,this.NORTH_EAST
                    ,this.SOUTH_EAST
                    ,this.SOUTH
                    ,this.SOUTH_WEST
                ];
                this.FRAMES = {
                    //'nw-se': 0,
                    //'ne-sw': 1,
                    //'-': 2,
                    //'nw':4,
                    //'ne':5,
                    //'se':6,
                    //'sw':7,
                    //'nw-ne': 8,
                    //'ne-se': 9,
                    //'se-sw': 10,
                    //'sw-nw': 11
                    '2-5': 0,
                    '1-4': 1,
                    '-': 2,
                    '5':4,
                    '1':5,
                    '2':6,
                    '4':7,
                    '1-5': 8,
                    '1-2': 9,
                    '2-4': 10,
                    '4-5': 11,
                    '1-2-4': 12,
                    '2-4-5': 13,
                    '1-4-5': 14,
                    '1-2-5': 15
                };
            };
            this.frame = function(frame) {
                if (typeof frame === 'string') return this.FRAMES[frame];
                if (frame === void 0) return this.FRAMES['-'];
            };
            this.frameByDirs = function(dir1, dir2, dir3) {
                if (arguments.length === 0) return '-';
                return Array.prototype.slice.call(arguments).sort().join('-');
            };
            this.init();
        };
    });
});
