(function() {
    describe('Testing reportsCtrl controller', function () {
        var ctrl, q, modal, scope, errorHandlingSvc, reportListSvc, reportListDataSvc, spinnerUtilSvc;

        beforeEach(function() {
            module('svt');
            inject(function ($controller, $rootScope, $q) {
                q = $q;
                modal = jasmine.createSpyObj('modal', ['open']);
                scope = $rootScope.$new();
                scope.$parent = {
                    vm: {}
                };

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                reportListSvc = jasmine.createSpyObj('reportListSvc', [
                    'getDefaultReports', 'getDefaultPaging', 'spinnerShow', 'spinnerHide', 'populateReports'
                ]);
                reportListSvc.getDefaultReports.and.returnValue({ data: [] });
                reportListSvc.getDefaultPaging.and.returnValue({});

                reportListDataSvc = jasmine.createSpyObj('reportListDataSvc', ['search']);
                reportListDataSvc.search.and.returnValue({ $promise: q.when({}) });

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                ctrl = $controller('reportsCtrl', {
                    $modal: modal,
                    $scope: scope,
                    errorHandlingSvc: errorHandlingSvc,
                    reportListSvc: reportListSvc,
                    reportListDataSvc: reportListDataSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
            });
        });

        describe('Testing createReport function', function() {
            it('should search reports when creating new report was successful', function () {
                modal.open.and.returnValue({ result: q.when({ status: true }) });

                ctrl.createReport();
                scope.$digest();

                expect(reportListDataSvc.search).toHaveBeenCalled();
            });

            it('should not search reports when cancelling creating new report', function () {
                modal.open.and.returnValue({ result: q.when({ status: false }) });
                var count = reportListDataSvc.search.calls.count();

                ctrl.createReport();
                scope.$digest();

                expect(reportListDataSvc.search.calls.count()).toEqual(count);
            });
        });

        describe('Testing search function', function() {
            it('should show error message when searching reports has problem', function () {
                reportListDataSvc.search.and.returnValue({ $promise: q.reject() });
                spyOn(toastr, 'error');

                ctrl.search();
                scope.$digest();

                expect(toastr.error).toHaveBeenCalled();
            });
        });

        describe('Testing loadMoreReports function', function() {
            it('should update report data when loading more reports was successful', function () {
                ctrl.reportsFound = 0;
                reportListDataSvc.search.and.returnValue({ $promise: q.when({ totalReportsFound: 10 }) });

                ctrl.loadMoreReports();
                scope.$digest();

                expect(reportListSvc.populateReports).toHaveBeenCalled();
                expect(ctrl.reportsFound).toBeGreaterThan(0);
            });

            it('should process error when loading more reports has problem', function () {
                reportListDataSvc.search.and.returnValue({ $promise: q.reject() });

                ctrl.loadMoreReports();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing updatePaging function', function () {
            var size;

            beforeEach(function() {
                ctrl.reports.data = [{ id: 1 }];
            });

            it('should update hashNext to false when going to the end of paging', function() {
                size = 1;
                ctrl.paging.hashNext = true;
                ctrl.reportsFound = 1;

                ctrl.updatePaging(size);

                expect(ctrl.paging.hashNext).toEqual(false);
            });

            it('should update hashNext to true when not going to last page', function () {
                size = 2;
                ctrl.paging.hashNext = false;
                ctrl.reportsFound = 2;

                ctrl.updatePaging(size);

                expect(ctrl.paging.hashNext).toEqual(true);
            });
        });

        describe('Testing searchByEnter function', function () {
            var event = {};

            it('should search reports when pressing enter key', function () {
                var count = reportListDataSvc.search.calls.count();
                event.which = 13;

                ctrl.searchByEnter(event);

                expect(reportListDataSvc.search.calls.count()).toBeGreaterThan(count);
            });

            it('should not search reports when not pressing enter key', function () {
                var count = reportListDataSvc.search.calls.count();
                event.which = 10;

                ctrl.searchByEnter(event);

                expect(reportListDataSvc.search.calls.count()).toEqual(count);
            });
        });
    });
})();