angular.module('game')
.controller('UIController', function($rootScope, $scope, $window) {
    $scope.buttons = [{
        name: 'Pan',
        model: 'mode.camera.pan',
        hotkey: 49
    } ,{
        name: 'Railway',
        model: 'mode.draw.railway',
        hotkey: 50
    }];

    var $watchSource;
    $scope.controllerModel = {
        instrument: 'mode.draw.railway'
    };

    $scope.$on('game.mode.start', function(e, data) {
        $watchSource = 'event';
        $scope.$apply(function() {
            $scope.controllerModel.instrument = data.name;
        });
        $watchSource = void 0;
    });

    $scope.$watch('controllerModel', function(model, oldModel) {
        if ($watchSource === void 0 && model !== oldModel) {
            $rootScope.$broadcast('ui.controller.mode', {
                name: model.instrument,
                model: model
            });
        } else {
        }
    }, true);

    //@TODO proper hotkeys
    $window.onkeyup = function(event) {
        $('button[hotkey="'+event.keyCode+'"]').trigger('click');
    }
});
