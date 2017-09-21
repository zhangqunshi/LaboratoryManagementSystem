
navigatorModule.directive('patternflyNavbar',  ["authMessage", "AUTH_EVENTS", "authService", function (authMessage, AUTH_EVENTS, authService) {
    return {
        restrict: "E",
        templateUrl: 'tpls/navigator/main-navigator.html',
        replace: true,

        controller: ['$scope', '$state', function ($scope, $state) {

            $scope.jumpToPage = function (state) {
                $state.go(state);
            }

            $scope.logout = function () {
                authService
                    .logout()
                    .success(function (result, status) {
                        $scope.currentUser.data = {}
                        authMessage.cookie.destroy();
                        setTimeout(function () {
                            $state.go('user_login');
                        },300);
                    })
                    .error(function (result, status) {
                        console.log(status);
                    });
            }
        }]
    }
}]);

publicModule.directive('publicAlert', ['commonService', function (commonService) {
    return {
        restrict: "E",
        templateUrl: 'tpls/public/public-alert.html',
        replace: true,

        controller: ['$scope', '$state', function ($scope, $state) {
        }],
        compile: function(element, attributes) {
            return {
                pre: function preLink(scope, element, attributes) {
                    console.log(element);
                },
                post: function postLink(scope, element, attributes) {
                    console.log(element);
                }
            };
        }
    }
}]);

// 分页功能
// 用法： <public-pagination items="somelist.items"></public-pagination>
publicModule.directive('publicPagination', function() {
    return {
        replace: true,
        scope: {
            items: '='
        },
        templateUrl: 'tpls/public/public-pagination-nowrap.html'
    }
});