(function () {
    'use strict';

    describe('Testing launchCtrl controller', function () {
        var ctrl,
            instanceController,
            scope,
            launchDataSvc,
            spinnerUtilSvc,
            launchSvc,
            errorHandlingSvc,
            q,
            $modal,
            surveyDataSvc,
            surveyTitleAndStatusSvc,
            settingConst,
            baseHost;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                scope = $rootScope.$new();
                scope.$parent = {
                    vm: {}
                };
                q = $q;

                launchDataSvc = jasmine.createSpyObj('launchDataSvc', [
                    'sendEmail'
                ]);

                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', [
                    'getSurveyInfo', 'getSurveyBrief', 'publishSurvey', 'updateSurveySettings', 'updateSurveyStatus'
                ]);
                surveyDataSvc.getSurveyBrief.and.returnValue({ $promise: q.when({ surveySettings: {} }) });

                surveyTitleAndStatusSvc = jasmine.createSpyObj('surveyTitleAndStatusSvc', [
                  'updateLatestChangedTimestamp'
                ]);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                launchSvc = jasmine.createSpyObj('launchSvc', ['validateEmail']);
                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError', 'writeErrorToConsole']);
                $modal = jasmine.createSpyObj('modal', ['open']);

                settingConst = {
                    httpMethod: {}
                };
                baseHost = "dummy";

                instanceController = function () {
                    ctrl = $controller('launchCtrl', {
                        $routeParams: { id: '3' },
                        $scope: scope,
                        spinnerUtilSvc: spinnerUtilSvc,
                        launchDataSvc: launchDataSvc,
                        launchSvc: launchSvc,
                        errorHandlingSvc: errorHandlingSvc,
                        $modal: $modal,
                        surveyDataSvc: surveyDataSvc,
                        baseHost: baseHost,
                        settingConst: settingConst
                    });

                    ctrl.survey = {
                        surveySettings: {}
                    };
                    ctrl.accessMode = {
                        open: {
                            name: 'Open Access',
                            value: 'open'
                        },
                        invitationOnly: {
                            name: 'Invitation Only',
                            value: 'invitationOnly'
                        },
                        sso: {
                            name: 'Single Sign-on',
                            value: 'sso'
                        }
                    };
                };

            });
        });

        describe('Testing onAccessModeChanged function', function () {
            var value;

            it('should show message when updating survey setting was successful', function () {
                value = false;
                surveyDataSvc.updateSurveySettings.and.returnValue({ $promise: q.when({ surveySettings: {} }) });

                instanceController();
                ctrl.onAccessModeChanged(value);
                scope.$digest();

                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
            });

            it('should show error when survey data was changed before updating', function() {
                value = true;
                surveyDataSvc.updateSurveySettings.and.returnValue({ $promise: q.reject({ status: 412 }) });

                instanceController();
                ctrl.onAccessModeChanged(value);
                scope.$digest();

                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
            });

            it('should show error when updating server has problem', function () {
                value = false;
                surveyDataSvc.updateSurveySettings.and.returnValue({ $promise: q.reject({}) });

                instanceController();
                ctrl.onAccessModeChanged(value);
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing publish function', function () {
            var action;
            describe('With not invited respondents', function () {
                beforeEach(function () {
                    instanceController();
                    ctrl.inviteRespondents = false;
                });

                it('should show message after publishing successfully', function () {
                    action = 'Publishing';
                    surveyDataSvc
                        .publishSurvey.and.returnValue({ $promise: q.when([{}]) });
                    spyOn(toastr, 'success');

                    ctrl.publish(action);
                    scope.$digest();

                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });

                it('should show error when survey data was changed before publishing', function () {
                    action = 'Publishing';
                    surveyDataSvc.publishSurvey.and.returnValue({ $promise: q.reject({ status: 412 }) });

                    ctrl.publish(action);
                    scope.$digest();

                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });

                it('should process error when publishing was not successful', function () {
                    action = 'Republishing';
                    surveyDataSvc.publishSurvey.and.returnValue({ $promise: q.reject('dummy') });

                    ctrl.publish(action);
                    scope.$digest();

                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });
            });

            describe('With invited respondents', function () {
                beforeEach(function () {
                    instanceController();
                    ctrl.inviteRespondents = true;
                });

                it('should not publish survey with invalid respondent', function () {
                    launchSvc.validateEmail.and.returnValue(false);

                    ctrl.publish();
                    scope.$digest();

                    expect(surveyDataSvc.publishSurvey).not.toHaveBeenCalled();
                });

                it('should show message when publishing survey and sending email was successful', function () {
                    surveyDataSvc.publishSurvey.and.returnValue({ $promise: q.when([{}]) });
                    launchDataSvc.sendEmail.and.returnValue({ $promise: q.when([{}]) });
                    launchSvc.validateEmail.and.returnValue(true);
                    spyOn(toastr, 'success');

                    ctrl.publish();
                    scope.$digest();

                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });

                it('should process error when sending email was not successful', function () {
                    surveyDataSvc.publishSurvey.and.returnValue({ $promise: q.when([{}]) });
                    launchDataSvc.sendEmail.and.returnValue({ $promise: q.reject('dummy') });
                    launchSvc.validateEmail.and.returnValue(true);
                    spyOn(toastr, 'success');

                    ctrl.publish();
                    scope.$digest();

                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });

                it('should show error when survey data was changed before publishing and sending email', function () {
                    action = 'Republishing';
                    surveyDataSvc.publishSurvey.and.returnValue({ $promise: q.reject({ status: 412 }) });
                    launchSvc.validateEmail.and.returnValue(true);

                    ctrl.publish(action);
                    scope.$digest();

                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });

                it('should process error when publishing survey was not successful', function () {
                    surveyDataSvc.publishSurvey.and.returnValue({ $promise: q.reject('dummy') });
                    launchSvc.validateEmail.and.returnValue(true);

                    ctrl.publish();
                    scope.$digest();

                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });
            });
        });

        describe('Testing closeSurvey function', function () {
            beforeEach(function() {
                instanceController();
            });

            it('should not update survey status when cancelling dialog', function() {
                $modal.open.and.returnValue({ result: q.when({ status: false }) });

                ctrl.closeSurvey();
                scope.$digest();

                expect(surveyDataSvc.updateSurveyStatus).not.toHaveBeenCalled();
            });

            it('should process error when survey data was changed before closing survey', function() {
                $modal.open.and.returnValue({ result: q.when({ status: true }) });
                surveyDataSvc.updateSurveyStatus.and.returnValue({ $promise: q.reject({ status: 412 }) });

                ctrl.closeSurvey();
                scope.$digest();

                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
            });

            it('should show error message when closing survey was not successful', function () {
                $modal.open.and.returnValue({ result: q.when({ status: true, isTemporarilyClosed: true }) });
                spyOn(toastr, 'error');
                surveyDataSvc.updateSurveyStatus.and.returnValue({ $promise: q.reject('dummy') });

                ctrl.closeSurvey();
                scope.$digest();

                expect(toastr.error).toHaveBeenCalled();
            });
        });

        describe('Testing reopenSurvey function', function() {
            it('should show error message when re-openning survey was not successful', function () {
                surveyDataSvc.updateSurveyStatus.and.returnValue({ $promise: q.reject('dummy') });
                spyOn(toastr, 'error');

                instanceController();
                ctrl.reopenSurvey();
                scope.$digest();

                expect(toastr.error).toHaveBeenCalled();
            });
        });
    });
})();