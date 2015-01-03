angular.module('trains').run(function(requireService) {
    requireService.define('game.states.playState', {
        compile: function (game) {
            return {
                preload: function () {
                    console.log('preload');
                    game.load.image('hex', 'game/game/assets/hex.png');
                },
                create: function () {
                    console.log('create');
                    game.stage.backgroundColor = 0xffffff;

                    var center = {x:32, y:32},
                        size = 64;

                    var hexGraphics = new PIXI.Graphics();
                    hexGraphics.beginFill(0xFF3300);
                    hexGraphics.lineStyle(10, 0xffd900, 1);

                    for(var i=0;i<=6;++i) {
                        var angle = 2*Math.PI/6*i;
                        var position = {};
                        position.x = center.x + size * Math.cos(angle);
                        position.y = center.y + size * Math.sin(angle);
                        if (i == 0)
                            hexGraphics.moveTo(position.x, position.y);
                        else
                            hexGraphics.lineTo(position.x, position.y);
                    }

                    //
                    //game.add.image(64, 32, 'hex');
                    //
                    game.add.sprite(8, 8, hexGraphics.generateTexture());
                }
                //,
                //update: function () {
                //    console.log('update');
                //},
                //render: function () {
                //    console.log('render');
                //}
            }
        }
    });

    //function generateGrid(width, height) {
    //    var grid = new createjs.Shape();
    //    var shapeHex = drawHex(0,0);
    //    grid.addChild(shapeHex);
    //}


});
