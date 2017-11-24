(function () {
    'use trict';

    angular.module('svt').controller('launchCtrl', launchCtrl);

    launchCtrl.$inject = [
        '$routeParams', '$scope', 'spinnerUtilSvc', 'launchDataSvc', 'launchSvc',
        'errorHandlingSvc', '$modal', 'surveySvc', '$timeout', 'surveyDataSvc', 'settingConst',
        'surveyTitleAndStatusSvc', 'baseHost', 'authSvc', 'surveyMenuSvc'
    ];

    function launchCtrl(
        $routeParams, $scope, spinnerUtilSvc, launchDataSvc, launchSvc,
        errorHandlingSvc, $modal, surveySvc, $timeout, surveyDataSvc, settingConst,
        surveyTitleAndStatusSvc, baseHost, authSvc, surveyMenuSvc) {
        var vm = this;

        vm.svtCkeditorConfig = {
            extraPlugins: 'svtinserthelper,svtsurveylink,svtinsertfromfilelibrary',
            svtData: {
                placeholderRespondentItems: []
            }
        };
        vm.surveyId = $routeParams.id;
        vm.inviteRespondents = false;
        vm.surveyLinkPrefix = baseHost + '/survey/';

        vm.accessMode = {
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

        vm.surveyStatus = surveySvc.surveyStatus;

        vm.respondent = {
            emailTo: '',
            availableEmailAddresses: [],
            subject: 'Survey Invitation',
            body: 'We\'re conducting a survey and your input would be appreciated. Click the button below to start the survey. Thank you for your participation!'
        };

        vm.publish = publish;
        vm.onAccessModeChanged = onAccessModeChanged;
        vm.closeSurvey = closeSurvey;
        vm.reopenSurvey = reopenSurvey;

        init();
        
        function init() {
            surveyMenuSvc.updateMenuForSurveyLaunch(vm.surveyId);

            spinnerUtilSvc.showSpinner();
            surveyDataSvc.getSurveyBrief(vm.surveyId).$promise.then(function (survey) {
                if (survey.surveySettings.singleSignOnSurvey) {
                    vm.surveyAccessMode = vm.accessMode.sso.value;
                } else if (survey.surveySettings.invitationOnlySurvey) {
                    vm.surveyAccessMode = vm.accessMode.invitationOnly.value;
                } else {
                    vm.surveyAccessMode = vm.accessMode.open.value;
                }
                vm.survey = survey;
                vm.surveyLink = vm.surveyLinkPrefix + vm.survey.id;
                populateSurveyMetaData(vm.survey);

                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Getting survey info was not successful.', error);
            });
        }

        function populateSurveyMetaData(survey) {
            var loginData = authSvc.getLoginData();
            if (loginData) {
                survey.isUserHaveFullPermission = (survey.userId === loginData.userId) ||
                    (survey.accessRights && survey.accessRights.full.indexOf(loginData.userId) >= 0);
            }
        }

        function onAccessModeChanged() {
            spinnerUtilSvc.showSpinner();

            var surveySettings = angular.copy(vm.survey.surveySettings);
            if (vm.surveyAccessMode === vm.accessMode.sso.value) {
                surveySettings.singleSignOnSurvey = true;
                surveySettings.invitationOnlySurvey = false;
            } else if (vm.surveyAccessMode === vm.accessMode.invitationOnly.value) {
                surveySettings.singleSignOnSurvey = false;
                surveySettings.invitationOnlySurvey = true;
            } else {
                surveySettings.singleSignOnSurvey = false;
                surveySettings.invitationOnlySurvey = false;
            }

            surveyDataSvc.updateSurveySettings(vm.surveyId, surveySettings).$promise.then(function (newSettings) {
                angular.copy(newSettings, vm.survey.surveySettings);
                vm.survey.modified = new Date().toISOString();
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                if (error.status === settingConst.httpMethod.preConditionFail) {
                    errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError("Updating survey was not successful.", error);
                }
                spinnerUtilSvc.hideSpinner();
            });
        }

        function publish(action) {
            var publishMessages = {
                success: action + ' survey was successful.',
                fail: action + ' survey was not successful.'
            };
            if (!vm.inviteRespondents) {
                publishSurveyWithoutInvitation();
            } else {
                publishSurveyWithInvitation();
            }

            function publishSurveyWithoutInvitation() {
                spinnerUtilSvc.showSpinner();
                surveyDataSvc.publishSurvey(vm.surveyId).$promise.then(function () {
                    toastr.success(publishMessages.success);
                    surveyTitleAndStatusSvc.updateLatestChangedTimestamp();
                    vm.survey.lastPublished = new Date().toISOString();
                    vm.survey.status = vm.surveyStatus.OPEN;
                    spinnerUtilSvc.hideSpinner();
                }, function (error) {
                    if (error.status === settingConst.httpMethod.preConditionFail) {
                        errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                    } else {
                        errorHandlingSvc.manifestError(error.data || publishMessages.fail, error);
                    }
                    spinnerUtilSvc.hideSpinner();
                });
            }

            function publishSurveyWithInvitation() {
                if (!launchSvc.validateEmail(vm.respondent, highlightEmailAddressesContainer)) return;

                spinnerUtilSvc.showSpinner();
                surveyDataSvc.publishSurvey(vm.surveyId).$promise.then(function () {
                    toastr.success(publishMessages.success);
                    vm.survey.lastPublished = new Date().toISOString();
                    vm.survey.status = vm.surveyStatus.OPEN;
                    var sendingEmailMessages = {
                        success: 'Sending email for this survey was successful.',
                        fail: 'Sending email for this survey was not successful.'
                    };
                    launchDataSvc.sendEmail(vm.surveyId, getSendMessageForm(vm.respondent)).$promise.then(function () {
                        toastr.success(sendingEmailMessages.success);
                        spinnerUtilSvc.hideSpinner();
                    }, function (error) {
                        spinnerUtilSvc.hideSpinner();
                        errorHandlingSvc.manifestError(sendingEmailMessages.fail, error);
                    });
                }, function (error) {
                    if (error.status === settingConst.httpMethod.preConditionFail) {
                        errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                    } else {
                        errorHandlingSvc.manifestError(error.data || publishMessages.fail, error);
                    }
                    spinnerUtilSvc.hideSpinner();
                });
            }
        }

        function getSendMessageForm(emailMessage) {
            return {
                emailAddresses: emailMessage.emailTo,
                subject: emailMessage.subject,
                content: emailMessage.body
            };
        }

        function closeSurvey() {
            $modal.open({
                templateUrl: 'survey/launch/updateSurveyStatusDialog/update-survey-status-dialog.html',
                controller: 'updateSurveyStatusDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    title: function () {
                        return 'Close Survey Confirm';
                    },
                    message: function () {
                        return 'Do you really want to close the survey? This will prevent respondents from answer it.';
                    },
                    type: function () {
                        return 'ClosedSurvey';
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                var status = result.isTemporarilyClosed ? surveySvc.surveyStatus.TEMPORARILY_CLOSED : surveySvc.surveyStatus.CLOSED;
                surveyDataSvc.updateSurveyStatus(vm.surveyId, status).$promise.then(function () {
                    surveyTitleAndStatusSvc.updateLatestChangedTimestamp();
                    vm.survey.status = status;
                }, function (error) {
                    if (error.status === settingConst.httpMethod.preConditionFail) {
                        errorHandlingSvc.writeErrorToConsole('This survey has changed. Please refresh to get the newest data', error);
                        toastr.error('This survey has changed. Please refresh to get the newest data');
                    } else {
                        toastr.error("Closing survey was not successful.");
                    }
                });
            });
        }

        function reopenSurvey() {
            surveyDataSvc.updateSurveyStatus(vm.surveyId, surveySvc.surveyStatus.OPEN).$promise.then(function () {
                surveyTitleAndStatusSvc.updateLatestChangedTimestamp();
                vm.survey.status = vm.surveyStatus.OPEN;
            }, function (error) {
                if (error.status === settingConst.httpMethod.preConditionFail) {
                    errorHandlingSvc.writeErrorToConsole('This survey has changed. Please refresh to get the newest data', error);
                    toastr.error('This survey has changed. Please refresh to get the newest data');
                } else {
                    toastr.error("Reopening survey was not successful.");
                }
            });
        }

        function highlightEmailAddressesContainer(isActive) {
            var emailAddressesContainer = angular.element(document.querySelector('#email-addresses .ui-select-container')),
                emailAddressesSearchContainer = angular.element(document.querySelector('#email-addresses .ui-select-container .ui-select-search'));
            if (isActive) {
                if (emailAddressesContainer) emailAddressesContainer.addClass('input-required');
                if (emailAddressesSearchContainer) emailAddressesSearchContainer.addClass('input-required');
            } else {
                if (emailAddressesContainer) emailAddressesContainer.removeClass('input-required');
                if (emailAddressesSearchContainer) emailAddressesSearchContainer.removeClass('input-required');
            }
        }
    }
})();