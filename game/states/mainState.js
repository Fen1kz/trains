angular.module('trains').run(function($window, requireService) {
    requireService.define(['game.entities.Cell'], 'game.states.mainState', function (data) {
        var game = data.game;
        var cellsX = 16,
            cellsY = 9;

        var cells = {
            _cells: [],
            _cellsXY: [],
            groupBackground: null,
            groupOverlay: null,
            cell:function(X, Y) {
                if (Y === undefined) {
                    return this._cells[X];
                } else {
                    if (this._cellsXY[X] !== undefined && this._cellsXY[X][Y] !== undefined) {
                        return this._cellsXY[X][Y];
                    } else {
                        return null;
                    }
                }
            },
            addCell:function(Cell) {
                this._cells.push(Cell);
                if (!Array.isArray(this._cellsXY[Cell.X])) {
                    this._cellsXY[Cell.X] = [];
                }
                this._cellsXY[Cell.X][Cell.Y] = Cell;
            }
        };
        game.e.cells = cells;

        return {
            preload: function () {
                console.log('preload ps');
                game.load.image('hex', 'game/assets/hex.png');
                game.load.image('c', 'game/assets/circle.png');
                game.load.spritesheet('rails', 'game/assets/tiles/rails3.png', 64, 64);
            },
            create: function () {
                console.log('create ps');
                game.stage.backgroundColor = 0xffffff;

                var Cell = requireService.require('game.entities.Cell', {
                    game: game,
                    state: this
                });

                cells.groupBackground = game.add.group();
                cells.groupOverlay = game.add.group();
                for (var X = 0; X <= cellsX; ++X) {
                    for (var Y = 0; Y <= cellsY; ++Y) {
                        game.e.cells.addCell(new Cell(game.e.cells, X, Y));
                    }
                }

                createEvents.call(this);

                window.gm.xy; // jshint ignore:line
            },
            update: function () {
                //console.log('update');
            },
            render: function () {
                game.e.cells.cell(5, 5).background.tint = Math.round(Math.random() * (0xFFFFFF));
                //console.log(Math.random * (0xFFFFFF));
                //console.log('render');
                //game.debug.text('render',200,200)
                game.e.cells.cell(5, 5).background.tint = 0xFF0000;


                game.debug.spriteBounds(game.e.cells.cell(4, 4).background, "#F00", false);
                game.debug.spriteInfo(game.e.cells.cell(4, 4).background, 200,200, "#F00");

                if ($window.gm._xy) {
                    game.e.cells._cells.forEach(function(cell) {
                        game.debug.text((cell.X + ':' + cell.Y).toString(), cell.x - cell.SIZE *.3, cell.y, '#000');
                    });
                }
            }
        };
    });

    function createEvents () {
        if (this.game.events === undefined) {
            this.game.events = {};
        }
        this.game.events.onCellMouseDown = new Phaser.Signal();
        this.game.events.onCellMouseOver = new Phaser.Signal();

        this.game.events.onCellMouseDown.add(handleCellMouseDown, this);
    }

    function handleCellMouseDown (cell, pointer) {

    }
});
