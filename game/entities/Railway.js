angular.module('trains').run(function(requireService) {
    requireService.define('game.entities.Railway', function (data) {
        var Railmap = {
            'nw-se': 0,
            'ne-sw': 1,
            '-': 2,
            'nw':4,
            'ne':5,
            'se':6,
            'sw':7,
            'nw-ne': 8,
            'ne-se': 9,
            'se-sw': 10,
            'sw-nw': 11
        };

        var game = data.game;

        var Railway = function (cell, pointer) {
            //game.mode.start(game.c.RAILWAY)
        };
        var i = 0;
        return Railway;
    });
});
