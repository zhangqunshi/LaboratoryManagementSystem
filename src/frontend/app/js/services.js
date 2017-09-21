publicModule.constant("SETTINGS", {
    backendAddress: "/api",
    headers: {
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        accept: "*/*"
    },
    event: {
        alert: "alert-info"
    },
    fileMaxVersionDefault: 10,
    errorCode: {
        ERR_S000: {
            msg: "System Internal Error",
            text: "系统内部错误",
            title: "错误消息"
        },
        ERR_S004: {
            msg: "Invalid request parameters",
            text: "无效的请求参数",
            title: "错误消息"
        },
        ERR_S406: {
            msg: "Username already exist!",
            text: "用户名已存在",
            title: "系统错误"
        },
    }
});

publicModule.factory("translatorService", function () {
    return {
        msg: {
            warning_type: {
                'create': "新建",
                'delete': "删除",
                'modify': "修改",
                "新建": 'create',
                "删除": 'delete',
                "修改": 'modify'
            }
        },
        translate: function (key, type) {
            if (key == "")  return "";
            if (this.msg[type].hasOwnProperty(key))   return this.msg[type][key];
            else    return "other";
        }
    }
});

// 通用方法
publicModule.factory("commonService", ["SETTINGS", function (SETTINGS) {
    return {
        judgeNumber: function (msg) {
            return  !isNaN(parseInt(msg))
        },
        alert: function (title, text, scope, time) {
            scope.$emit(SETTINGS.alertEventName, {title: title, text: text});
            $("#fvms-modal-alert").modal("show");
            setTimeout(function () {
                $("#fvms-modal-alert").modal("hide");
            }, time ? time:3000);
        },
        blockUI: function (msg) {
            if (msg) {
                level = "";
                if (msg.length <= 5) {
                    level = "h1";
                } else if (msg.length <= 10) {
                    level = "h2";
                } else {
                    level = "h3";
                }
                $.blockUI({
                    message: '<'+level+' style="margin: 15px 0px"><span class="spinner spinner-sm spinner-inline"></span>'+msg+'</'+level+'>',
                });
            } else {
                $.blockUI({
                    message: '<h1 style="margin: 15px 0px"><span class="spinner spinner-sm spinner-inline"></span>请等待...</h1>',
                });
            }
        },
        unblockUI: function () {
            $.unblockUI();
        }
    }
}])

// 分页控制
publicModule.service('tableItems', function () {
    this.items = {
        refreshContent: function () {},
        //settings
        itemsPerPage: 10, //每页的条目数

        //status
        originList: [],
        content: [],
        rangeList: [],
        currentPage: 1,
        rangeOfPages: 0,
        totalPage: 0,
        totalNum: 0,
        begin: 0,
        end: 0,

        refreshContent: function () {

        },
        checkRange: function (o) {
            if (this.currentPage === undefined) return;
            if (typeof (this.currentPage) != 'number')  this.currentPage = 1;
            if (this.currentPage > this.totalPage)  this.currentPage = this.totalPage;
            if (this.currentPage < 1)   this.currentPage = 1;
            this.refreshContent();
        },
        generatePages: function (newList, totalNum) {
            this.content = newList;
            this.totalNum = totalNum;
            var pageCount = Math.floor((totalNum + this.itemsPerPage - 1) / this.itemsPerPage);
            this.totalPage = pageCount;
        },
        clear: function () {
            this.content.length = 0;
        },
        prevPage: function () {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.refreshContent();
            }
        },
        nextPage: function () {
            if (this.currentPage < this.totalPage) {
                this.currentPage++;
                this.refreshContent();
            }
        },
        endPage: function () {
            if (this.currentPage < this.totalPage) {
                this.currentPage = this.totalPage;
                this.refreshContent();
            }
        },
        beginPage: function () {
            this.currentPage = 1;
            this.refreshContent();
        },
        jumpToPage: function (targetPage) {
            // console.log("jump to page " + targetPage);
            this.currentPage = targetPage;
            this.refreshContent();
        },

        selectAll: function (e) {
            var list = this.content;

            var i;
            for (i in list) {
                list[i].isSelected = e.target.checked;
            }
        },
        lineSortBy: function (keyWord) {
            var list = this.content;

            var order = list[0].data[keyWord].localeCompare(list[list.length - 1].data[keyWord]);
            if (order == 1) {
                list.sort(function (a, b) {
                    return a.data[keyWord].localeCompare(b.data[keyWord]);
                })
            }
            else {
                list.sort(function (a, b) {
                    return b.data[keyWord].localeCompare(a.data[keyWord]);
                })
            }
        },
        // 获取当前页从第几条到第几条
        getCurrent: function() {
            if (this.totalNum <= 0) {
                return "0-0";
            }
            var firstNum = (this.currentPage - 1) * this.itemsPerPage + 1;
            var lastNum = this.currentPage * this.itemsPerPage;
            if (lastNum > this.totalNum) {
                lastNum = this.totalNum;
            }
            return firstNum + "-" + lastNum;
        },
    };
});

// http请求
publicModule
    .config(["$httpProvider", "SETTINGS", function ($httpProvider, SETTINGS) {
        //更改 Content-Type
        $httpProvider.defaults.headers.post["Content-Type"] = SETTINGS.headers.contentType;
        $httpProvider.defaults.headers.post["Accept"] = SETTINGS.headers.accept;
        $httpProvider.defaults.transformRequest = function (data) {
            //把JSON数据转换成字符串形式
            if (data !== undefined) {
                return $.param(data);
            } else {
                return data;
            }
        };
    }])
    .factory("httpService", ["$http", "SETTINGS", function ($http, SETTINGS) {
        return {
            settings: {
                backendAddress: SETTINGS.backendAddress
            },

            // ---------------- staff ---------------------
            getStaffs: function (searchKey, searchValue, pageNumber, pageSize) {
                var args = {
                    sk: searchKey,
                    sv: searchValue,
                    pn: pageNumber,
                    ps: pageSize,
                };

                return $http({
                    url: this.settings.backendAddress + '/staffs/',
                    method: 'GET',
                    params: args
                });

            },

            getStaffDetail: function (staffId) {
                var args = {
                    staff_id: staffId
                };

                return $http({
                    url: this.settings.backendAddress + '/staffs/' + staffId,
                    method: 'GET',
                    params: args
                });
            },

            addStaff: function (name, number, phone, email) {
                var args = {
                    staff_num: number,
                    staff_name: name,
                    phone: phone,
                    email: email,
                }

                return $http({
                    url: this.settings.backendAddress + '/staff/add',
                    method: 'POST',
                    data: args
                });
            },

            updateStaff: function (staffId, name, number, phone, email) {
                var args = {
                    id: staffId,
                    staff_num: number,
                    staff_name: name,
                    phone: phone,
                    email: email,
                }

                return $http({
                    url: this.settings.backendAddress + '/staff/update',
                    method: 'POST',
                    data: args
                });
            },

            deleteStaff: function (staffId) {
                var args = {
                    id: staffId
                };
                return $http({
                    url: this.settings.backendAddress + '/staff/delete',
                    method: 'POST',
                    data: args
                });
            },

            // ---------------- seat ---------------------
            getSeats: function (searchKey, searchValue, pageNumber, pageSize) {
                var args = {
                    sk: searchKey,
                    sv: searchValue,
                    pn: pageNumber,
                    ps: pageSize,
                };

                return $http({
                    url: this.settings.backendAddress + '/seats/',
                    method: 'GET',
                    params: args
                });

            },
        }
    }
]);

authModule.constant("AUTH_EVENTS", {
    resquestSuccess: "request-success",
    loginSuccess: "auth-login-success",
    loginFailed: "auth-login-failed",
    gatewayTimeout: "gateway-timeout",
    logoutSuccess: "auth-logout-success",
    sessionTimeout: "auth-session-timeout",
    notAuthenticated: "auth-not-authenticated",
    notAuthorized: "auth-not-authorized"
});

authModule.constant("USER_ROLES", {
    all: "*",
    admin: "admin",
    editor: "editor",
    guest: "guest"
});

authModule.factory("authMessage", function() {
    return {
        cookie: {
            lastLogin: null,
            email: null,
            id: null,
            isStaff: null,
            username: null,
            isSuperuser: true,
            dateJoined: null,

            create: function (lastLogin, email, id, isStaff, username, isSuperuser, dateJoined) {
                this.lastLogin = lastLogin;
                this.email = email;
                this.id = id;
                this.isStaff = isStaff;
                this.username = username;
                this.isSuperuser = isSuperuser;
                this.dateJoined = dateJoined;
            },
            destroy: function () {
                this.lastLogin = null;
                this.email = null;
                this.id = null;
                this.isStaff = null;
                this.username = null;
                this.isSuperuser = null;
                this.dateJoined = null;
            }
        }
    }
});

authModule
    .config(["$httpProvider", "SETTINGS", function ($httpProvider, SETTINGS) {
        //更改 Content-Type
        $httpProvider.defaults.headers.post["Content-Type"] = SETTINGS.headers.contentType;
        $httpProvider.defaults.headers.post["Accept"] = SETTINGS.headers.accept;
        $httpProvider.defaults.transformRequest = function (data) {
            //把JSON数据转换成字符串形式
            if (data !== undefined) {
                return $.param(data);
            } else {
                return data;
            }
        };
    }])
    .factory("authService",['$http', "SETTINGS", function($http, SETTINGS) {
        return {
            settings: {
                backendAddress: SETTINGS.backendAddress,
            },

            login: function (username, password) {
                var args = {
                    username: username,
                    password: password
                }

                return $http({
                    url: this.settings.backendAddress + '/user/login',
                    method: 'POST',
                    data: args
                });
            },


            logout: function () {
                return $http({
                    url: this.settings.backendAddress + '/user/logout',
                    method: 'POST'
                });
            },

            status: function () {
                return $http({
                    url: this.settings.backendAddress + '/user/status',
                    method: 'GET'
                });
            },

            forgetPassword: function (username) {
                args = {
                    username: username
                }
                return $http({
                    url: this.settings.backendAddress + '/user/forgetpassword',
                    method: 'POST'
                });
            },
            //验证用户
            isAuthenticated: function () {
                return !!Session.userId;
            },
            //验证授权
            isAuthorized: function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                    authorizedRoles = [authorizedRoles];
                }
                return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
            }
        }
}]);

authModule.factory('authInterceptor', ["$rootScope", "$q", "AUTH_EVENTS", "authMessage", "$location", "$state",
    function ($rootScope, $q, AUTH_EVENTS, authMessage, $location, $state) {
        return {
            request: function (config) {
                //config.headers['x-session-token'] = authMessage.cookie.token;
                //config.headers['x-session-pk'] = authMessage.cookie.id;
                //config.xhr.withCredentials = true;
                return config;
            },
            response: function (response) {
                $rootScope.$broadcast({
                    200: AUTH_EVENTS.resquestSuccess
                }[response.status], response);
                return response;
            },
            responseError: function (response) {
                console.log("session timeout!");

                if (response.status == 401) {
                    $state.go('user_login');
                }
                return $q.reject(response);
            }
        };
    }]);

authModule.config( function ($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        function ($injector) {
            return $injector.get('authInterceptor');
        }
    ]);
});


// 控制字符串长度超过指定长度后面内容以省略号显示
publicModule.filter('cut', function () {
    return function (value, max) {
        if (!value) return '';

        max = parseInt(max, 10)
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        return value + "...";

    };
});