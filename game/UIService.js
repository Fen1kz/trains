angular.module('game').factory('UIService', function() {
    var $canvas;
    var $UI;
    return {
        init: function(game) {
            $canvas = $(game.canvas);
            $UI = $('#ui');

            $canvas.click(function() {
            });
        },
        popoverOnce: function(name, data) {
            $UI.popover('destroy');
            $UI.popover({
                trigger: 'manual'
                //,container: 'body'
                ,viewport: '#canvas-wrapper'
                ,content: data.content
                }).popover('show');
            var $tip = $UI.data('bs.popover').$tip;
            $tip
                .css('left', data.x + 10)
                .css('top', data.y - $tip.height() / 2 + 10);
        }
    };
});
