(function () {
    angular
        .module('svt')
        .controller('importSurveyCtrl', importSurveyCtrl);

    importSurveyCtrl.$inject = [
        '$scope', '$window', 'pushDownSvc', 'importSurveySvc',
        'surveyDataSvc', 'surveyEditorSvc', 'spinnerUtilSvc'
    ];

    function importSurveyCtrl($scope, $window, pushDownSvc, importSurveySvc,
        surveyDataSvc, surveyEditorSvc, spinnerUtilSvc) {
        var vm = this;

        init();

        function init() {
            vm.placeHolders = importSurveySvc.getPlaceHolders();
            vm.surveyViewModel = {
                title: null,
                file: null
            };

            vm.handleAfterSave = $scope.handleAfterSave;
            vm.importSurvey = importSurvey;
            vm.close = closePushDown;
            pushDownSvc.setLoadingStatus(true);

            return;
        }

        function closePushDown() {
            pushDownSvc.hidePushDown();
        }

        function importSurvey() {
            if (!importSurveySvc.validate(vm.surveyViewModel, vm.placeHolders)) return;

            spinnerUtilSvc.showSpinner();
            surveyDataSvc.importSurvey(vm.surveyViewModel).$promise.then(function (response) {
                spinnerUtilSvc.hideSpinner();

                vm.handleAfterSave();
                closePushDown();
                $window.location.href = '#/surveys/' + response.surveyId + '/designer';                
            }, function () {
                toastr.error('Invalid survey data.'); //TODO need to validate survey data
                spinnerUtilSvc.hideSpinner();
            });
        }

    }
})();