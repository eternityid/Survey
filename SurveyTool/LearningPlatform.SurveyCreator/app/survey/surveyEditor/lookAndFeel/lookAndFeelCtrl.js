(function () {
    angular
        .module('svt')
        .controller('lookAndFeelCtrl', lookAndFeelCtrl);

    lookAndFeelCtrl.$inject = [
        '$scope', 'errorHandlingSvc', 'pushDownSvc',
        'surveyEditorSvc', 'lookAndFeelDataSvc', 'settingConst',
        'spinnerUtilSvc', '$rootScope'
    ];

    function lookAndFeelCtrl(
        $scope, errorHandlingSvc, pushDownSvc,
        surveyEditorSvc, lookAndFeelDataSvc, settingConst,
        spinnerUtilSvc, $rootScope) {
        var survey = surveyEditorSvc.getSurvey();
        var vm = this;

        vm.saveSetting = saveSetting;
        vm.close = closeMe;
        vm.init = init;

        init();

        function init() {
            setupEvents();
            surveyEditorSvc.setSurveyEditMode(true);
            pushDownSvc.setLoadingStatus(true);

            function setupEvents() {
                $scope.$on('$destroy', function () {
                    surveyEditorSvc.setSurveyEditMode(false);
                });

                $scope.$on('event:QuickSaveLookAndFeelSettings', function (event) {
                    vm.saveSetting();
                });
            }
        }

        function saveSetting() {
            $rootScope.$broadcast('event:DoneSurveyLookAndFeel', function (validationResult) {
                if (!validationResult.valid) return;
                saveLookAndFeel(validationResult.lookAndFeelSettings);
            });
            return;

            function saveLookAndFeel(lookAndFeelSettings) {
                spinnerUtilSvc.showSpinner();
                lookAndFeelDataSvc.saveLookAndFeel(survey.id, lookAndFeelSettings).$promise.then(function () {
                    spinnerUtilSvc.hideSpinner();                    

                    $scope.handleAfterSave();
                    vm.close();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status === settingConst.httpMethod.preConditionFail) {
                        errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                    } else {
                        var errorMessage = error.data ? error.data : 'Updating look and feel was not successful';
                        errorHandlingSvc.manifestError(errorMessage, error);
                    }
                });
            }
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }
    }
})();