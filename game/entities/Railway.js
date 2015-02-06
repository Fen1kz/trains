angular.module('trains').run(function(requireService) {
    requireService.define('game.entities.Railway', function (data) {
        var $game = data.game;
        var line = {
            width: $game.c.CELL_SIZE / 5
            ,color: {
                good: 0x009900
                ,bad: 0x990000
            }
            ,alpha: 0.5
        };
        var Path = function(gfx, firstCell) {
            var cellsArray = [];
            var $this = this;
            this.init = function() {
                this.gfx = gfx;
                this.cells = {};
                this.pointsArray = [];
                this.add(firstCell);
            };
            this.get = function(i) {
                return cellsArray[(i >= 0) ? i : this.length + i];
            };
            this.add = function(cell) {
                this.cells[cell.X+':'+cell.Y] = true;
                cellsArray.push(cell);
                this.pointsArray.push(new Phaser.Point(cell.x, cell.y));
                return this;
            };
            this.removeLast = function() {
                this.cells[this.last.X + ':' + this.last.Y] = void 0;
                cellsArray.pop();
                this.pointsArray.pop();
                return this;
            };
            Object.defineProperty(this, 'last', {
                get: function() {return $this.get(-1);}
            });
            Object.defineProperty(this, 'length', {
                get: function() {return cellsArray.length;}
            });
            this.exist = function(cell) {
                return this.cells[cell.X+':'+cell.Y] !== void 0;
            };
            this.drawStart = function() {
                this.gfx.beginFill(0x009900, 0.5);
                this.gfx.drawCircle(this.get(0).x, this.get(0).y, $game.c.CELL_SIZE / 2);
                this.gfx.endFill();
                return this;
            };
            this.redraw = function() {
                this.gfx.clear();
                this.drawStart();
                this.gfx.lineStyle(line.width, line.color.good, line.alpha);
                this.gfx.drawPolygon(this.pointsArray);
                return this;
            };
            this.init();
        };
        var Railway = function () {
            this.Path = Path;
            this.path = null;

            this.onDown = function(cell) {
                this.gfxGroup = $game.add.group();
                this.gfx = $game.add.graphics(0, 0,  this.gfxGroup);
                this.path = new this.Path(this.gfx, cell);
            };

            this.onMove = function(pointer) {
                var currentCell = $game.e.cells.getByxy(pointer.worldX, pointer.worldY);
                if (currentCell !== this.path.last) {
                    var dir = this.path.last.dirToCell(currentCell);
                    if (dir !== null && +dir !== $game.RAILMAP.NORTH && +dir !== $game.RAILMAP.SOUTH) {
                        if (currentCell.sameCell(this.path.get(-2))) {
                            this.path.removeLast(currentCell);
                            this.path.redraw();
                        } else if (!this.path.exist(currentCell)) {
                            this.path.add(currentCell);
                            this.path.redraw();
                        }
                    }
                }
            };

            this.onUp = function() {
                if (this.path.length < 2) {
                    this.destroy();
                    return;
                }
                $game.ui.confirmOnce({
                    x: this.path.last.x
                    ,y: this.path.last.y
                    ,text: 'Build railway?'
                }, function() {
                    var prevCell, cell, nextCell;
                    for (var i = 1; i < this.path.length; i++) {
                        prevCell = this.path.get(i - 1);
                        cell = this.path.get(i);
                        nextCell = this.path.get(i + 1);
                        if (prevCell === void 0) {
                            continue;
                        }
                        if (nextCell === void 0) {
                            continue;
                        }
                        var frame = $game.RAILMAP.frameByDirs(cell.dirToCell(prevCell), cell.dirToCell(nextCell));
                        cell.addRail(frame);
                        //console.log(cell.dirToCell(prevCell), cell.dirToCell(nextCell), frame);
                    }
                    this.destroy();
                }.bind(this), function() {
                    this.destroy();
                }.bind(this));
            };

            this.destroy = function() {
                this.gfxGroup.destroy();
                //$game.ui @TODO DESTROY
            }
        };
        return Railway;
    });
});
