(function () {
    angular
        .module('svt')
        .controller('changePasswordCtrl', ChangePasswordCtrl);

    ChangePasswordCtrl.$inject = [
        '$location', 'changePasswordDataSvc', 'spinnerUtilSvc',
        'surveyMenuSvc'
    ];

    function ChangePasswordCtrl($location, changePasswordDataSvc, spinnerUtilSvc,
        surveyMenuSvc) {
        var vm = this;

        vm.validationResult = {
            invalid: false,
            message: ''
        };
        vm.changePasswordModel = {};

        vm.changePassword = changePassword;

        init();

        function init() {
            surveyMenuSvc.updateMenuForChangePassword();
        }

        function changePassword() {
            spinnerUtilSvc.showSpinner();
            changePasswordDataSvc.changePassword(vm.changePasswordModel).$promise.then(function () {
                spinnerUtilSvc.hideSpinner();
                vm.validationResult.invalid = false;
                $location.path('/surveys');
            }, function () {
                spinnerUtilSvc.hideSpinner();
                vm.validationResult.invalid = true;
                vm.validationResult.message = 'Changing password was not successful.';
            });
        }
    }

})();