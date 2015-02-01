angular.module('trains').run(function(requireService) {
    requireService.define('game.entities.Railway', function (data) {
        var game = data.game;

        var Railway = function () {
            this.startDraw = function(cell) {
                //cell.addRail();
                var gfx = game.add.graphics();
                //gfx.lineStyle(game.e.cells.SIZE / 5, 0x009900, 0.5);
                gfx.lineStyle(10, 0x009900, 0.5);
                gfx.moveTo(cell.x, cell.y);
                //debugger
                //game.input.onUp
                var moveIndex = game.input.addMoveCallback(function(pointer, x, y) {
                    var previousCell = cell;
                    cell = game.e.cells.getByxy(x, y);
                    if (previousCell.X !== cell.X || previousCell.Y !== cell.Y) {
                        //console.log('cell', cell.X, cell.Y, previousCell.X, previousCell.Y);
                        if (Math.abs(previousCell.X - cell.X) > 1 || Math.abs(previousCell.Y - cell.Y) > 1) {
                            game.input.onUp.dispatch(pointer);
                            return;
                        }
                        gfx.lineTo(cell.x, cell.y);
                    }
                }, this);
                game.input.onUp.addOnce(function(pointer) {
                    //console.log('enough', moveIndex);

                    game.input.deleteMoveCallback(moveIndex);
                });
            };
            //game.mode.start(game.c.RAILWAY)
        };
        var i = 0;
        return Railway;
    });
});
