
authModule.controller('authCtrl', ['$scope', 'authService', 'authMessage', 'AUTH_EVENTS', '$state', 'SETTINGS', 'commonService',// 认证控制器
    function ($scope, authService, authMessage, AUTH_EVENTS, $state, SETTINGS, commonService) {

        $scope.currentUser = {
            username: "",
            password: "",
            data: {},
            resultIsError: false,
            errorText: "",
            hideError: function () {
                this.resultIsError = !this.resultIsError;
            }
        }

        $scope.login = function () {
            commonService.blockUI();
            $scope.currentUser.resultIsError = false;
            authService
                .login($scope.currentUser.username, $scope.currentUser.password)
                .success(function (result, status) {
                    if (result.result == "success") {
                        console.log(result)
                        $scope.currentUser.data = result.detail.user;
                        authMessage.cookie.create($scope.currentUser.data.last_login, $scope.currentUser.data.email,
                            $scope.currentUser.data.id, $scope.currentUser.data.is_staff, $scope.currentUser.data.username,
                            $scope.currentUser.data.is_superuser, $scope.currentUser.data.date_joined);
                        $scope.$broadcast(AUTH_EVENTS.loginSuccess);
                        setTimeout(function () {
                            $state.go('dashboard');
                            commonService.unblockUI();
                        }, 500);
                    } else {
                        commonService.unblockUI();
                        $scope.currentUser.resultIsError = true;
                        $scope.currentUser.errorText = "用户名或者密码不存在";
                    }
                })
                .error(function (result, status) {
                    if (result && result.responseJSON && result.responseJSON.detail.error_code &&
                        result.responseJSON.detail.error_code == "ERR_701") {
                        commonService.unblockUI();
                        $scope.$apply(function() {
                            $scope.currentUser.resultIsError = true;
                            $scope.currentUser.errorText = "用户名或者密码不存在";
                        });
                    }
                });
        };

        $scope.checkUserState = function () {
            commonService.blockUI();
            authService
                .status()
                .success(function (result, status) {
                    commonService.unblockUI();
                    $scope.currentUser.data = result.detail.user;
                    authMessage.cookie.create($scope.currentUser.data.last_login, $scope.currentUser.data.email,
                        $scope.currentUser.data.id, $scope.currentUser.data.is_staff, $scope.currentUser.data.username,
                        $scope.currentUser.data.is_superuser, $scope.currentUser.data.date_joined);
                    $scope.$broadcast(AUTH_EVENTS.loginSuccess);
                })
                .error(function (result, status) {
                    commonService.unblockUI();
                    $state.go('user_login');
                });
        };

        $scope.$on(SETTINGS.alertEventName, function (event, data) {
            $scope.errorTitle = data.title;
            $scope.errorText = data.text;
        });

        $scope.$on(AUTH_EVENTS.resquestSuccess, function() {
            console.log("auth success!!")
        });

        $scope.keyDown = function (event) {
            var keycode = window.event?event.keyCode:event.which;
            if(keycode == 13){
                $scope.login();
            }
        };

        $scope.resetLogin = function () {
            $scope.currentUser.username = "";
            $scope.currentUser.password = "";
        }

        $scope.init = (function () {
            //$scope.checkUserState();
        })();

}]);

