
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


