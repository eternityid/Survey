(function () {
    'use trict';

    angular.module('svt').controller('usersCtrl', usersCtrl);

    usersCtrl.$inject = [
        '$modal', '$scope', 'spinnerUtilSvc', 'userManagementDataSvc',
        '$q', 'constantSvc', 'companyDataSvc', 'userDataSvc', 'userSvc',
        'surveyMenuSvc'
    ];

    function usersCtrl(
        $modal, $scope, spinnerUtilSvc, userManagementDataSvc,
        $q, constantSvc, companyDataSvc, userDataSvc, userSvc,
        surveyMenuSvc) {
        var vm = this;

        var userStatus = {
            active: 'Active',
            deactive: 'Deactive'
        };
        vm.users = [];
        vm.surveyToolUsers = [];
        vm.companies = [];
        vm.companyMap = {};
        vm.surveyToolUserMap = {};
        vm.selectedList = {
            removableList: [],
            activableList: [],
            deactivableList: []
        };

        vm.openUserCreatorDialog = openUserCreatorDialog;
        vm.openUserEditorDialog = openUserEditorDialog;
        vm.deactivateUsers = deactivateUsers;
        vm.activateUsers = activateUsers;
        vm.deleteUsers = deleteUsers;
        vm.masterChange = masterChange;
        vm.checkboxChange = checkboxChange;
        vm.openEditCompanyDialog = openEditCompanyDialog;

        init();

        function masterChange() {
            surveyMenuSvc.updateMenuForUserList();
            vm.master = !vm.master;
            if (vm.master) {
                angular.forEach(vm.users, function (user) {
                    user.isSelected = true;
                    if (!user.isActive && !user.isAdminUser) {
                        vm.selectedList.activableList.push(user.id);
                        vm.selectedList.removableList.push(user.id);
                    }
                    if (user.isActive && !user.isAdminUser) {
                        vm.selectedList.deactivableList.push(user.id);
                    }
                });
            } else {
                angular.forEach(vm.users, function (user) {
                    user.isSelected = false;
                });
                resetselectedList();
            }
        }

        function resetselectedList() {
            vm.selectedList.removableList.splice(0, vm.selectedList.removableList.length);
            vm.selectedList.activableList.splice(0, vm.selectedList.activableList.length);
            vm.selectedList.deactivableList.splice(0, vm.selectedList.deactivableList.length);
        }

        var masteruser = angular.element('#masterCheckbox');
        function checkboxChange() {
            var allSet = true, allClear = true;
            resetselectedList();
            angular.forEach(vm.users, function (user) {
                if (user.isAdminUser) return;
                if (user.isSelected) {
                    allClear = false;
                    if (user.isActive) {
                        vm.selectedList.deactivableList.push(user.id);
                    } else {
                        vm.selectedList.activableList.push(user.id);
                        vm.selectedList.removableList.push(user.id);
                    }
                } else {
                    allSet = false;
                }
            });
            if (allSet) {
                vm.master = true;
                masteruser.prop("indeterminate", false);
            }
            else if (allClear) {
                vm.master = false;
                masteruser.prop("indeterminate", false);
            }
            else {
                vm.master = false;
                masteruser.prop("indeterminate", true);
            }
        }

        function init() {
            spinnerUtilSvc.showSpinner();
            $q.all([
                companyDataSvc.getAllCompanies().$promise,
                userDataSvc.getAllUsers().$promise,
                userManagementDataSvc.getAllUsers().$promise
            ]).then(function (results) {
                onLoadedData(results[0], results[1], results[2]);
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading data was not successful.', error);
            });
        }

        function onLoadedData(companies, surveyToolUsers, users) {
            angular.copy(companies, vm.companies);
            vm.companies.forEach(function (company) {
                vm.companyMap[company.id] = company;
            });
            angular.copy(surveyToolUsers, vm.surveyToolUsers);
            vm.surveyToolUsers.forEach(function (user) {
                vm.surveyToolUserMap[user.externalId] = user;
                var company = vm.companyMap[user.companyId];
                user.companyName = company ? company.name : null;
            });
            users = users.map(function (user) {
                var tempUser = {
                    $type: 'User',
                    id: user.id, //TODO why use same value for id and externalId
                    externalId: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    createdDate: user.createdDate,
                    emailAddress: user.emailAddress,//TODO why generate emailAddress
                    isActive: user.isActive,
                    status: user.isActive ? userStatus.active : userStatus.deactive,
                    role: user.role,
                    isAdminUser: userSvc.isAdmin(user.role),
                    isSelected: false
                };
                var surveyToolUser = vm.surveyToolUserMap[tempUser.externalId];
                tempUser.companyName = surveyToolUser ? surveyToolUser.companyName : null;
                return tempUser;
            });
            angular.copy(users, vm.users);
        }

        function activateUsers() {
            spinnerUtilSvc.showSpinner();
            userManagementDataSvc.activateUsers(vm.selectedList.activableList).$promise.then(function () {
                vm.users.forEach(function (user) {
                    if (vm.selectedList.activableList.indexOf(user.id) >= 0) {
                        user.isActive = true;
                        user.status = userStatus.active;
                    }
                    user.isSelected = false;
                });
                resetselectedList();
                spinnerUtilSvc.hideSpinner();
            }, function () {
                toastr.error('Activating users was not successful.');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function deactivateUsers() {
            spinnerUtilSvc.showSpinner();
            userManagementDataSvc.activateUsers(vm.selectedList.deactivableList).$promise.then(function () {
                vm.users.forEach(function (user) {
                    if (vm.selectedList.deactivableList.indexOf(user.id) >= 0) {
                        user.isActive = false;
                        user.status = userStatus.deactive;
                    }
                    user.isSelected = false;
                });
                resetselectedList();
                spinnerUtilSvc.hideSpinner();
            }, function () {
                toastr.error('Deactivating users was not successful.');
                spinnerUtilSvc.hideSpinner();
            });
        }

        function deleteUsers() {
            var confirmMessage = constantSvc.messages.deleteUser;
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            message: confirmMessage
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;

                spinnerUtilSvc.showSpinner();
                userManagementDataSvc.deleteUsers(vm.selectedList.removableList).$promise.then(function () {
                    vm.users = vm.users.filter(function (user) {
                        return vm.selectedList.removableList.indexOf(user.id) === -1;
                    });
                    resetselectedList();
                    spinnerUtilSvc.hideSpinner();
                }, function () {
                    toastr.error('Deleting users was not successful.');
                    spinnerUtilSvc.hideSpinner();
                });
            });
        }

        function openUserCreatorDialog() {
            $modal.open({
                templateUrl: 'survey/user/user-creator-dialog.html',
                controller: 'userCreatorDialogCtrl',
                windowClass: 'center-modal'
            }).result.then(function (result) {
                if (!result.status) return;
                result.user.status = result.user.isActive ? userStatus.active : userStatus.deactive;
                result.user.companyName = null;
                vm.users.push(result.user);
            });
        }

        function openUserEditorDialog(user) {
            $modal.open({
                templateUrl: 'survey/user/user-editor-dialog.html',
                controller: 'userEditorDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    user: function () {
                        return user;
                    },
                    companies: function () {
                        return vm.companies;
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                vm.surveyToolUsers.push(result.user);
            });
        }

        function openEditCompanyDialog(user) {
            $modal.open({
                templateUrl: 'survey/user/user-editor-company-dialog.html',
                controller: 'userEditorCompanyDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    user: function () {
                        return user;
                    },
                    companies: function () {
                        return vm.companies;
                    }
                }
            });
        }
    }
})();