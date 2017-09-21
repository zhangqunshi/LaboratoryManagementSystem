var mainApp = angular.module('mainApp', [
    'ui.grid',
    'ui.router',
    'patternfly',
    'PublicModule',
    'AuthModule',
    'NavigatorModule',
    'StaffModule',
    'SeatModule',
]);

mainApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

mainApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/staff/list');
    $stateProvider
        .state('staff_list', {
            url: '/staff/list?currentPage',
            templateUrl: 'tpls/staff/staff-list.html',
            params: {"currentPage": ""}
        })
        .state('seat_list', {
            url: '/seat/list?currentPage',
            templateUrl: 'tpls/seat/seat-list.html',
            params: {"currentPage": ""}
        });
})

