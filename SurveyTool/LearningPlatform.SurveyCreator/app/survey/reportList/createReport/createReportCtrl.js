(function () {
    angular
        .module('svt')
        .controller('createReportCtrl', CreateReportCtrl);

    CreateReportCtrl.$inject = [
        '$window', '$scope', 'errorHandlingSvc', 'pushDownSvc', 'reportListSvc',
        'surveyDataSvc', 'createReportSvc', 'reportListDataSvc', 'spinnerUtilSvc'
    ];

    function CreateReportCtrl(
        $window, $scope, errorHandlingSvc, pushDownSvc, reportListSvc,
        surveyDataSvc, createReportSvc, reportListDataSvc, spinnerUtilSvc) {
        var vm = this;

        vm.editor = $scope.editor;
        vm.handleAfterSave = $scope.handleAfterSave;
        vm.placeHolders = createReportSvc.getPlaceHolders();

        vm.loadSurveys = loadSurveys;
        vm.close = closeMe;
        vm.selectSurvey = selectSurvey;
        vm.save = save;
        vm.onReportKeypress = onReportKeypress;

        init();

        function init() {
            loadSurveys();
        }

        function selectSurvey(survey) {
            vm.editor.report.surveyId = survey.id;
            vm.editor.report.surveyName = survey.title;
        }

        function loadSurveys() {
            spinnerUtilSvc.showSpinner();
            surveyDataSvc.getSurveyList().$promise.then(function (response) {
                vm.surveys = response;
                spinnerUtilSvc.hideSpinner();
                pushDownSvc.setLoadingStatus(true);
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Getting surveys was not successful', error);
            });
        }

        function onReportKeypress(event) {
            if (event.which === 13) {
                save();
                event.preventDefault();
            }
        }

        function save() {
            if (!createReportSvc.validate(vm.editor, vm.placeHolders)) return;

            if (vm.editor.isAdd) {
                addNewReport();
            } else {
                editReport();
            }
            return;

            function addNewReport() {
                var message = {
                    failure: 'Creating report was not successful.'
                };
                spinnerUtilSvc.showSpinner();
                var reportDefinition = {
                    name: vm.editor.report.name,
                    surveyId: vm.editor.report.surveyId
                };
                reportListDataSvc.addReport(reportDefinition).$promise.then(function (response) {
                    spinnerUtilSvc.hideSpinner();

                    vm.handleAfterSave();
                    pushDownSvc.hidePushDown();
                    $window.location.href = '#/reports/' + response.id + '/designer/' + response.surveyId;
                }, function(error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError(message.failure, error);
                });
            }

            function editReport() {
                var message = {
                    failure: 'Updating report was not successful.'
                };
                spinnerUtilSvc.showSpinner();
                var reportDefinition = {
                    name: vm.editor.report.name,
                    id: vm.editor.report.id
                };
                reportListDataSvc.editReport(reportDefinition).$promise.then(function () {
                    spinnerUtilSvc.hideSpinner();

                    vm.handleAfterSave();
                    pushDownSvc.hidePushDown();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError(message.failure, error);
                });
            }
        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }
    }
})();