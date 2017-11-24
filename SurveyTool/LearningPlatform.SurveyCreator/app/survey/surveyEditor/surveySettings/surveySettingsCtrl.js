(function () {
    angular
        .module('svt')
        .controller('surveySettingsCtrl', SurveySettingsCtrl);

    SurveySettingsCtrl.$inject = [
        '$scope', 'errorHandlingSvc', 'surveySettingsSvc',
        'surveyEditorSvc', 'settingConst', 'pushDownSvc', 'spinnerUtilSvc', 'surveyDataSvc'
    ];

    function SurveySettingsCtrl(
        $scope, errorHandlingSvc, surveySettingsSvc,
        surveyEditorSvc, settingConst, pushDownSvc, spinnerUtilSvc, surveyDataSvc) {
        /* jshint -W040 */
        var vm = this;

        vm.save = save;
        vm.close = closeMe;

        init();

        function init() {
            setupModelData();
            setupOnDestroy();
            surveyEditorSvc.setSurveyEditMode(true);
            pushDownSvc.setLoadingStatus(true);
            return;

            function setupModelData() {
                vm.placeHolders = surveySettingsSvc.getPlaceHolders();
                spinnerUtilSvc.showSpinner();
                surveyDataSvc.getSurveyBrief($scope.surveyId).$promise.then(function (shallowSurvey) {
                    spinnerUtilSvc.hideSpinner();
                    vm.surveySettings = shallowSurvey.surveySettings;
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    vm.surveySettings = {};
                    toastr.error('Loading survey settings was not successful');
                });
            }

            function setupOnDestroy() {
                $scope.$on('$destroy', function () {
                    surveyEditorSvc.setSurveyEditMode(false);
                });
            }
        }

        function save() {
            if (!surveySettingsSvc.validateSurveySettings(vm.surveySettings, vm.placeHolders)) return;

            var updateMessages = {
                fail: 'Updating survey was not successful.'
            };

            spinnerUtilSvc.showSpinner();
            surveyDataSvc.updateSurveySettings($scope.surveyId, vm.surveySettings).$promise.then(function () {
                spinnerUtilSvc.hideSpinner();

                handleAfterSave();
                vm.close();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status === settingConst.httpMethod.preConditionFail) {
                    errorHandlingSvc.manifestError('This survey has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError(updateMessages.fail, error);
                }
            });
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }

        function handleAfterSave() {
            $scope.handleAfterSave();
        }
    }
})();