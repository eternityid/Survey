(function () {
    'use trict';

    angular
        .module('svt')
        .controller('deletedSurveyValidatorCtrl', DeletedSurveyValidatorCtrl);

    DeletedSurveyValidatorCtrl.$inject = [
        '$scope', '$routeParams', '$route', 'spinnerUtilSvc',
        'surveyDataSvc', 'navigationRouteConst', '$location', 'surveyEditorSvc'
    ];

    function DeletedSurveyValidatorCtrl($scope, $routeParams, $route, spinnerUtilSvc,
        surveyDataSvc, navigationRouteConst, $location, surveyEditorSvc) {
        var vm = this;

        vm.surveyInfo = null;
        vm.currentOriginalPath = $route.current.$$route.originalPath;
        vm.surveyId = vm.currentOriginalPath === navigationRouteConst.reportDesigner ? $routeParams.surveyId : $routeParams.id;
        vm.navigationRoutes = navigationRouteConst;

        init();

        function init() {
            spinnerUtilSvc.showSpinner();
            return surveyDataSvc.getSurveyInfo(vm.surveyId).$promise.then(function (surveyInfo) {
                spinnerUtilSvc.hideSpinner();
                vm.surveyInfo = surveyInfo;
                surveyEditorSvc.setCurrentSurveyInfo(surveyInfo);
                if (vm.surveyInfo.IsDeleted) {
                    $location.path('/error');
                    return;
                }
            }, function () {
                spinnerUtilSvc.hideSpinner();
                surveyEditorSvc.setCurrentSurveyInfo(null);
                $location.path('/error');
            });
        }
    }
})();