(function() {
    describe('Testing reportListSvc service', function () {
        beforeEach(function() {
            module('svt');
            module(function($provide) {
                var spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                $provide.value('spinnerUtilSvc', spinnerUtilSvc);
            });
        });

        describe('Testing populateReports function', function () {
            var reportResults, reports;

            it('should return null with null source report', inject(function (reportListSvc) {
                reportResults = null;

                reportListSvc.populateReports(reportResults, reports);

                expect(reportResults).toEqual(null);
            }));

            it('should update destination report data when source report has data', inject(function (reportListSvc) {
                reportResults = [{ id: 1 }, { id: 2 }];
                reports = { data: [] };

                reportListSvc.populateReports(reportResults, reports);

                expect(reports.data.length).toBeGreaterThan(0);
            }));
        });
    });
})();