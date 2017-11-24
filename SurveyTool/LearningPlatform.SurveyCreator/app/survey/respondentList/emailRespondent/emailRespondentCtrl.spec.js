(function () {
    'use strict';
    describe('Testing emailRespondentCtrl controller', function () {
        var emailRespondentCtrl,
            scope,
            respondentListDataSvc,
            emailRespondentSvc,
            errorHandlingSvc,
            pushDownSvc,
            spinnerUtilSvc,
            surveyEditorSvc,
            q;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.emailData = {
                    numberOfRespondents: '7'
                };
                scope.handleAfterSend = jasmine.createSpy();

                respondentListDataSvc = jasmine.createSpyObj('respondentListDataSvc', ['sendEmail', 'testSendEmail', 'getSurveyLatestVerion']);
                respondentListDataSvc.getSurveyLatestVerion.and.returnValue({ $promise: q.when({ SurveyVersion: {}}) });

                emailRespondentSvc = jasmine.createSpyObj('emailRespondentSvc', [
                    'validateEmail', 'getSendRespondentForm', 'getPlaceHolders', 'getEmailMessage'
                ]);
                emailRespondentSvc.getPlaceHolders.and.returnValue({});
                emailRespondentSvc.getEmailMessage.and.returnValue({});

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);
                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['hidePushDown', 'setLoadingStatus']);
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getSvtPlaceholderRespondentItems']);

                emailRespondentCtrl = $controller('emailRespondentCtrl', {
                    $scope: scope,
                    respondentListDataSvc: respondentListDataSvc,
                    emailRespondentSvc: emailRespondentSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    pushDownSvc: pushDownSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    surveyEditorSvc: surveyEditorSvc
                });
            });
        });

        describe('Testing control properties', function () {
            it('should return the control properties', function () {
                expect(emailRespondentCtrl.emailMessage).toBeDefined();
                expect(emailRespondentCtrl.isSending).toBeDefined();
                expect(emailRespondentCtrl.placeHolders).toBeDefined();
            });
        });

        describe('Testing closeMe function', function () {
            it('should hide push down', function() {
                emailRespondentCtrl.close();

                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

        describe('Testing send function', function() {
            beforeEach(function() {
                scope.isSpinnerActive = false;
                scope.emailMessage = {
                    emailAddress: 'dummy@dummy.com'
                };
                emailRespondentSvc.validateEmail.and.returnValue(true);
                emailRespondentSvc.getSendRespondentForm.and.returnValue({});

                emailRespondentCtrl.placeHolders = {
                    subject: {},
                    content: {}
                };
            });

            it('should not send email with invalid data', function() {
                emailRespondentSvc.validateEmail.and.returnValue(false);

                emailRespondentCtrl.send();

                expect(respondentListDataSvc.sendEmail).not.toHaveBeenCalled();
            });

            it('should send respondent when sending email succesfullly', function() {
                spyOn(toastr, 'success');
                respondentListDataSvc.sendEmail.and.returnValue({ $promise: q.when({}) });

                emailRespondentCtrl.send();

                expect(emailRespondentSvc.validateEmail).toHaveBeenCalled();
                expect(emailRespondentSvc.getSendRespondentForm).toHaveBeenCalled();                                
            });

            it('should process error when sending email has problem', function() {
                respondentListDataSvc.sendEmail.and.callFake(function() {
                    var defer = q.defer();
                    defer.reject();

                    return {
                        $promise: defer.promise
                    };
                });

                emailRespondentCtrl.send();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });
    });
})();