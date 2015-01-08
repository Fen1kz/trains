window.createGame = function($app, $data) {
    // Build the game object
    //var height  = parseInt(ele.css('height'), 10),
    //    width   = parseInt(ele.css('width'), 10);
    var width = 500, height = 500;
    var game = new Phaser.Game(width, height, Phaser.CANVAS, 'canvas-wrapper');

    game.state.add('playState', $app.requireService.require('game.states.playState', {game: game}));
    game.state.start('playState');

    $app.$scope.$on('$destroy', function() {
        game.destroy(); // Clean up the game when we leave this scope
    });


};
