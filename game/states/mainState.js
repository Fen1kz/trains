angular.module('trains').run(function($window, requireService) {
    requireService.define(['game.entities.Cell'], 'game.states.mainState', function (data) {
        var game = data.game;
        var createCallback = data.createCallback;

        var hexAltDistance = (Math.cos(Math.PI / 6) * game.c.CELL_SIZE * 0.5);

        var cellsX = Math.ceil(game.c.WORLD_WIDTH / (game.c.CELL_SIZE / 2 * 1.5)),
            cellsY = Math.ceil(game.c.WORLD_HEIGHT / (hexAltDistance * 2));
        console.log(cellsX, cellsY);
        game.e.cells = (function(){
            var hexAltDistance = (Math.cos(Math.PI / 6) * game.c.CELL_SIZE * 0.5);
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
                    var rawX = 1 + (x - game.c.CELL_SIZE * .25) / (game.c.CELL_SIZE * .75);
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
                game.load.image('hex', 'game/assets/hex.png');
                game.load.image('c', 'game/assets/circle.png');
                game.load.spritesheet('rails', 'game/assets/tiles/rails3.png', 64, 64);
            },
            create: function () {
                console.log('create ps');
                game.stage.backgroundColor = 0xffffff;
                game.ui.init(game);
                createEvents.call(this);

                game.world.setBounds(0, 0, game.c.WORLD_WIDTH, game.c.WORLD_HEIGHT);
                game.camera.x = game.world._width / 2;
                game.camera.y = game.world._height / 2;
                game.input.onDown.add(function(pointer) {
                    var start = Phaser.Point.parse(pointer, 'worldX', 'worldY');
                    var move = game.input.addMoveCallback(function(pointer, x, y) {
                        game.camera.x = start.x - x;
                        game.camera.y = start.y - y;
                    });
                    game.input.onUp.addOnce(function(pointer) {
                        //console.log('onup');
                        game.input.deleteMoveCallback(move);
                    });
                });
                createCallback.call(this);

                var Cell = requireService.require('game.entities.Cell', {
                    game: game,
                    state: this
                });

                game.e.cells.groupBackground = game.add.group();
                game.e.cells.groupOverlay = game.add.group();
                for (var X = 0; X <= cellsX; ++X) {
                    for (var Y = 0; Y <= cellsY; ++Y) {
                        game.e.cells.addCell(new Cell(game.e.cells, X, Y));
                    }
                }

                quickdebug = game.add.group();
                game.e.cells._cells.forEach(function(cell) {
                    game.add.text(cell.x - game.c.CELL_SIZE *.3, cell.y
                        ,(cell.X + ':' + cell.Y).toString()
                        ,{font: 'normal 10px Arial'}
                        , quickdebug
                    );
                });
            },
            update: function () {
                //console.log('update');
            },
            render: function () {
                //game.e.cells.cell(5, 5).background.tint = Math.round(Math.random() * (0xFFFFFF));
                //console.log(Math.random * (0xFFFFFF));
                //console.log('render');
                //game.debug.text('render',200,200)
                //game.e.cells.cell(5, 5).background.tint = 0xFF0000;


                //game.debug.spriteBounds(game.e.cells.cell(4, 4).background, "#F00", false);
                //game.debug.spriteInfo(game.e.cells.cell(4, 4).background, 200,200, "#F00");
                quickdebug.visible = !$window.gm._xy;
            }
        };
    });

    function createEvents () {
        this.game.events = {};
        this.game.events.onCellMouseDown = new Phaser.Signal();
        this.game.events.onCellMouseOver = new Phaser.Signal();

        this.game.events.onCellMouseDown.add(handleCellMouseDown, this);
    }

    function handleCellMouseDown (cell, pointer) {
        this.game.selectionMode.railway.start(cell, pointer);
    }
});
