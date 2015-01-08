angular.module('trains').run(function(requireService) {
    requireService.define('game.entities.Cell', function (data) {
        var game = data.game;

        var Cell = function (cells, X, Y) {
            var $this = this;
            this.cells = cells;
            this.X = X;
            this.Y = Y;

            this.sprite = generateHex(X, Y);
            this.sprite.cell = this;
            this.sprite.inputEnabled = true;
            this.sprite.input.useHandCursor = true;
            this.sprite.events.onInputOver.add(mouseOver, this);
            this.sprite.events.onInputOut.add(mouseOut, this);
            this.sprite.events.onInputDown.add(mouseDown, this);
            $('canvas').on('mouseout', function() {
                mouseOut.call($this);
            })
        };

        Cell.mark = function () {
            //game.debug.renderSpriteBounds(spriteObjectToHighlight);
        };

        var size = 32;
        /*
         * Texture:
         */
        var hexGraphics = new PIXI.Graphics();
        //hexGraphics.beginFill(0x333333,.5);
        hexGraphics.lineStyle(0.5, 0x0, 1);

        for(var i=0;i<=7;++i) {
            var angle = 2*Math.PI/6*i;
            var position = {};
            position.x = size * 0.5 + size * Math.cos(angle);
            position.y = size * 0.5 + size * Math.sin(angle);
            if (i === 0) {
                hexGraphics.moveTo(position.x, position.y);
            } else {
                hexGraphics.lineTo(position.x, position.y);
            }
        }
        var hexTexture = hexGraphics.generateTexture();

        /*
         * Hex
         */

        var ALPHA_MIN = 0.1;
        var ALPHA_MAX = 0.5;
        var HEX_SCALE_MIN = 1.0;
        var HEX_SCALE_MAX = 1.0;
        function generateHex(X, Y) {
            var yd = (Math.cos(Math.PI/6) * size);
            var x =  -size * 0 + (X * size / 2 * 3);
            var y =  Y * yd * 2  + (X % 2) * yd;
            var sprite = game.add.sprite(x, y, hexTexture, true);
            sprite.anchor.set(0.5);
            sprite.alpha = ALPHA_MIN;
            return sprite;
        }

        function mouseDown (sprite, pointer) {
            console.log('mouseDown', sprite, pointer, this);
            game.debug.text( "This is debug text", 100, 380 );
        }

        function mouseOver (sprite, pointer) {
            this.sprite.alpha = ALPHA_MAX;
            this.sprite.scale.set(HEX_SCALE_MAX);

            //var scaleDiff = (HEX_SCALE_MAX - (!isNaN(sprite.scale.x) ? sprite.scale.x : 1)) * 1000;
            //console.log('mouseOver tween', this.X, this.Y, scaleDiff);
            //console.log(HEX_SCALE_MAX, '-', sprite.scale.x, '*', 1000, '=', scaleDiff);
            //sprite.mouseOverTween = game.add.tween(sprite.scale)
            //    .to({x: HEX_SCALE_MAX, y: HEX_SCALE_MAX}, scaleDiff)
            //    .start();
        }

        function mouseOut (sprite, pointer) {
            this.sprite.alpha = ALPHA_MIN;
            this.sprite.scale.set(HEX_SCALE_MIN);
        }

        return Cell;
    });
});
