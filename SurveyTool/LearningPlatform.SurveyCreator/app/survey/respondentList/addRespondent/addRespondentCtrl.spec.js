(function () {
    'use stric';
    describe('Testing addRespondentCtrl controller', function () {
        var scope, pushDownSvc, spinnerUtilSvc, errorHandlingSvc, testModeSvc, addRespondentSvc, respondentListDataSvc, q, ctrl;

        beforeEach(function() {
            module('svt');

            inject(function($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.surveyId = '1';
                scope.handleAfterSave = jasmine.createSpy();
                scope.highlightEmailAddressesContainer = jasmine.createSpy();

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', [
                    'hidePushDown', 'setLoadingStatus'
                ]);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', [
                    'showSpinner', 'hideSpinner'
                ]);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', [
                    'manifestError'
                ]);

                testModeSvc = jasmine.createSpyObj('testModeSvc', [
                    'getTestModeSettings'
                ]);
                testModeSvc.getTestModeSettings.and.returnValue({ isActive: true });
                addRespondentSvc = jasmine.createSpyObj('addRespondentSvc', [
                    'validateEmailAddresses'
                ]);

                respondentListDataSvc = jasmine.createSpyObj('respondentListDataSvc', [
                    'addRespondents'
                ]);

                ctrl = $controller('addRespondentCtrl', {
                    $scope: scope,
                    pushDownSvc: pushDownSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    testModeSvc: testModeSvc,
                    addRespondentSvc: addRespondentSvc,
                    respondentListDataSvc: respondentListDataSvc
                });
            });
        });

        describe('Testing closeMe function', function () {
            it('should hide push down', function () {
                ctrl.close();

                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

        describe('Testing addRespondents function', function () {
            var result = true;
            beforeEach(function() {

            });

            it('should not input invalid emails', function () {
                addRespondentSvc.validateEmailAddresses.and.returnValue(false);

                ctrl.addRespondents();

                expect(respondentListDataSvc.addRespondents).not.toHaveBeenCalled();
            });

            describe('With valid emails', function () {
                beforeEach(function () {
                    addRespondentSvc.validateEmailAddresses.and.returnValue(true);
                    ctrl.emailAddresses = ['abc@yahoo.com'];
                });

                it('should update respondent list when add respondent successfully', function () {
                    spyOn(toastr, 'success');
                    respondentListDataSvc.addRespondents.and.returnValue({ $promise: q.when({}) });

                    ctrl.addRespondents();
                    scope.$digest();

                    expect(respondentListDataSvc.addRespondents).toHaveBeenCalled();                    
                });

                it('should show error message when add respondents unsuccessfully', function () {
                    respondentListDataSvc.addRespondents.and.returnValue({ $promise: q.reject({ data: {} }) });

                    ctrl.addRespondents(result);
                    scope.$digest();

                    expect(respondentListDataSvc.addRespondents).toHaveBeenCalled();
                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                });
            });
        });

    });
})();