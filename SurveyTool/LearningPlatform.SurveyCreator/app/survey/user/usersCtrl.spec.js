(function () {
    'use strict';
    describe('Testing usersCtrl controller', function () {
        var usersCtrl, scope, $modal, q,  spinnerUtilSvc, userManagementDataSvc, constantSvc;
        var responseMock = [{
            id: 1,
            Username: 'dummy',
            FirstName: 'dummy',
            LastName: 'dummy',
            CreatedDateString: 'dummy',
            EmailAddress: 'dummy@dum.my',
            IsActive: true
        }];

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $q, $injector) {
                scope = $rootScope.$new();
                q = $q;
                scope.$parent = {
                    vm: {}
                };

                $modal = jasmine.createSpyObj('$modal', ['open']);

                constantSvc = $injector.get('constantSvc');

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                userManagementDataSvc = jasmine.createSpyObj('userManagementDataSvc', ['getAllUsers', 'activateUsers', 'deleteUsers']);
                userManagementDataSvc.getAllUsers.and.returnValue({ $promise: q.when(responseMock) });
                userManagementDataSvc.activateUsers.and.returnValue({ $promise: q.when(responseMock) });


                usersCtrl = $controller('usersCtrl', {
                    $modal: $modal,
                    $scope: scope,
                    spinnerUtilSvc: spinnerUtilSvc,
                    userManagementDataSvc: userManagementDataSvc,
                    $q: q,
                    constantSvc: constantSvc
                });
                scope.$digest();
            });
        });

        describe('Testing init function', function () {
            it('should show Layout of User management', function () {
                expect(spinnerUtilSvc.showSpinner).toHaveBeenCalled();
                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
            });
        });

        describe('Testing masterChange function', function () {
            it('should set unselected for all users when master is false', function () {
                usersCtrl.master = false;
                usersCtrl.users = [{
                    isSelected: false,
                    id:1
                }];
                usersCtrl.masterChange();

                expect(usersCtrl.selectedList.removableList).toEqual([1]);
                expect(usersCtrl.selectedList.activableList).toEqual([1]);
                expect(usersCtrl.selectedList.deactivableList).toEqual([]);
            });

            it('should set selected for all user and update selected list when master is true', function () {
                usersCtrl.master = false;
                usersCtrl.users = [{
                    isSelected: false
                }];

                usersCtrl.masterChange();

                expect(usersCtrl.users[0].isSelected).toEqual(true);
            });
        });

        describe('Testing checkboxChange function', function () {
            it('should update activable list when user is not active', function () {
                usersCtrl.users = [{
                    isSelected: true,
                    isActive: false,
                    isAdminUser: false,
                    id: 'dummy'
                }];

                usersCtrl.checkboxChange();

                expect(usersCtrl.selectedList.activableList).not.toEqual([]);
            });

            it('should update deactivable list when user is active', function () {
                usersCtrl.users = [{
                    isSelected: true,
                    isActive: true,
                    isAdminUser: false,
                    id: 'dummy'
                }];

                usersCtrl.checkboxChange();

                expect(usersCtrl.selectedList.deactivable).not.toEqual([]);
            });
        });

        describe('Testing deactivateUsers function', function () {
            it('should handle when getting a problem ', function () {
                spyOn(toastr, 'error');
                userManagementDataSvc.activateUsers.and.returnValue({ $promise: q.reject({}) });

                usersCtrl.deactivateUsers();
                scope.$digest();

                expect(toastr.error).toHaveBeenCalled();
            });
        });

        describe('Testing openUserCreatorDialog function', function () {

            describe('Testing openUserCreatorDialog function', function () {
                it('should login unsucessfully user account', function () {
                    $modal.open.and.callFake(function () {
                        var defer = q.defer();
                        defer.resolve({ status: true });
                        return {
                            result: defer.promise
                        };
                    });
                    var user;
                    usersCtrl.openUserCreatorDialog(user);
                    scope.$digest();

                    expect($modal.open).toHaveBeenCalled();
                });
            });
            describe('Testing activateUser function', function () {
                it('should login sucessfully', function () {
                    spyOn(toastr, 'success');
                    var user = [{
                        id: 1
                    }];
                    usersCtrl.activateUsers(user);
                    scope.$digest();

                    expect(userManagementDataSvc.activateUsers).toHaveBeenCalled();
                    expect(spinnerUtilSvc.showSpinner).toHaveBeenCalled();
                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });

            });

            describe('Testing deleteUser function', function () {
                beforeEach(function () {
                    $modal.open.and.callFake(function () {
                        var defer = q.defer();
                        defer.resolve({ status: true });

                        return {
                            result: defer.promise
                        };
                    });
                });

                it('should show success message when deleting user successfully', function () {
                    spyOn(toastr, 'success');
                    userManagementDataSvc.deleteUsers.and.callFake(function () {
                        var defer = q.defer();
                        defer.resolve();
                        return {
                            $promise: defer.promise
                        };
                    });
                    var userId;

                    usersCtrl.deleteUsers(userId);
                    scope.$digest();

                    expect($modal.open).toHaveBeenCalled();
                });

                it('should show error message when deleting user unsuccessfully', function () {
                    spyOn(toastr, 'error');
                    var error = {
                        data: {
                            Message: 'dummy'
                        }
                    };
                    userManagementDataSvc.deleteUsers.and.returnValue({ $promise: q.reject(error) });

                    usersCtrl.deleteUsers();
                    scope.$digest();

                    expect($modal.open).toHaveBeenCalled();
                    expect(toastr.error).toHaveBeenCalled();
                });
            });
        });
    });
})();