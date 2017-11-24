(function () {
    'use strict';

    angular
        .module('svt')
        .controller('userEditorCompanyDialogCtrl', userEditorCompanyDialogCtrl);

    userEditorCompanyDialogCtrl.$inject = [
        '$scope', '$modalInstance', 'spinnerUtilSvc',
        'user', 'companies', 'userDataSvc', 'userSvc'
    ];

    function userEditorCompanyDialogCtrl($scope, $modalInstance, spinnerUtilSvc,
        user, companies, userDataSvc, userSvc) {
        $scope.user = angular.copy(user);
        $scope.companies = companies;
        $scope.companyFilter = '';
        $scope.companyName = user.companyName;

        $scope.cancel = cancel;
        $scope.onSelectCompany = onSelectCompany;
        $scope.save = save;

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function onSelectCompany(company) {
            $scope.surveyToolUser = angular.copy(user);
            $scope.surveyToolUser.email = user.emailAddress;
            $scope.surveyToolUser.externalId = user.id;
            $scope.surveyToolUser.companyId = company ? company.id : null;
            delete $scope.surveyToolUser.id;

            $scope.companyName = company ? company.name : null;
        }

        function save() {
            var userCompany = angular.copy($scope.surveyToolUser);
            userCompany.fullName = userSvc.getFullName(userCompany.firstName, userCompany.lastName);
            spinnerUtilSvc.showSpinner();
            userDataSvc.upsertUserCompany(userCompany).$promise.then(function () {
                user.companyId = $scope.surveyToolUser.companyId;
                user.companyName = $scope.companyName;
                $scope.user.companyId = $scope.surveyToolUser.companyId;
                $scope.user.companyName = $scope.companyName;
                spinnerUtilSvc.hideSpinner();
                $modalInstance.close();
            }, function () {
                toastr.error('Assigning company for user was not successful.');
                spinnerUtilSvc.hideSpinner();
            });
        }
    }
})();