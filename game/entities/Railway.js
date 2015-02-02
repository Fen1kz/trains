angular.module('trains').run(function(requireService) {
    requireService.define('game.entities.Railway', function (data) {
        var game = data.game;

        var Railway = function () {
            this.cells = {};
            this.path = [];
            this.previousValidCell = null;
            this.startDraw = function(cell) {
                var $this = this;
                var line = {
                    width: game.e.cells.SIZE / 5
                    ,color: {
                        good: 0x009900
                        ,bad: 0x990000
                    }
                    ,alpha: 0.5
                };
                var gfx = game.add.graphics();
                gfx.beginFill(0x009900, 0.5);
                gfx.drawCircle(cell.x, cell.y, game.e.cells.SIZE / 2);
                gfx.endFill();
                gfx.moveTo(cell.x, cell.y);
                gfx.lineStyle(line.width, line.color.good, line.alpha);

                var previousValidCell = cell;
                this.cells[cell.X+':'+cell.Y] = true;
                this.path.push(cell);

                var moveIndex = game.input.addMoveCallback(function(pointer, x, y) {
                    var currentCell = game.e.cells.getByxy(x, y);
                    var dir = previousValidCell.dirToCell(currentCell);
                    if (previousValidCell.nearCell(currentCell)
                        && dir !== 'n' && dir !== 's'
                        && this.cells[currentCell.X+':'+currentCell.Y] === void 0
                    ) {
                        previousValidCell = currentCell;
                        this.cells[currentCell.X+':'+currentCell.Y] = true;
                        this.path.push(currentCell);

                        gfx.lineStyle(line.width, line.color.good, line.alpha);
                        gfx.lineTo(currentCell.x, currentCell.y);
                    }
                }, this);
                game.input.onUp.addOnce(function(pointer) {
                    game.input.deleteMoveCallback(moveIndex);
                    game.ui.confirmOnce({
                        x: previousValidCell.x
                        ,y: previousValidCell.y
                        ,text: 'Build railway?'
                    }, (function() {
                        //gfx.destroy();
                        var prevCell;
                        var cell = this.path[0];
                        cell.addRail('-');
                        for (var i = 1; i < this.path.length; i++) {
                            prevCell = this.path[i-1];
                            cell = this.path[i];
                            //console.log()cell.dirToCell(prevCell)
                        }
                    }).bind(this), (function() {
                        gfx.destroy();
                    }).bind(this));
                }, this);
            };
            //game.mode.start(game.c.RAILWAY)
        };
        var i = 0;
        return Railway;
    });
});
