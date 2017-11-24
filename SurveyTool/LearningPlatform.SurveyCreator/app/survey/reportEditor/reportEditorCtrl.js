(function () {
    'use strict';

    angular
        .module('svt')
        .controller('reportEditorCtrl', reportEditorCtrl);

    reportEditorCtrl.$inject = [
       '$routeParams', 'reportPageSvc', 'reportPageDataSvc', '$scope', 'reportEditorSvc', 'spinnerUtilSvc',
       'angularScopeUtilSvc', 'pushDownSvc', 'testModeSvc', 'surveyMenuSvc'
    ];

    function reportEditorCtrl(
       $routeParams, reportPageSvc, reportPageDataSvc, $scope, reportEditorSvc, spinnerUtilSvc,
       angularScopeUtilSvc, pushDownSvc, testModeSvc, surveyMenuSvc) {
        /* jshint -W040 */

        var vm = this;

        vm.loadReport = loadReport;
        vm.showReportEditor = showReportEditor;
        vm.handleAfterEditReport = handleAfterEditReport;
        vm.onMouseDownReportEditorPage = onMouseDownReportEditorPage;

        init();

        function init() {
            vm.reportId = $routeParams.id;
            vm.surveyId = $routeParams.surveyId;
            vm.sortableOptions = {
                orderChanged: function (event) {
                    movePage(event);
                    $(window).resize();
                },
                containment: 'body',
                accept: function (sourceItemHandleScope) {
                    return (sourceItemHandleScope.itemScope.page) ? true : false;
                }
            };
            vm.pushDownSettings = pushDownSvc.getPushDownSettings();
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);

            surveyMenuSvc.updateMenuForReport();

            reportEditorSvc.setWorkingScreenOnPage(true);

            onChangeTestMode();
            return;

            function onChangeTestMode() {
                $scope.$watch('vm.testModeSettings.isActive', function () {
                    vm.loadReport();
                });
            }

            function movePage(event) {
                var movingPage = reportEditorSvc.buildMovingPage(event),
                    pageId = event.source.itemScope.page.id;

                spinnerUtilSvc.showSpinner();
                reportPageDataSvc.movePage(movingPage).$promise.then(function (response) {
                    if (!response.status) {
                        spinnerUtilSvc.hideSpinner();
                        return;
                    }
                    reportPageSvc.updatePositionsForCurrentPages(pageId, event.source.index, event.dest.index);
                    spinnerUtilSvc.hideSpinner();
                }, function () {
                    spinnerUtilSvc.hideSpinner();
                    toastr.error('Moving page was not successful.');
                });
            }
        }

        function loadReport() {
            spinnerUtilSvc.showSpinner();
            reportPageDataSvc.getAllByReportId(vm.reportId, vm.testModeSettings.isActive).$promise.then(function (data) {
                vm.reportName = data.name;
                vm.surveyName = data.data ? data.data.surveyName : 'N/A';
                vm.reportDisplayName = vm.reportName + ' (' + vm.surveyName + ')';

                reportPageSvc.setCurrentPages(reportEditorSvc.mapReportPages(data.pages));
                vm.pages = reportPageSvc.getCurrentPages();
                reportEditorSvc.setReportData({
                    dataRespondents: data.data,
                    openTextRespondents: data.openTextRespondents,
                    questions: reportEditorSvc.mapReportQuestions(data.questions)
                });

                spinnerUtilSvc.hideSpinner();
            }, function () {
                spinnerUtilSvc.hideSpinner();
                toastr.error('Loading report was not successful.');
            });
        }

        function showReportEditor() {
            vm.editor = {
                isAdd: false,
                report: {
                    name: vm.reportName,
                    id: vm.reportId
                }
            };

            pushDownSvc.showCreateReport();
        }

        function handleAfterEditReport() {
            vm.reportName = vm.editor.report.name;
            vm.reportDisplayName = vm.reportName + ' (' + vm.surveyName + ')';
        }

        function onMouseDownReportEditorPage(event) {
            if (reportEditorSvc.getWorkingScreen().onPage) {
                reportPageSvc.setDeselectedElementId(reportPageSvc.getWorkingElementIds().selected);
                reportPageSvc.setSelectedElementId(0);
                angularScopeUtilSvc.safeApply($scope);
            }
            if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        }
    }
})();