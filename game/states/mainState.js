angular.module('game').run(function ($window, GAME, requireService) {
    requireService.define(['game.controller', 'game.entities.Cell'], 'game.states.mainState', function (data) {
        var $game = data.game;

        var hexAltDistance = (Math.cos(Math.PI / 6) * $game.c.CELL_SIZE * 0.5);

        var cellsX = Math.ceil($game.c.WORLD_WIDTH / ($game.c.CELL_SIZE / 2 * 1.5)),
            cellsY = Math.ceil($game.c.WORLD_HEIGHT / (hexAltDistance * 2));
        console.log(cellsX, cellsY);
        $game.e.cells = (function () {
            var hexAltDistance = (Math.cos(Math.PI / 6) * $game.c.CELL_SIZE * 0.5);
            return {
                hexAltDistance: hexAltDistance,
                _cells: [],
                _cellsXY: [],
                groupBackground: null,
                groupOverlay: null,
                cell: function (X, Y) {
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
                addCell: function (Cell) {
                    this._cells.push(Cell);
                    if (!Array.isArray(this._cellsXY[Cell.X])) {
                        this._cellsXY[Cell.X] = [];
                    }
                    this._cellsXY[Cell.X][Cell.Y] = Cell;
                },
                getByxy: function (x, y) {
                    //console.log('----- starting byxy -----')
                    var rawX = 1 + (x - $game.c.CELL_SIZE * .25) / ($game.c.CELL_SIZE * .75);
                    var X = Math.floor(rawX);
                    var rawY = (X % 2 ? y : y + hexAltDistance) / (hexAltDistance * 2);
                    var Y = Math.floor(rawY);

                    var relX = (rawX % 1);
                    var relY = (rawY % 1);
                    //console.log('raw: ', rawX.toFixed(2), rawY.toFixed(2));
                    //console.log('relative: ', relX.toFixed(2), relY.toFixed(2));
                    if (relX < 0.33) {
                        var coef = Math.tan(Math.PI / 2 - Math.PI / 6);
                        //debugCircle(coef * rawX, rawY);
                        //console.log('risk', +relX.toFixed(2), +relY.toFixed(2), properY);
                        if (relY < .5) {
                            //console.log('test for ', properY);
                            if (.5 - coef * relX > relY) {
                                X--;
                                if (X % 2) Y--;
                                //console.log('CORRECTION');
                            }
                        } else {
                            //console.log('test for ', properY);
                            if (coef * relX < relY - .5) {
                                X--;
                                if (!(X % 2)) Y++;
                                //console.log('CORRECTION');
                            }
                        }
                    }

                    return this.cell(X, Y);
                    //return {X: X, Y: )};
                }
            };
        })();

        var quickdebug;
        return {
            preload: function () {
                console.log('preload ps');
                this.game.load.image('hex', 'game/assets/hex.png');
                this.game.load.image('c', 'game/assets/circle.png');
                this.game.load.spritesheet('rails', 'game/assets/tiles/rails3.png', 64, 64);
            },
            create: function () {
                console.log('create ps');
                var $game = this.game;
                var Cell = requireService.require('game.entities.Cell');
                this.game.e.cells.groupBackground = this.game.add.group();
                this.game.e.cells.groupOverlay = this.game.add.group();
                for (var X = 0; X <= cellsX; ++X) {
                    for (var Y = 0; Y <= cellsY; ++Y) {
                        this.game.e.cells.addCell(new Cell(this.game.e.cells, X, Y));
                    }
                }

                quickdebug = $game.add.group();
                $game.e.cells._cells.forEach(function (cell) {
                    $game.add.text(cell.x - GAME.CELL_SIZE * .3, cell.y
                        , (cell.X + ':' + cell.Y).toString()
                        , {font: 'normal 10px Arial'}
                        , quickdebug
                    );
                });

                $game.controller.start('mode.camera.pan');
            },
            update: function () {
                //console.log('update');
            },
            render: function () {
                //this.game.e.cells.cell(5, 5).background.tint = Math.round(Math.random() * (0xFFFFFF));
                //console.log(Math.random * (0xFFFFFF));
                //console.log('render');
                //this.game.debug.text('render',200,200)
                //this.game.e.cells.cell(5, 5).background.tint = 0xFF0000;


                //this.game.debug.spriteBounds(this.game.e.cells.cell(4, 4).background, "#F00", false);
                //this.game.debug.spriteInfo(this.game.e.cells.cell(4, 4).background, 200,200, "#F00");
                quickdebug.visible = !$window.gm._xy;
            }
        };
    });
});
