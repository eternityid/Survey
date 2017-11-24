(function () {
    'use strict';

    angular
        .module('svt')
        .controller('reportsCtrl', reportsCtrl);

    reportsCtrl.$inject = ['$scope', 'errorHandlingSvc', 'reportListSvc',
        'reportListDataSvc', 'pushDownSvc', 'spinnerUtilSvc', '$q', 'surveyDataSvc',
        'surveyMenuSvc'
    ];

    function reportsCtrl($scope, errorHandlingSvc, reportListSvc,
        reportListDataSvc, pushDownSvc, spinnerUtilSvc, $q, surveyDataSvc,
        surveyMenuSvc) {
        /* jshint -W040 */
        var vm = this;

        vm.reportsFound = 0;
        vm.searchString = '';

        vm.pushDownSettings = pushDownSvc.getPushDownSettings();

        vm.createReport = createReport;
        vm.handleAfterCreateReport = handleAfterCreateReport;

        vm.search = search;
        vm.loadMoreReports = loadMoreReports;
        vm.updatePaging = updatePaging;
        vm.searchByEnter = searchByEnter;
        vm.isNotDeletedSurveyById = isNotDeletedSurveyById;

        init();

        function init() {
            surveyMenuSvc.updateMenuForReportList();
            vm.reports = reportListSvc.getDefaultReports();
            vm.paging = reportListSvc.getDefaultPaging();
            vm.notDeletedSurveys = [];

            var searchModel = getSearchModel();
            spinnerUtilSvc.showSpinner();

            $q.all([reportListDataSvc.search(searchModel).$promise, surveyDataSvc.getSurveyList().$promise]).then(function (responses) {
                spinnerUtilSvc.hideSpinner();
                vm.reports = reportListSvc.populateReports(responses[0].reports, vm.reports);
                vm.reportsFound = responses[0].totalReportsFound;
                updatePaging(responses[0].reports.length);

                vm.notDeletedSurveys = responses[1];
            }, function () {
                spinnerUtilSvc.hideSpinner();
                toastr.error("Loading reports was not successful");
            });
        }

        function createReport() {
            vm.editor = {
                isAdd: true,
                report: {
                    name: '',
                    surveyId: ''
                }
            };

            pushDownSvc.showCreateReport();
        }

        function handleAfterCreateReport() {
            vm.search();
        }

        function search() {
            vm.reports = reportListSvc.getDefaultReports();
            vm.paging = reportListSvc.getDefaultPaging();
            var searchModel = getSearchModel();
            spinnerUtilSvc.showSpinner();
            reportListDataSvc.search(searchModel).$promise.then(function (response) {
                spinnerUtilSvc.hideSpinner();
                vm.reports = reportListSvc.populateReports(response.reports, vm.reports);
                vm.reportsFound = response.totalReportsFound;
                updatePaging(response.reports.length);
            }, function () {
                spinnerUtilSvc.hideSpinner();
                toastr.error("Loading reports was not successful");
            });
        }

        function getSearchModel() {
            return {
                reportName: vm.searchString,
                start: vm.paging.start,
                limit: vm.paging.limit
            };
        }

        function loadMoreReports() {
            spinnerUtilSvc.showSpinner();
            reportListDataSvc.search(getSearchModel()).$promise.then(function (response) {
                spinnerUtilSvc.hideSpinner();
                vm.reports = reportListSvc.populateReports(response.reports, vm.reports);
                vm.reportsFound = response.totalReportsFound;
                updatePaging(response.reports.length);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading more reports was not successful', error);
            });
        }

        function updatePaging(size) {
            vm.paging.start += size;
            if (size === 0 || vm.reportsFound === vm.reports.data.length) {
                vm.paging.hashNext = false;
            } else {
                vm.paging.hashNext = true;
            }
        }

        function searchByEnter($event) {
            if ($event.which === 13) {
                vm.search();
            }
        }

        function isNotDeletedSurveyById(surveyId) {
            var temp = vm.notDeletedSurveys.filter(function (survey) {
                return survey.id === surveyId;
            });
            return temp.length > 0;
        }
    }
})();