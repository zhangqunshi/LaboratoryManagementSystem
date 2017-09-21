
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

staffModule.controller('staffCtrl', ['$scope', 'httpService', '$interval', 'SETTINGS', 'commonService', 'tableItems', '$stateParams', '$state',
    function ($scope, httpService, $interval, SETTINGS, commonService, tableItems, $stateParams, $state) {//代码比较

        //搜索框
        $scope.search = {
            options: [
                {name: "姓名", key: "name"},
                {name: "电话", key: "phone"},
                {name: "分类", key: "category"},
            ],
            name: "姓名",
            key: "name",
            value: "",
            select: function (key, name) {
                this.key = key;
                this.name = name;
            }
        };

        // 查看详情
        $scope.detail = function () {
            $state.go('staff_detail', {"sourcePage": $scope.items.currentPage});
        }

        $scope.refreshContent = function () {
            commonService.blockUI();
            httpService
                .getStaffs($scope.search.key, $scope.search.value, $scope.items.currentPage, $scope.items.itemsPerPage)
                .success(function (result, status) {
                    commonService.unblockUI();

                    var newList = [];
                    result.results.forEach(function (v, i) {
                        newList.push({
                            id: parseInt(i) + 1,
                            isSelected: false,
                            data: v
                        })
                    });

                    $scope.items.generatePages(newList, result.results.count);
                })
                .error(function (result, status) {
                    commonService.unblockUI();
                    console.error(result);
                })
        }

        //列表内容
        $scope.items = Object.create(tableItems.items);
        if (commonService.judgeNumber($stateParams.currentPage)) {
            $scope.items.currentPage = parseInt($stateParams.currentPage);
        }
        $scope.items.refreshContent = $scope.refreshContent;

        $scope.init = function () {
            $scope.refreshContent();
        };

        $scope.init();
    }]);

staffModule.controller('staffDetailCtrl', ['$scope', 'httpService', '$interval', 'SETTINGS', 'commonService', 'tableItems', '$stateParams', '$state',
    function ($scope, httpService, $interval, SETTINGS, commonService, tableItems, $stateParams, $state) {//开始一次代码比较

    }]);





