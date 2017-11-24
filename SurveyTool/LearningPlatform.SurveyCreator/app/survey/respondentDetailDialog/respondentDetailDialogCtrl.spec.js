(function () {
    'use strict';
    describe('Testing ctrl controller', function () {
        var ctrl,
            instanceController,
            scope,
            q,
            errorHandlingSvc,
            respondentListSvc,
            respondentDetailDialogDataSvc,
            modalInstance,
            modalData;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();

                modalData = {
                    surveyId: 1,
                    respondentId: 11,
                    isTestMode: false
                };

                modalInstance = jasmine.createSpyObj('$modalInstance', ['dismiss']);

                respondentListSvc = jasmine.createSpyObj('respondentListSvc', ['getStatusDisplay']);

                respondentDetailDialogDataSvc = jasmine.createSpyObj('respondentDetailDialogDataSvc', ['getRespondentDetail']);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                instanceController = function () {
                    ctrl = $controller('respondentDetailDialogCtrl', {
                        $scope: scope,
                        errorHandlingSvc: errorHandlingSvc,
                        respondentListSvc: respondentListSvc,
                        respondentDetailDialogDataSvc: respondentDetailDialogDataSvc,
                        $modalInstance: modalInstance,
                        modalData: modalData
                    });
                };
            });
        });

        describe('Test init function', function() {
            it('should setup data when get respondent detail success', function () {
                respondentDetailDialogDataSvc.getRespondentDetail.and.returnValue({ $promise: q.when({ respondent: {} }) });
                instanceController();
                scope.$digest();

                expect(respondentListSvc.getStatusDisplay).toHaveBeenCalled();
            });

            it('should handle error when get respondent detail fail', function () {
                respondentDetailDialogDataSvc.getRespondentDetail.and.returnValue({ $promise: q.reject({}) });
                instanceController();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });
    });
})();