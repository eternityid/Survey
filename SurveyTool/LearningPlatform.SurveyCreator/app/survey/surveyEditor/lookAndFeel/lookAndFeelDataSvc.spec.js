(function () {
    'use strict';
    describe('Testing lookAndFeelDataSvc service', function () {
        var httpBackend,
            lookAndFeelDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                lookAndFeelDataSvc = $injector.get('lookAndFeelDataSvc');
            });
        });

        describe('Testing saveLookAndFeel function', function () {
            it('should save look and feel data', function () {
                var surveyId = 0,
                    params = { rowVersion: {} };
                httpBackend.expectPUT(hostMock + '/surveys/0/lookandfeel');
                httpBackend.whenPUT(hostMock + '/surveys/0/lookandfeel').respond({});
                var result = lookAndFeelDataSvc.saveLookAndFeel(surveyId, params);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();