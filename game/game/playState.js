angular.module('trains').run(function(requireService) {
    requireService.define(['game.entities.Cell'], 'game.states.playState', function (data) {
        var game = data.game;
        var cellsX = 10,
            cellsY = 9;

        var cells = [];
        var state = {
            preload: function () {
                console.log('preload ps');
                game.load.image('hex', 'game/game/assets/hex.png');
            },
            create: function () {
                console.log('create ps');
                game.stage.backgroundColor = 0xffffff;

                var Cell = requireService.require('game.entities.Cell', {game: game});
                for (var X = 0; X <= cellsX; ++X) {
                    cells[X] = [];
                    for (var Y = 0; Y <= cellsY; ++Y) {
                        cells[X][Y] = new Cell(cells, X, Y);
                    }
                }


            }
            //,
            //update: function () {
            //    console.log('update');
            //},
            //render: function () {
            //    console.log('render');
            //}
        };

        return state;
    });


    //function generateGrid(width, height) {
    //    var grid = new createjs.Shape();
    //    var shapeHex = drawHex(0,0);
    //    grid.addChild(shapeHex);
    //}

    //function makeHex)
});
