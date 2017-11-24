(function () {
    'use trict';

    angular.module('svt').controller('rsOpenTextQuestionCtrl', rsOpenTextQuestionCtrl);

    rsOpenTextQuestionCtrl.$inject = [
        '$scope', 'reportDataSvc', 'rsOpenTextQuestionSvc', 'errorHandlingSvc',
        'testModeSvc', 'spinnerUtilSvc', '$timeout', 'settingConst', 'reportConst'
    ];

    function rsOpenTextQuestionCtrl($scope, reportDataSvc, rsOpenTextQuestionSvc, errorHandlingSvc,
        testModeSvc, spinnerUtilSvc, $timeout, settingConst, reportConst) {
        var vm = this;
        vm.allOpenAnswers = [];
        vm.displayedOpenAnswers = [];

        vm.init = init;
        vm.loadResponses = loadResponses;
        vm.displayReportByWidth = displayReportByWidth;
        vm.checkColumnWidthSelected = checkColumnWidthSelected;
        vm.pagingLevel = reportConst.paging;
        init();

        function init() {
            vm.isDateQuestion = $scope.aggregatedQuestion.questionType === settingConst.questionTypes.DateQuestionDefinition.code;
            vm.totalRespondents = $scope.aggregatedQuestion.numberOfRespondents;
            vm.totalResponses = $scope.aggregatedQuestion.numberOfResponses;
            vm.testModeSettings = testModeSvc.getTestModeSettings($scope.surveyId);

            var maximumConst = -1;
            var limitConst = reportConst.paging.level1;
            var esQuestionName = vm.isDateQuestion ? $scope.questionKey + ':date' : $scope.questionKey;

            reportDataSvc.getDataForTable($scope.surveyId, esQuestionName, maximumConst, vm.testModeSettings.isActive).$promise.then(function (result) {
                rsOpenTextQuestionSvc.buildTable(vm.allOpenAnswers, result);
                loadResponses(limitConst);
            }, function (error) {
                errorHandlingSvc.writeErrorToConsole('Getting reporting data for table was not successful.', error);
            });
        }

        function displayReportByWidth(columnWidth) {
            var questionSetting = {
                surveyId: $scope.surveyId,
                questionAlias: $scope.aggregatedQuestion.questionName,
                chartType: 'Table',
                displaySummaryTabular: vm.isDisplaySummaryTabular,
                dolumnWidth: columnWidth,
                reportPageId: $scope.reportPageId
            };

            spinnerUtilSvc.showSpinner();
            reportDataSvc.updateQuestionViewChart(questionSetting.surveyId, questionSetting).$promise.then(function () {
                $scope.columnWidth = columnWidth;
                spinnerUtilSvc.hideSpinner();
                $timeout(function () {
                    loadResponses(10);
                    $(window).resize();
                }, 0);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Updating SummaryTabular status was not successful.', error);
            });
        }

        function loadResponses(limit) {
            if (vm.allOpenAnswers.length === 0)
                return;

            var startFrom = 0;
            vm.displayedOpenAnswers = vm.allOpenAnswers.slice(startFrom, limit);
        }
        function checkColumnWidthSelected(columnWidth) {
            return $scope.aggregatedQuestion.questionSetting.columnWidth === columnWidth;
        }

    }
})();