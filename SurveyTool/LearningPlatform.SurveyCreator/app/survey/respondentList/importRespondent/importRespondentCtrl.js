(function () {
    angular
        .module('svt')
        .controller('importRespondentCtrl', importRespondentCtrl);

    importRespondentCtrl.$inject = [
        '$scope', 'pushDownSvc', 'respondentListDataSvc', 'importRespondentSvc', 'testModeSvc', '$location', 'surveyDataSvc', 'surveyEditorSvc'];

    function importRespondentCtrl(
        $scope, pushDownSvc, respondentListDataSvc, importRespondentSvc, testModeSvc, $location, surveyDataSvc, surveyEditorSvc) {
        var vm = this;

        init();

        function init() {
            vm.surveyId = $scope.surveyId;
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);
            vm.respondentFile = null;
            vm.close = closeMe;
            vm.uploadFile = uploadFile;
            vm.disablebImportButton = true;

            pushDownSvc.setLoadingStatus(true);
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }

        function uploadFile(result) {
            if (!result || !importRespondentSvc.validateRespondentFile(vm.respondentFile)) return;

            respondentListDataSvc.importContacts(vm.surveyId, vm.respondentFile.uploadedFileName, vm.testModeSettings.isActive).$promise.then(function () {
                surveyDataSvc.getSurveyInfo(vm.surveyId).$promise.then(function (surveyInfo) {                    
                    surveyEditorSvc.setCurrentSurveyInfo(surveyInfo);
                    $scope.handleAfterSave();
                    vm.close();
                }, function () {
                    surveyEditorSvc.setCurrentSurveyInfo(null);
                    $location.path('/error');
                });
            }, function (error) {
                toastr.error(error.data.message, 'Importing contacts was not successful.');
            });
        }

    }
})();