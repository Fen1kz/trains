angular.module('trains').run(function(requireService) {
    console.log('define call');
    requireService.define('game.entities.Cell', {
        compile: function (game) {
            function Cell (X, Y, sprite) {
                this.X = X;
                this.Y = Y;
                this.sprite = sprite;
            }
        }
    });
});
