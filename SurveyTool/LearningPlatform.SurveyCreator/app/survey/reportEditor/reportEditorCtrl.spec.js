(function() {
    describe('Testing reportEditorCtrl controller', function () {
        var ctrl, modal, reportPageSvc, reportPageDataSvc, scope, reportEditorSvc, spinnerUtilSvc, q;

        beforeEach(function() {
            module('svt');
            inject(function ($controller, $rootScope, $q) {
                q = $q;
                modal = jasmine.createSpyObj('$modal', ['open']);
                reportPageSvc = jasmine.createSpyObj('reportPageSvc', [
                    'updatePositionsForCurrentPages', 'setCurrentPages', 'getCurrentPages']);
                reportPageDataSvc = jasmine.createSpyObj('reportPageDataSvc', ['movePage', 'getAllByReportId']);
                reportPageDataSvc.getAllByReportId.and.returnValue({ $promise: q.when({}) });

                scope = $rootScope.$new();
                scope.$parent = {
                    vm: {}
                };

                reportEditorSvc = jasmine.createSpyObj('reportEditorSvc', [
                    'buildMovingPage', 'mapReportQuestions', 'mapReportPages', 'setWorkingScreenOnPage',
                    'setReportData'
                ]);
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                ctrl = $controller('reportEditorCtrl', {
                    $modal: modal,
                    reportPageSvc: reportPageSvc,
                    reportPageDataSvc: reportPageDataSvc,
                    $scope: scope,
                    reportEditorSvc: reportEditorSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
                scope.$digest();
            });
        });

        describe('Testing sortableOptions.accept function', function () {
            var sourceItemHandleScope;

            beforeEach(function() {
                sourceItemHandleScope = {
                    itemScope: {}
                };
            });

            it('should return true when page is defined', function () {
                sourceItemHandleScope.itemScope.page = {};

                var result = ctrl.sortableOptions.accept(sourceItemHandleScope);

                expect(result).toEqual(true);
            });

            it('should return false when page is null', function () {
                sourceItemHandleScope.itemScope.page = null;

                var result = ctrl.sortableOptions.accept(sourceItemHandleScope);

                expect(result).toEqual(false);
            });
        });

        describe('Testing movePage function', function() {
            var event;

            beforeEach(function() {
                event = {
                    source: {
                        itemScope: {
                            page: {
                                id: 1
                            }
                        },
                        index: 1
                    },
                    dest: {
                        index: 2
                    }
                };
            });

            it('should not update page position when moving page was not successful', function () {
                reportPageDataSvc.movePage.and.returnValue({ $promise: q.when({ status: false }) });

                ctrl.sortableOptions.orderChanged(event);
                scope.$digest();

                expect(reportPageSvc.updatePositionsForCurrentPages).not.toHaveBeenCalled();
            });

            it('should update page position when moving page was successful', function () {
                reportPageDataSvc.movePage.and.returnValue({ $promise: q.when({ status: true }) });

                ctrl.sortableOptions.orderChanged(event);
                scope.$digest();

                expect(reportPageSvc.updatePositionsForCurrentPages).toHaveBeenCalled();
            });

            it('should show error message when moving page has problem', function () {
                spyOn(toastr, 'error');
                reportPageDataSvc.movePage.and.returnValue({ $promise: q.reject() });

                ctrl.sortableOptions.orderChanged(event);
                scope.$digest();

                expect(toastr.error).toHaveBeenCalled();
            });
        });

        describe('Testing loadReport function', function() {
            var reportId;

            beforeEach(function() {
                reportId = 1;
            });

            it('should change questions when loading reports was successful', function() {
                ctrl.questions = [];
                reportPageDataSvc.getAllByReportId.and.returnValue({ $promise: q.when({}) });

                ctrl.loadReport(reportId);
                scope.$digest();

                expect(reportPageSvc.setCurrentPages).toHaveBeenCalled();
                expect(reportEditorSvc.setReportData).toHaveBeenCalled();
            });

            it('should show error message when loading report has problem', function () {
                reportPageDataSvc.getAllByReportId.and.returnValue({ $promise: q.reject({}) });
                spyOn(toastr, 'error');

                ctrl.loadReport(reportId);
                scope.$digest();

                expect(toastr.error).toHaveBeenCalled();
            });
        });
    });
})();