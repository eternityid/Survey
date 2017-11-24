(function () {
    'use strict';
    describe('Testing rsOpenTextQuestionCtrl controller', function () {
        var ctrl,
            scope,
            q,
            rsOpenTextQuestionSvc,
            reportDataSvc,
            errorHandlingSvc,
            spinnerUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.aggregatedQuestion = {};
                scope.total = 5;

                reportDataSvc = jasmine.createSpyObj('reportDataSvc', ['getDataForTable']);
                reportDataSvc.getDataForTable.and.returnValue({ $promise: q.when({}) });

                rsOpenTextQuestionSvc = jasmine.createSpyObj('rsOpenTextQuestionSvc', ['buildTable']);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['writeErrorToConsole']);
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                ctrl = $controller('rsOpenTextQuestionCtrl', {
                    $scope: scope,
                    rsOpenTextQuestionSvc: rsOpenTextQuestionSvc,
                    reportDataSvc: reportDataSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    spinnerUtilSvc: spinnerUtilSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.allOpenAnswers).toBeDefined();
                expect(ctrl.displayedOpenAnswers).toBeDefined();
            });
        });

        describe('Testing init function', function() {
            it('should build table when getting data was successful', function () {
                ctrl.init();
                scope.$digest();

                expect(rsOpenTextQuestionSvc.buildTable).toHaveBeenCalled();
            });

            it('should process error when getting data has error', function () {
                reportDataSvc.getDataForTable.and.returnValue({ $promise: q.reject({}) });

                ctrl.init();
                scope.$digest();

                expect(errorHandlingSvc.writeErrorToConsole).toHaveBeenCalled();
            });
        });

        describe('Testing loadResponses function', function() {
            var limit = 10;

            it('should update answers', function() {
                ctrl.displayedOpenAnswers = [];
                ctrl.allOpenAnswers = [{id: 1}, {id: 2}];

                ctrl.loadResponses(limit);

                expect(ctrl.displayedOpenAnswers.length).toBeGreaterThan(0);
            });
        });
    });
})();