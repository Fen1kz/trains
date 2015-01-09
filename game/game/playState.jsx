angular.module('trains').run(function(requireService) {
    requireService.define(['game.entities.Cell'], 'game.states.playState', function (data) {
        var game = data.game;
        var cellsX = 10,
            cellsY = 9;

        var test;

        game.e = {
            cells:{
                _cells: [],
                cell:function(X, Y) {
                    return this._cells[X][Y];
                }
            }
        };
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
                    game.e.cells._cells[X] = [];
                    for (var Y = 0; Y <= cellsY; ++Y) {
                        game.e.cells._cells[X][Y] = new Cell(game.e.cells, X, Y);
                    }
                }

                test = game.add.sprite(300, 300, 'hex');
            },
            update: function () {
                //console.log('update');
            },
            render: function () {
                test.tint = Math.round(Math.random() * (0xFFFFFF));
                game.e.cells.cell(5, 5).sprite.tint = Math.round(Math.random() * (0xFFFFFF));
                //console.log(Math.random * (0xFFFFFF));
                //console.log('render');
                //game.debug.text('render',200,200)
                game.e.cells.cell(5, 5).sprite.tint = 0xFF0000;
                game.debug.spriteBounds(game.e.cells.cell(3, 3).sprite, "#F00", false);
                game.debug.spriteInfo(game.e.cells.cell(3, 3).sprite, 200,200, "#F00");
            }
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
