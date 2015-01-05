angular.module('trains').run(function(requireService) {
    requireService.define(['game.entities.Cell'], 'game.states.playState', {
        compile: function (game) {
            var size = 32,
                cellsX = 10,
                cellsY = 9;

            var cells = []
                ;
            var state = {
                preload: function () {
                    console.log('preload');
                    game.load.image('hex', 'game/game/assets/hex.png');
                },
                create: function () {
                    console.log('create');
                    game.stage.backgroundColor = 0xffffff;
                    var Cell = requireService.require('game.entities.Cell');
                    console.log(Cell);
                    console.log(new Cell(1,2,null));

                    for (var X = 0; X <= cellsX; ++X) {
                        cells[X] = [];
                        for (var Y = 0; Y <= cellsY; ++Y) {
                            cells[X][Y]  = generateHex(X, Y);

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

            /*
             * Texture:
             */
            var hexGraphics = new PIXI.Graphics();
            //hexGraphics.beginFill(0x333333,.5);
            hexGraphics.lineStyle(.5, 0x0, 1);

            for(var i=0;i<=7;++i) {
                var angle = 2*Math.PI/6*i;
                var position = {};
                position.x = size * .5 + size * Math.cos(angle);
                position.y = size * .5 + size * Math.sin(angle);
                if (i == 0)
                    hexGraphics.moveTo(position.x, position.y);
                else
                    hexGraphics.lineTo(position.x, position.y);
            }
            var hexTexture = hexGraphics.generateTexture();

            /*
             * Hex
             */
            function generateHex(X, Y) {
                var yd = (Math.cos(Math.PI/6) * size);
                var x =  -size * .0 + (X * size / 2 * 3);
                var y =  Y * yd * 2  + (X % 2) * yd;
                var sprite = game.add.sprite(x, y, hexTexture, true);
                sprite.inputEnabled = true;
                sprite.input.useHandCursor = true;
                sprite.anchor.set(.5);
                sprite.events.onInputOver.add(over, this);
                sprite.events.onInputOut.add(out, this);
                sprite.alpha = .1;
            }

            function over (sprite, pointer) {
                //console.log('over', pointer, sprite);
                sprite.alpha = 1.0;




                //console.log('over', pointer, sprite);
                if (sprite.mouseOverTween) {
                    sprite.mouseOverTween.stop();
                }
                sprite.mouseOverTween = game.add.tween(sprite.scale)
                    .from({x: 1, y: 1})
                    .to({x: 1.2, y: 1.2}, 1000)
                    .start();

                //sprite.scale.set(1.2);
            }

            function out (sprite, pointer) {
                //console.log('out', pointer, sprite);
                sprite.alpha = .5;

                if (sprite.mouseOverTween) {
                    sprite.mouseOverTween.stop();
                }
                sprite.mouseOverTween = game.add.tween(sprite.scale)
                    .from({x: 1.2, y: 1.2})
                    .to({x: 1, y: 1}, 1000)
                    .start();

                //sprite.scale.set(1);
            }

            return state;
        }
    });


    //function generateGrid(width, height) {
    //    var grid = new createjs.Shape();
    //    var shapeHex = drawHex(0,0);
    //    grid.addChild(shapeHex);
    //}

    //function makeHex)
});
