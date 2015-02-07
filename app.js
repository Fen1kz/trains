var app = angular.module('trains', [
    'ui.bootstrap'
    ,'ui.utils'
    ,'ui.router'
    ,'ngAnimate'
    ,'game'
    ,'home'
]);

angular.module('trains').config(function($stateProvider, $urlRouterProvider) {
    /* Add New States Above */
    $urlRouterProvider.otherwise('/home');
});

angular.module('trains')
    .run(function($rootScope, $stateParams, $state) {
        $rootScope.safeApply = function(fn) {
            var phase = $rootScope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $rootScope.stateName = $state.current.name;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    })
;
