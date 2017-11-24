(function () {
    'use strict';

    angular
        .module('svt')
        .controller('userCreatorDialogCtrl', userCreatorDialogCtrl);

    userCreatorDialogCtrl.$inject = [
        '$scope', '$modalInstance', 'spinnerUtilSvc', 'userManagementDataSvc', 'userDataSvc',
        'userSvc'
    ];

    function userCreatorDialogCtrl(
        $scope, $modalInstance, spinnerUtilSvc, userManagementDataSvc, userDataSvc,
        userSvc) {
        $scope.user = {
            clientId: 'ResponsiveInsight',
            returnUrl: window.location.host + '/app/#/surveys'
        };

        $scope.save = save;
        $scope.cancel = cancel;

        function save() {
            spinnerUtilSvc.showSpinner();
            userManagementDataSvc.createUser($scope.user).$promise.then(function (newUser) {
                $scope.user.externalId = newUser.id;
                $scope.user.createdDate = newUser.createdDate;
                var user = {
                    externalId: newUser.id,
                    fullName: userSvc.getFullName(newUser.firstName, newUser.lastName),
                    email: newUser.email
                };
                userDataSvc.upsertUser(user).$promise.then(function (upsertedUser) {
                    spinnerUtilSvc.hideSpinner();
                    $scope.user.id = upsertedUser.id;
                    $modalInstance.close({ status: true, user: $scope.user });
                }, function () {
                    spinnerUtilSvc.hideSpinner();
                    $modalInstance.close({ status: true, user: $scope.user });
                    toastr.error('Synchronising user was not successful');
                });
            }, function () {
                toastr.error('Creating user was not successful.');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();