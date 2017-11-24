(function() {
    describe('Testing generateRandomDataCtrl controller', function () {
        var scope, pushDownSvc, generateRandomDataSvc, errorHandlingSvc, spinnerUtilSvc, generateRandomResponsesDataSvc, q, ctrl;

        beforeEach(function() {
            module('svt');
            inject(function ($controller, $rootScope, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.handleAfterSave = jasmine.createSpy();

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['hidePushDown', 'setLoadingStatus']);
                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['hideSpinner', 'showSpinner']);
                generateRandomDataSvc = jasmine.createSpyObj('generateRandomDataSvc', ['getNumberOfTestResponsesOptions']);

                generateRandomResponsesDataSvc = jasmine.createSpyObj('generateRandomResponsesDataSvc', ['generateRandomData']);
                generateRandomResponsesDataSvc.generateRandomData.and.returnValue({ $promise: q.when([{}]) });

                ctrl = $controller('generateRandomDataCtrl', {
                    $scope: scope,
                    pushDownSvc: pushDownSvc,
                    generateRandomDataSvc: generateRandomDataSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    generateRandomResponsesDataSvc: generateRandomResponsesDataSvc
                });
                scope.$digest();
            });
        });

        describe('Testing closeMe function', function () {
            it('should close the push down', function () {
                ctrl.close();
                scope.$digest();

                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

        describe('Testing generateRandomData function', function () {
            it('should handle when generate random data success', function () {
                spyOn(toastr, 'success');
                ctrl.generateRandomData();
                scope.$digest();

                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
            });

            it('should handle when generate random data fail', function () {
                generateRandomResponsesDataSvc.generateRandomData.and.returnValue({ $promise: q.reject({ error: {} }) });
                ctrl.generateRandomData();
                scope.$digest();

                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

    });
})();