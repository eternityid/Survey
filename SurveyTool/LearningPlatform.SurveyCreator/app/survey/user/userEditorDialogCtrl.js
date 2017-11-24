(function () {
    'use strict';

    angular
        .module('svt')
        .controller('userEditorDialogCtrl', userEditorDialogCtrl);

    userEditorDialogCtrl.$inject = [
        '$scope', '$modalInstance', 'spinnerUtilSvc', 'userManagementDataSvc',
        'user', 'companies', 'userDataSvc', 'userSvc'
    ];

    function userEditorDialogCtrl($scope, $modalInstance, spinnerUtilSvc, userManagementDataSvc,
        user, companies, userDataSvc, userSvc) {
        $scope.user = angular.copy(user);
        $scope.companies = companies;
        $scope.companyFilter = '';

        $scope.save = save;
        $scope.cancel = cancel;

        function save() {
            spinnerUtilSvc.showSpinner();
            userManagementDataSvc.editUser($scope.user.id, $scope.user).$promise.then(function () {
                angular.copy($scope.user, user);
                var updatedUser = {
                    externalId: user.externalId,
                    fullName: userSvc.getFullName(user.firstName, user.lastName),
                    email: user.emailAddress
                };
                userDataSvc.upsertUser(updatedUser).$promise.then(function (upsertedUser) {
                    spinnerUtilSvc.hideSpinner();
                    $modalInstance.close({ status: true, user: upsertedUser });
                }, function () {
                    toastr.error('Synchronising user was not successful');
                    spinnerUtilSvc.hideSpinner();
                    $modalInstance.close({ status: false });
                });
            }, function () {
                toastr.error('Updating user was not successful.');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();