(function () {
    'use strict';
    describe('Testing themeDataSvc service', function () {
        var httpBackend,
            themeDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                themeDataSvc = $injector.get('themeDataSvc');
            });
        });

        describe('Testing getSystemUserThemes service', function () {
            it('should do getSystemUserThemes service', function () {
                httpBackend.expectGET(hostMock + '/themes/types/system-user');
                httpBackend.whenGET(hostMock + '/themes/types/system-user').respond({ dummy: 'dummy' });
                var result = themeDataSvc.getSystemUserThemes();
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing getTheme service', function () {
            it('should do getTheme service', function () {
                var themeId = 7;
                httpBackend.expectGET(hostMock + '/themes/{themeId}?themeId=7');
                httpBackend.whenGET(hostMock + '/themes/{themeId}?themeId=7').respond({});
                var result = themeDataSvc.getTheme(themeId);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();