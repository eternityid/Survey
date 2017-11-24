(function () {
    angular
        .module('svt')
        .controller('accessRightsCtrl', accessRightsCtrl);

    accessRightsCtrl.$inject = [
        '$scope', 'pushDownSvc', 'accessRightsDataSvc',
        'accessRightsSvc', 'surveyEditorSvc', 'spinnerUtilSvc', 'accessRightsConst'
    ];

    function accessRightsCtrl($scope, pushDownSvc, accessRightsDataSvc,
        accessRightsSvc, surveyEditorSvc, spinnerUtilSvc, accessRightsConst) {

        var vm = this;


        vm.updateAccessRights = updateAccessRights;
        vm.close = closePushDown;
        vm.accessRightsTypes = accessRightsConst.accessRightsTypes;
        vm.accessRightsTypesWithoutNoAccess = accessRightsSvc.getAccessRightsTypesWithoutNoAccess();

        vm.newUserAccessRights = {
            id: null,
            fullName: null,
            email: null,
            accessRights: null
        };
        vm.hasAnyChanges = false;
        vm.onSelectedUserInCompany = onSelectedUserInCompany;
        vm.onSelectedAccessRightsTypesChange = onSelectedAccessRightsTypesChange;
        vm.isAccessRightsEmpty = true;

        init();

        function init() {
            surveyEditorSvc.setSurveyEditMode(true);
            pushDownSvc.setLoadingStatus(true);
            loadUsersInCompany();

            $scope.$on('$destroy', function () {
                surveyEditorSvc.setSurveyEditMode(false);
            });

            $scope.$watch('vm.accessRightsUsersInCompany', function (newValue, oldValue) {
                if (oldValue && newValue && newValue !== oldValue) {
                    vm.hasAnyChanges = true;
                }
                vm.isAccessRightsEmpty = vm.accessRightsUsersInCompany && vm.accessRightsUsersInCompany.length <= 0;
            }, true);
        }

        function loadUsersInCompany() {
            spinnerUtilSvc.showSpinner();
            accessRightsDataSvc.getUsersByCompany().$promise.then(function (result) {
                spinnerUtilSvc.hideSpinner();
                vm.usersInCompany = result && result.length > 0 ? result : [];
                accessRightsSvc.addFullNameAndEmail(vm.usersInCompany);
                vm.accessRightsUsersInCompany = accessRightsSvc.getAccessRightsUsersInCompany(vm.usersInCompany);
                makeAvailableUsers();
            }, function (error) {
                toastr.error('Get users in this company was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function onSelectedUserInCompany(item) {
            vm.newUserAccessRights.id = item.externalId;
            vm.newUserAccessRights.fullName = item.fullName;
            vm.newUserAccessRights.email = item.email;

            if (vm.newUserAccessRights.id && vm.newUserAccessRights.accessRights) {
                vm.accessRightsUsersInCompany.push({
                    id: vm.newUserAccessRights.id,
                    fullName: vm.newUserAccessRights.fullName,
                    email: vm.newUserAccessRights.email,
                    accessRights: vm.newUserAccessRights.accessRights
                });
                makeAvailableUsers();
            }
        }

        function onSelectedAccessRightsTypesChange() {
            if (vm.newUserAccessRights.id && vm.newUserAccessRights.accessRights) {
                vm.accessRightsUsersInCompany.push({
                    id: vm.newUserAccessRights.id,
                    fullName: vm.newUserAccessRights.fullName,
                    email: vm.newUserAccessRights.email,
                    accessRights: vm.newUserAccessRights.accessRights
                });
                makeAvailableUsers();
            }
        }

        function makeAvailableUsers() {
            accessRightsSvc.makeAvailableUsers(
                vm.usersInCompany,
                vm.accessRightsUsersInCompany,
                vm.newUserAccessRights);
        }

        function updateAccessRights() {
            var accessRights = accessRightsSvc.convertAccessRightsParameters(vm.accessRightsUsersInCompany);
            spinnerUtilSvc.showSpinner();
            accessRightsDataSvc.updateAccessRights($scope.surveyId, accessRights).$promise.then(function (result) {
                spinnerUtilSvc.hideSpinner();
                accessRightsSvc.updateAccessRightsInSurvey(result);
                toastr.success('Update access rights was successful');
                vm.close();
            }, function (error) {
                toastr.error('Update access rights was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function closePushDown() {
            pushDownSvc.hidePushDown();
        }

    }
})();