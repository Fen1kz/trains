angular.module('trains').run(function(requireService) {
    requireService.define('game.entities.Cell', function (data) {
        var $game = data.game,
            state = data.state;

        var
        ALPHA_MIN = 0.1,
            //ALPHA_MIN = .5,
            ALPHA_MAX = 1,
            HEX_SCALE_MIN = 1.0,
            HEX_SCALE_MAX = 1.0
            ;

        var CellData = (function () {
            var points = [];
            for (var i = 0; i <= 6; ++i) {
                var angle = 2 * Math.PI / 6 * i;
                points.push(new PIXI.Point(
                    //size * 0.5 + size * Math.cos(angle),
                    //size * 0.5 + size * Math.sin(angle)
                    Math.round($game.e.cells.SIZE * 0.5 * Math.cos(angle)),
                    Math.round($game.e.cells.SIZE * 0.5 * Math.sin(angle))
                ));
            }
            var hexPolygon = new PIXI.Polygon(points);

            var hexOverlay = new Phaser.Graphics();
            hexOverlay.lineStyle(1);
            hexOverlay.drawShape(hexPolygon);

            var hexMask = new Phaser.Graphics();
            hexMask.beginFill(0x0);
            //hexMask.drawCircle(0,0,50);
            hexMask.drawShape(hexPolygon);

            var hexMaskImage = $game.make.image(0, 0, hexMask.generateTexture(1,1));

            var adjustedHexMaskImageBounds = hexMaskImage.getBounds().clone();
            adjustedHexMaskImageBounds.y = Math.ceil(($game.e.cells.SIZE - adjustedHexMaskImageBounds.height) * 0.5);

            var hexTexture = $game.make.bitmapData($game.e.cells.SIZE, $game.e.cells.SIZE);
            hexTexture.alphaMask($game.cache.getImage('hex'), hexMaskImage, null, adjustedHexMaskImageBounds);
            //hexTexture.draw(hexMaskImage, 0, size * 0.07); // magic _/ since HexMaskImage is not 64x64

            return {
                hexPolygon: hexPolygon,
                hexTexture: hexTexture,
                hexOverlay: hexOverlay.generateTexture()
            };
        }());

        var Railmap = {
            'nw-se': 0,
            'ne-sw': 1,
            '-': 2,
            'nw':4,
            'ne':5,
            'se':6,
            'sw':7,
            'nw-ne': 8,
            'ne-se': 9,
            'se-sw': 10,
            'sw-nw': 11
        };

        var Cell = function (cells, X, Y) {
            var $this = this;

            this.game = $game;
            this.cells = cells;
            this.X = X;
            this.Y = Y;

            this.x =  (X * cells.SIZE * 0.25 * 3);
            this.y =  Y * cells.hexAltDistance * 2  + (X % 2) * cells.hexAltDistance;

            //this.background = game.make.sprite(x + X*50, y + Y*50, CellData.hexTexture, true);
            //this.overlay = game.make.sprite(x + X*50, y + Y*50, CellData.hexOverlay, true);
            this.background = $game.make.sprite(this.x, this.y, CellData.hexTexture, true);
            cells.groupBackground.add(this.background);
            this.overlay = $game.make.sprite(this.x, this.y, CellData.hexOverlay, true);
            cells.groupOverlay.add(this.overlay);

            this.background.anchor.set(0.5);
            this.overlay.anchor.set(0.5);

            this.background.alpha = 0.5;
            this.overlay.alpha = ALPHA_MIN;

            this.background.cell = this;
            this.overlay.cell = this;


            this.overlay.inputEnabled = true;
            this.overlay.hitArea = CellData.hexPolygon;
            this.overlay.input.useHandCursor = true;

            //this.overlay.events.onInputDown.add(function(sprite, pointer){
            //    var c = this.game.e.cells.getByxy(pointer.x, pointer.y);
            //    console.log(c.X, c.Y, this.X, this.Y, c.X === this.X && this.Y === c.Y);
            //}, this);
            this.overlay.events.onInputOver.add(mouseOver, this);
            this.overlay.events.onInputOut.add(mouseOut, this);
            this.overlay.events.onInputDown.add(mouseDown, this);

            //$('canvas').on('mouseout', function() {
            //    mouseOut.call($this);
            //})
        };

        Cell.prototype.addRail = function (frame) {
            if (this.rail !== undefined) {
                this.rail.destroy();
            }
            if (typeof frame === 'string') frame = Railmap[frame];
            if (frame === void 0) frame = Railmap['-'];
            this.rail = $game.add.sprite(this.x, this.y, 'rails', frame);
            this.rail.anchor.set(0.5);
        };
        Cell.prototype.get = function (x, y) {
            return this.cells.cell(this.X + x, this.Y + y);
        };
        Cell.prototype.getNW = function () {
            return this.get(-1, (this.X % 2) ? 0 : -1);
        };
        Cell.prototype.getN = function () {
            return this.get(0, -1);
        };
        Cell.prototype.getNE = function () {
            return this.get(+1, (this.X % 2) ? 0 : -1);
        };
        Cell.prototype.getSE = function () {
            return this.get(+1, (this.X % 2) ? +1 : 0);
        };
        Cell.prototype.getS = function () {
            return this.get(0, +1);
        };
        Cell.prototype.getSW = function () {
            return this.get(-1, (this.X % 2) ? +1 : 0);
        };

        Cell.prototype.getNear = function () {
            return {
                'nw': this.getNW(),
                'n' : this.getN(),
                'ne': this.getNE(),
                'se': this.getSE(),
                's' : this.getS(),
                'sw': this.getSW()
            };
            //game.debug.renderSpriteBounds(spriteObjectToHighlight);
        };

        Cell.prototype.mark = function () {
            //game.debug.renderSpriteBounds(spriteObjectToHighlight);
        };

        function mouseDown (sprite, pointer) {
            //console.log('mouseDown', sprite, pointer, this);
            this.background.tint = Math.round(Math.random() * (0xFFFFFF));
            //this.addRail(Math.floor(Math.random()*16));

            this.game.events.onCellMouseDown.dispatch(this, pointer);
        }

        function mouseOver (sprite, pointer) {
            this.overlay.alpha = ALPHA_MAX;
            this.overlay.scale.set(HEX_SCALE_MAX);
        }

        function mouseOut (sprite, pointer) {
            this.overlay.alpha = ALPHA_MIN;
            this.overlay.scale.set(HEX_SCALE_MIN);
        }

        return Cell;
    });
});
