(function () {
    angular
        .module('svt')
        .controller('indexCtrl', indexCtrl);

    indexCtrl.$inject = [
        '$location', 'authSvc', '$rootScope', 'indexSvc', '$modalStack', 'userSvc',
        'spinnerUtilSvc', 'userDataSvc', 'surveyMenuSvc'
    ];

    function indexCtrl(
        $location, authSvc, $rootScope, indexSvc, $modalStack, userSvc,
        spinnerUtilSvc, userDataSvc, surveyMenuSvc) {
        /* jshint -W040 */
        var vm = this;

        vm.isShowOverlay = false;
        vm.isActivedMenuResult = false;

        vm.logout = logout;
        vm.onClickOverlay = onClickOverlay;
        vm.init = init;

        init();

        function init() {
            vm.isShowMenuItems = false;
            vm.userLoggedIn = {
                userName: '',
                isAuthenticated: false,
                isAdmin: false
            };
            vm.menuStatus = surveyMenuSvc.getMenuStatus();

            setupOnLoggedIn();
            setupLoggedInData();

            closePopup();
            indexSvc.callbackCheckOverlay = callbackCheckOverlay;
            return;

            function setupOnLoggedIn() {
                $rootScope.$on('loggedIn', function () {
                    var loginData = authSvc.getLoginData();
                    if (loginData) {
                        setUserLoggedInData(loginData);
                        var locationPath = window.localStorage.getItem('locationPath');
                        window.localStorage.removeItem('locationPath');
                        if (locationPath) {
                            $location.path(locationPath).replace();
                        } else {
                            $location.path('/').replace();
                        }
                    }
                });
            }

            function setupLoggedInData() {
                authSvc.ensureLogin();
                var loginData = authSvc.getLoginData();
                if (loginData) {
                    setUserLoggedInData(loginData);
                    spinnerUtilSvc.showSpinner();
                    userDataSvc.upsertUserByLogginIn().$promise.then(function () {
                        spinnerUtilSvc.hideSpinner();
                    }, function () {
                        spinnerUtilSvc.hideSpinner();
                        toastr.error('Synchronising user was not successful');
                    });
                }
            }

            function callbackCheckOverlay(isShowed) {
                vm.isShowOverlay = isShowed;
            }
        }

        function closePopup() {
            $rootScope.$on('$routeChangeStart', function () {
                var top = $modalStack.getTop();
                if (top && top.key) top.key.dismiss('cancel');
            });
        }

        function setUserLoggedInData(loginData) {
            vm.userLoggedIn.userName = loginData.userName;
            vm.userLoggedIn.isAdmin = userSvc.isAdmin(loginData.userRole);
            vm.userLoggedIn.isAuthenticated = true;
        }

        function logout() {
            authSvc.logout();
            vm.userLoggedIn = {
                userName: '',
                isAuthenticated: false,
                isAdmin: false
            };
        }

        function onClickOverlay() {
            $rootScope.$broadcast('event:ClickOnOverlayInDesigner');
        }
    }
})();