angular.module('game').run(function(requireService) {
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
                    Math.round($game.c.CELL_SIZE * 0.5 * Math.cos(angle)),
                    Math.round($game.c.CELL_SIZE * 0.5 * Math.sin(angle))
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
            adjustedHexMaskImageBounds.y = Math.ceil(($game.c.CELL_SIZE - adjustedHexMaskImageBounds.height) * 0.5);

            var hexTexture = $game.make.bitmapData($game.c.CELL_SIZE, $game.c.CELL_SIZE);
            hexTexture.alphaMask($game.cache.getImage('hex'), hexMaskImage, null, adjustedHexMaskImageBounds);
            //hexTexture.draw(hexMaskImage, 0, size * 0.07); // magic _/ since HexMaskImage is not 64x64

            return {
                hexPolygon: hexPolygon,
                hexTexture: hexTexture,
                hexOverlay: hexOverlay.generateTexture()
            };
        }());

        var Cell = function (cells, X, Y) {
            var $this = this;

            this.game = $game;
            this.cells = cells;
            this.X = X;
            this.Y = Y;

            this.x =  (X * this.game.c.CELL_SIZE * 0.25 * 3);
            this.y =  Y * cells.hexAltDistance * 2  + (X % 2) * cells.hexAltDistance;

            //this.background = game.make.sprite(x + X*50, y + Y*50, CellData.hexTexture, true);
            //this.overlay = game.make.sprite(x + X*50, y + Y*50, CellData.hexOverlay, true);
            this.background = this.game.make.sprite(this.x, this.y, CellData.hexTexture, true);
            cells.groupBackground.add(this.background);
            this.overlay = this.game.make.sprite(this.x, this.y, CellData.hexOverlay, true);
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
            //this.overlay.events.onInputDown.add(function(sprite, pointer){
            //    console.log(this.getNear());
            //}, this);
            this.overlay.events.onInputOver.add(function(sprite, pointer) {
                this.overlay.alpha = ALPHA_MAX;
                this.overlay.scale.set(HEX_SCALE_MAX);
                this.game.events.onCellOver.dispatch(this, pointer);
            }, this);

            this.overlay.events.onInputDown.add(function(sprite, pointer) {
                this.game.events.onCellDown.dispatch(this, pointer);
            }, this);

            this.overlay.events.onInputOut.add(this.mouseOut, this);
            //this.game.input.onUp.add(mouseOut, this);
            this.game.onBlur.add(this.mouseOut, this);
        };

        Cell.prototype.mouseOut = function (sprite, pointer) {
            this.overlay.alpha = ALPHA_MIN;
            this.overlay.scale.set(HEX_SCALE_MIN);
        };

        Cell.prototype.get = function (dir) {
            if (arguments.length === 2) {
                return this.cells.cell(this.X + arguments[0], this.Y + arguments[1]);
            }
            switch(arguments[0]) {
                case this.game.RAILMAP.NORTH_WEST :
                case this.game.RAILMAP.NORTH_WEST.toString() :
                    return this.get(-1, (this.X % 2) ? 0 : -1);
                case this.game.RAILMAP.NORTH      :
                case this.game.RAILMAP.NORTH.toString()      :
                    return this.get(0, -1);
                case this.game.RAILMAP.NORTH_EAST :
                case this.game.RAILMAP.NORTH_EAST.toString() :
                    return this.get(+1, (this.X % 2) ? 0 : -1);
                case this.game.RAILMAP.SOUTH_EAST :
                case this.game.RAILMAP.SOUTH_EAST.toString() :
                    return this.get(+1, (this.X % 2) ? +1 : 0);
                case this.game.RAILMAP.SOUTH      :
                case this.game.RAILMAP.SOUTH.toString()      :
                    return this.get(0, +1);
                case this.game.RAILMAP.SOUTH_WEST :
                case this.game.RAILMAP.SOUTH_WEST.toString() :
                    return this.get(-1, (this.X % 2) ? +1 : 0);
                default:
                    return null;
            }
        };
        Cell.prototype.getNear = function (all) {
            var r = {};
            for (var dir in this.game.RAILMAP.ALL) {
                var cell = this.get(dir);
                if (cell || all) r[dir] = cell;
            }
            return r;
        };
        Cell.prototype.getNearArray = function (all) {
            var r = [];
            for (var dir in this.game.RAILMAP.ALL) {
                if (this.get(dir) || all) r.push(this.get(dir));
            }
            return r;
        };
        Cell.prototype.dX = function (cell) {
            return this.X - cell.X;
        };
        Cell.prototype.dY = function (cell) {
            return this.Y - cell.Y;
        };
        Cell.prototype.sameCell = function (cell) {
            return (cell instanceof Cell) && this.X === cell.X && this.Y === cell.Y;
        };
        Cell.prototype.nearCell = function (cell) {
            return (cell instanceof Cell) && this.getNearArray().indexOf(cell) >= 0;
        };
        Cell.prototype.dirToCell = function (cell) {
            var near = this.getNear();
            for (var dir in near) {
                if (cell.sameCell(near[dir])) {
                    return dir;
                }
            }
            return null;
        };
        Cell.prototype.XY = function () {
            return {X: this.X, Y: this.Y};
        };

        Cell.prototype.addRail = function (frame) {
            if (this.rail !== undefined) {
                this.rail.destroy();
            }
            frame = this.game.RAILMAP.frame(frame);
            this.rail = this.game.add.sprite(this.x, this.y, 'rails', frame);
            this.rail.anchor.set(0.5);
        };
        Cell.prototype.mark = function () {
            //game.debug.renderSpriteBounds(spriteObjectToHighlight);
        };

        return Cell;
    });
});
