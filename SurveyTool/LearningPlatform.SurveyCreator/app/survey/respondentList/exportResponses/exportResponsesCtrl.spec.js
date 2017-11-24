(function () {

    describe('Testing exportResponsesCtrl controller', function () {
        var scope,
            q, ctrl,
            pushDownSvc,
            exportResponsesSvc,
            exportResponsesDataSvc,
            spinnerUtilSvc,
            errorHandlingSvc,
            testModeSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                scope = $rootScope.$new();
                q = $q;

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['hidePushDown', 'setLoadingStatus']);

                exportResponsesSvc = jasmine.createSpyObj('exportResponsesSvc', ['buildExportSettingData', 'buildFile', 'getTitleModes',
                'getIncludedResponsesModes', 'getSeparatorModes']);
                exportResponsesSvc.buildExportSettingData.and.returnValue({});

                exportResponsesDataSvc = jasmine.createSpyObj('exportResponsesDataSvc', ['exportResponses']);


                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                testModeSvc = jasmine.createSpyObj('testModeSvc', ['getTestModeSettings']);
                testModeSvc.getTestModeSettings.and.returnValue({isActive: true});

                ctrl = $controller('exportResponsesCtrl', {
                    $scope: scope,
                    pushDownSvc: pushDownSvc,
                    exportResponsesSvc: exportResponsesSvc,
                    exportResponsesDataSvc: exportResponsesDataSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    testModeSvc: testModeSvc
                });
                scope.$digest();
            });
        });

        describe('Testing close function', function() {
            it('should close the push-down menu', function () {
                ctrl.close();

                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

        describe('Testing exportResponses function', function () {
            it('should export the response file when export success', function () {
                exportResponsesDataSvc.exportResponses.and.returnValue({$promise: q.when({})});
                spyOn(toastr, 'success');

                ctrl.exportResponses();
                scope.$digest();

                expect(exportResponsesSvc.buildExportSettingData).toHaveBeenCalled();
                expect(exportResponsesDataSvc.exportResponses).toHaveBeenCalled();
                expect(exportResponsesSvc.buildFile).toHaveBeenCalled();
            });
            it('should not export the response file when export fail', function () {
                exportResponsesDataSvc.exportResponses.and.returnValue({ $promise: q.reject({ data: {}}) });

                ctrl.exportResponses();
                scope.$digest();

                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });
    });
})();