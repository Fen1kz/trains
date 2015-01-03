angular.module('home', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('home').config(function ($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'home/home.html'
            //,controller:'MyCtrl1'
        });
});

