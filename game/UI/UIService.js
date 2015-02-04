angular.module('game').factory('UIService', function() {
    var $game;
    var $canvas;
    var $UI;
    return {
        modalOpen: new Phaser.Signal(),
        modalClose: new Phaser.Signal(),
        init: function(game) {
            $game = game;
            $canvas = $(game.canvas);
            $UI = $('#ui');

            this.modalOpen.add(function(popover, data) {
                var ts = Date.now();
                function cancelStatic() {
                    if (Date.now() - ts > 100) {
                        popover.$tip.find('.cancel').trigger('click');
                    }
                }
                $canvas.on('click.ui', cancelStatic);
                $canvas.on('touchend.ui', cancelStatic);
                game.paused = true;
            });
            this.modalClose.add(function(popover, data){
                $canvas.off('.ui');
                game.paused = false;
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
        },
        confirmOnce: function(data, confirm, cancel) {
            var $this = this;
            //$game.debug.geom(new Phaser.Circle(data.x, data.y, 100), '#f00');
            var popoverData = {
                trigger: 'manual'
                //,container: 'body'
                ,viewport: '#canvas-wrapper'
                ,html: true
                ,title: data.text
                ,content: '<button class="confirm btn btn-success"><i class="fa fa-check"></i></button>' +
                          '<button class="cancel btn btn-danger pull-right"><i class="fa fa-times"></i></button>'
                };
            $UI.popover(popoverData).popover('show');
            var popover = $UI.data('bs.popover');
            var $tip = popover.$tip;
            $tip
                .css('left', data.x)
                .css('top', data.y - $tip.height() *.33);

            $tip.find('.confirm').click(function() {
                if (confirm !== undefined) {
                    confirm(popover);
                }
                popover.destroy();
                $this.modalClose.dispatch(popover, data);
            });
            $tip.find('.cancel').click(function() {
                if (cancel !== undefined) {
                    cancel(popover);
                }
                popover.destroy();
                $this.modalClose.dispatch(popover, data);
            });
            this.modalOpen.dispatch(popover);
        }
    };
});
