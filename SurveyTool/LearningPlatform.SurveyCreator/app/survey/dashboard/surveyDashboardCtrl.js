(function () {
    'use strict';

    angular
        .module('svt')
        .controller('surveyDashboardCtrl', surveyDashboardCtrl);

    surveyDashboardCtrl.$inject = ['$routeParams', '$scope', 'errorHandlingSvc',
        'surveyDashboardDataSvc', 'surveyDashboardSvc', 'spinnerUtilSvc',
        '$timeout', 'testModeSvc', 'surveyMenuSvc'
    ];

    function surveyDashboardCtrl($routeParams, $scope, errorHandlingSvc,
        surveyDashboardDataSvc, surveyDashboardSvc, spinnerUtilSvc,
        $timeout, testModeSvc, surveyMenuSvc) {
        /* jshint -W040 */
        var vm = this;

        vm.surveyId = $routeParams.id;
        vm.responsesStatus = {};
        vm.barChart = {};
        vm.lineChart = {};
        vm.createdDate = vm.lastPublishedDate = vm.modifiedDate = 'N/A';

        vm.init = init;

        vm.init();

        function init() {
            surveyMenuSvc.updateMenuForSurveyDashboard(vm.surveyId);
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);
            onChangeTestMode();

            return;

            function onChangeTestMode() {
                $scope.$watch('vm.testModeSettings.isActive', function () {
                    initDashboardData(vm.surveyId);
                });
            }

            function initDashboardData(surveyId) {
                spinnerUtilSvc.showSpinner();
                surveyDashboardDataSvc.getDashboardData(surveyId, vm.testModeSettings.isActive).$promise.then(function (result) {
                    spinnerUtilSvc.hideSpinner();
                    renderDashboardData(result);
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    renderDashboardData(null);
                    errorHandlingSvc.manifestError('Getting data for dashboard was not successful.', error);
                });

                function renderDashboardData(dashboardData) {
                    vm.responsesStatus = surveyDashboardSvc.renderResponsesStatus(dashboardData);
                    var paddingLeftRight = 15 * 2,
                        pixelForOneCharacter = 10;
                    vm.minResponseNumberWidth = (paddingLeftRight + vm.responsesStatus.maxDataLength * pixelForOneCharacter) + 'px';
                    vm.barChart = surveyDashboardSvc.renderBarChart(dashboardData);
                    vm.lineChart = surveyDashboardSvc.renderLineChart(dashboardData);

                    if (dashboardData) {
                        vm.createdDate = dashboardData.createdDate;
                        vm.lastPublishedDate = dashboardData.lastPublishedDate;
                        vm.modifiedDate = dashboardData.modifiedDate;
                    }
                }
            }
        }
    }
})();