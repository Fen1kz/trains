angular.module('trains').run(function($window, requireService) {
    requireService.define(['game.entities.Cell'], 'game.states.mainState', function (data) {
        var game = data.game;
        var cellsX = 16,
            cellsY = 9;

        game.e.cells = (function(){
            var size = 64;
            var hexAltDistance = (Math.cos(Math.PI / 6) * size * 0.5);
            return {
                SIZE: size,
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
                    var rawX = 1 + (x - this.SIZE * .25) / (this.SIZE * .75);
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

                    return this._cellsXY[X][Y];
                    //return {X: X, Y: )};
                }
            };
        })();

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

                game.e.cells.groupBackground = game.add.group();
                game.e.cells.groupOverlay = game.add.group();
                for (var X = 0; X <= cellsX; ++X) {
                    for (var Y = 0; Y <= cellsY; ++Y) {
                        game.e.cells.addCell(new Cell(game.e.cells, X, Y));
                    }
                }

                createEvents.call(this);

                //var px = 0
                //var gfx = game.add.graphics();
                //gfx.lineStyle(3, 0x009900)
                //
                //this.SIZE = game.e.cells.SIZE;
                //var yd = (Math.cos(Math.PI/6) * this.SIZE * 0.5);
                //
                //for(var i = 10; i >= 0; --i) {
                //    var x = - this.SIZE * .5 + i * this.SIZE * 0.75;
                //    gfx.moveTo(x, 0);
                //    gfx.lineTo(x, 600);
                //    for(var j = 10; j >= 0; --j) {
                //        var y = j * yd * 2;
                //        if (!(i % 2)) y -= yd;
                //        gfx.moveTo(px, y);
                //        gfx.lineTo(x, y);
                //    }
                //    px = x;
                //}

                game.ui.init(game);
                console.log(game);
                var onDown = game.input.onDown.add(function(pointer, event){
                    game.ui.popoverOnce('test', {
                        content: 'testtest'
                        ,x: pointer.x
                        ,y: pointer.y
                    });
                    onDown._signal.halt();
                    event.stopPropagation();
                    console.log(event);
                });
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
                        game.debug.text((cell.X + ':' + cell.Y).toString(), cell.x - game.e.cells.SIZE *.3, cell.y, '#000');
                    });
                }
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
