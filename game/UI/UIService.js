;'use strict';
angular.module('game')
.constant('UI', {
    MODAL: {
        CONFIRM: 'ui.modal.confirm'
    }
})
.factory('UIService', function(UI, GAME) {
    var $game;
    var $canvas;
    var $UI;

    var modals = {};

    function Modal(name, type) {
        this.type = type;
        this.name = name;
        if (modals[name]) throw new Error('MODAL::trying to override modal');
        modals[name] = this;
    }

    var $this = {
        modalOpen: new Phaser.Signal(),
        modalClose: new Phaser.Signal(),
        init: function(game) {
            $game = game;
            $canvas = $(game.canvas);
            $UI = $('#ui');

            $this.modalOpen.add(function(modal) {
                $canvas.on('click.ui', modal.dismiss);
                $canvas.on('touchend.ui', modal.dismiss);
                $game.paused = true;
            });
            $this.modalClose.add(function(popover, data){
                $canvas.off('.ui');
                $game.paused = false;
            });
        },
        confirm: function() {
            var name, data, confirm, cancel;
            switch (arguments.length) {
                case 1:
                    name = arguments[0].name;
                    data = arguments[0].data;
                    confirm = arguments[0].confirm;
                    cancel = arguments[0].cancel;
                    break;
                case 3:
                    data = arguments[0];
                    confirm = arguments[1];
                    cancel = arguments[2];
                    break;
                case 4:
                    name = arguments[0];
                    data = arguments[1];
                    confirm = arguments[2];
                    cancel = arguments[3];
                    break;
            }

            var modal = new Modal(name, UI.MODAL.CONFIRM);

            var popoverData = {
                trigger: 'manual'
                //,container: 'body'
                ,viewport: GAME.CONTAINER_ID
                ,html: true
                ,title: data.text
                ,content: '<button class="confirm btn btn-success"><i class="fa fa-check"></i></button>' +
                          '<button class="cancel btn btn-danger pull-right"><i class="fa fa-times"></i></button>'
                };
            $UI.popover(popoverData).popover('show');
            modal.popover = $UI.data('bs.popover');

            var ts = Date.now();
            modal.dismiss = function(e) {
                if (Date.now() - ts < 100) return;
                if (cancel !== void 0) cancel(modal);
                $this.destroy(name);
            };

            var $tip = modal.popover.$tip;
                $tip.css('left', data.x);
                $tip.css('top', data.y - $tip.height() *.33);
                $tip.find('.confirm').click(function() {
                    if (confirm !== void 0) confirm(modal);
                    $this.destroy(name);
                });
                $tip.find('.cancel').click(modal.dismiss);

            this.modalOpen.dispatch(modal);
        },
        destroy: function(name) {
            var modal = modals[name];
            if (!modal) return;
            switch (modal.type) {
                case UI.MODAL.CONFIRM:
                    modal.popover.destroy();
                    $this.modalClose.dispatch(modal);
                    break;
            }
            delete modals[name];
        }
    };
    return $this;
});
