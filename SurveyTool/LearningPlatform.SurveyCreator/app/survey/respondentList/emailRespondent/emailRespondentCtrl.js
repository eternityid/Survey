(function () {
    'use strict';

    angular
        .module('svt')
        .controller('emailRespondentCtrl', emailRespondentCtrl);

    emailRespondentCtrl.$inject = [
        '$scope', 'respondentListDataSvc', 'emailRespondentSvc', 'errorHandlingSvc', 'pushDownSvc', 'spinnerUtilSvc',
        'testModeSvc', 'surveyEditorSvc'
    ];

    function emailRespondentCtrl($scope, respondentListDataSvc, emailRespondentSvc, errorHandlingSvc, pushDownSvc, spinnerUtilSvc,
        testModeSvc, surveyEditorSvc) {
        /* jshint -W040 */
        var vm = this;

        vm.svtCkeditorConfig = {
            extraPlugins: 'svtinserthelper,svtrespondentplaceholder,svtsurveylink,svtinsertfromfilelibrary',
            svtData: {
                placeholderRespondentItems: []
            }
        };

        vm.send = send;
        vm.close = closeMe;

        init();

        function init() {
            vm.surveyId = $scope.emailData.surveyId;
            vm.emailMessage = emailRespondentSvc.getEmailMessage($scope.emailData.numberOfRespondents);
            vm.placeHolders = emailRespondentSvc.getPlaceHolders();
            vm.isSending = false;
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);

            pushDownSvc.setLoadingStatus(true);
            vm.svtCkeditorConfig.svtData.placeholderRespondentItems = surveyEditorSvc.getSvtPlaceholderRespondentItems();
        }

        function send() {
            if (!emailRespondentSvc.validateEmail(vm.emailMessage, vm.placeHolders)) {
                if (!vm.placeHolders.subject.valid) {
                    toastr.error(vm.placeHolders.subject.value);
                } else if (!vm.placeHolders.content.valid) {
                    toastr.error(vm.placeHolders.content.value);
                }
                return;
            }
            spinnerUtilSvc.showSpinner();
            respondentListDataSvc.sendEmail($scope.emailData.surveyId, emailRespondentSvc.getSendRespondentForm(vm.emailMessage, $scope.emailData.searchModel), vm.testModeSettings.isActive).$promise.then(
                function () {                    
                    $scope.handleAfterSend();
                    spinnerUtilSvc.hideSpinner();
                    vm.close();
                },
                function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError(error ? error.data : 'Sending emails was not successful', error);
                }
            );
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }
    }
})();