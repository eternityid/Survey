(function () {
    angular
        .module('svt')
        .controller('exportSurveyCtrl', exportSurveyCtrl);

    exportSurveyCtrl.$inject = [
        '$scope', 'pushDownSvc', 'surveyDataSvc',
        'exportSurveySvc', 'surveyEditorSvc', 'spinnerUtilSvc'
    ];

    function exportSurveyCtrl($scope, pushDownSvc, surveyDataSvc,
        exportSurveySvc, surveyEditorSvc, spinnerUtilSvc) {
        var vm = this;

        vm.exportSurvey = exportSurvey;
        vm.close = closePushDown;

        init();

        function init() {
            surveyEditorSvc.setSurveyEditMode(true);
            pushDownSvc.setLoadingStatus(true);

            $scope.$on('$destroy', function () {
                surveyEditorSvc.setSurveyEditMode(false);
            });
        }

        function exportSurvey() {
            var exportMessages = {
                failed: 'Exporting survey was not successful'
            };

            spinnerUtilSvc.showSpinner();
            surveyDataSvc.exportSurvey($scope.surveyId).$promise.then(function (result) {
                spinnerUtilSvc.hideSpinner();

                exportSurveySvc.buildFile(result.data, $scope.surveyName);
                vm.close();
            }, function (error) {
                var errorMessage = angular.isObject(error.data) ?
                    error.data.data : (error.data || exportMessages.fail);
                toastr.error(errorMessage);
                spinnerUtilSvc.hideSpinner();
            });
        }

        function closePushDown() {
            pushDownSvc.hidePushDown();
        }

    }
})();