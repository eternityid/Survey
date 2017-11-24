(function () {
    'use strict';
    describe('Testing reportListDataSvc service', function () {
        var httpBackend,
            reportListDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                reportListDataSvc = $injector.get('reportListDataSvc');
            });
        });

        describe('Testing addReport function', function () {
            it('should add new report', function () {
                var report = {};
                httpBackend.expectPOST(hostMock + '/reports/0/definition');
                httpBackend.whenPOST(hostMock + '/reports/0/definition').respond({});
                var result = reportListDataSvc.addReport(report);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing editReport function', function () {
            it('should edit report', function () {
                var report = {id:0};
                httpBackend.expectPUT(hostMock + '/reports/0/definition');
                httpBackend.whenPUT(hostMock + '/reports/0/definition').respond({});
                var result = reportListDataSvc.editReport(report);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing search function', function () {
            it('should return report list', function () {
                var searchModel = {};
                httpBackend.expectPOST(hostMock + '/reports');
                httpBackend.whenPOST(hostMock + '/reports').respond({});
                var result = reportListDataSvc.search(searchModel);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();