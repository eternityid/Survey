(function () {
    'use strict';
    describe('Testing userManagementDataSvc service', function () {
        var httpBackend,
            userManagementDataSvc,
            adminUserApiUrlMock = 'https://localhost:44300/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                userManagementDataSvc = $injector.get('userManagementDataSvc');
            });
        });

        describe('Testing getAllUsers function', function () {
            it('should get all of user', function () {
                var dummy = [];
                httpBackend.expectGET(adminUserApiUrlMock + '/management/users');
                httpBackend.whenGET(adminUserApiUrlMock + '/management/users').respond(dummy);
                var result = userManagementDataSvc.getAllUsers();
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing activateUsers function', function () {
            it('should active multi-user', function () {
                httpBackend.expectPOST(adminUserApiUrlMock + '/management/users/activate');
                httpBackend.whenPOST(adminUserApiUrlMock + '/management/users/activate').respond({});
                var result = userManagementDataSvc.activateUsers(1);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing createUser function', function () {
            it('should create an user', function () {
                httpBackend.expectPOST(adminUserApiUrlMock + '/management/users');
                httpBackend.whenPOST(adminUserApiUrlMock + '/management/users').respond({});
                var result = userManagementDataSvc.createUser();
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing editUser function', function () {
            it('should edit an user', function () {
                httpBackend.expectPUT(adminUserApiUrlMock + '/management/users/1');
                httpBackend.whenPUT(adminUserApiUrlMock + '/management/users/1').respond({});
                var result = userManagementDataSvc.editUser(1);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing deleteUsers function', function () {
            it('should delete multi user', function () {
                httpBackend.expectPOST(adminUserApiUrlMock + '/management/users/delete');
                httpBackend.whenPOST(adminUserApiUrlMock + '/management/users/delete').respond({});
                var result = userManagementDataSvc.deleteUsers(1);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();