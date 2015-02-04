angular.module('game')
.controller('UIController', function($scope) {
    $scope.buttons = [
        {name: 'Pan', model: 'pan'}
        ,{name: 'Railway', model: 'railway'}
    ];
    $scope.controllerModel = {
        instrument: 'railway'
    };
});
