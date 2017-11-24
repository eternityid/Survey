(function () {
    angular
        .module('svt')
        .controller('librarySurveyListCtrl', librarySurveyListCtrl);

    librarySurveyListCtrl.$inject = [
        '$scope', 'libraryDataSvc', 'spinnerUtilSvc', '$modal', 'stringUtilSvc',
        'errorHandlingSvc'
    ];

    function librarySurveyListCtrl($scope, libraryDataSvc, spinnerUtilSvc, $modal, stringUtilSvc,
        errorHandlingSvc) {
        var vm = this;

        vm.totalSurveys = 0;
        vm.surveys = null;
        vm.lastSearchTerm = null;
        vm.defaultLimit = 10;
        vm.defaultOffset = 0;

        vm.deleteSurvey = deleteSurvey;
        vm.duplicateSurvey = duplicateSurvey;
        vm.openSurveyEditor = openSurveyEditor;
        vm.loadMoreSurveys = loadMoreSurveys;

        init();

        function init() {
            loadSurveysWithNewSearchTerm();
            $scope.$on('event:surveyLibraryManagementOnSearch', loadSurveysWithNewSearchTerm);
        }

        function loadSurveysWithNewSearchTerm() {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.searchSurveys($scope.searchTerm, vm.defaultLimit, vm.defaultOffset).$promise.then(function (response) {
                vm.lastSearchTerm = $scope.searchTerm;
                vm.totalSurveys = response.totalSurveys;
                vm.surveys = response.surveys;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading surveys was not successful', error);
            });
        }

        function duplicateSurvey(survey) {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.duplicateSurvey(survey.id).$promise.then(function (response) {
                vm.surveys.unshift(response);
                vm.totalSurveys++;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Duplicating survey was not successful', error);
            });
        }

        function deleteSurvey(survey, surveyIndex) {
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            message: 'Do you want to delete survey <strong>"' + stringUtilSvc.getPlainText(survey.title) + '"</strong>?'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
                libraryDataSvc.deleteSurvey(survey.id).$promise.then(function () {
                    vm.surveys.splice(surveyIndex, 1);
                    vm.totalSurveys--;
                    spinnerUtilSvc.hideSpinner();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError('Deleting survey was not successful', error);
                });
            });
        }

        function openSurveyEditor(survey) {
            $modal.open({
                templateUrl: 'survey/surveyLibraryManagement/editLibrarySurveyModal/edit-library-survey-modal.html',
                controller: 'editLibrarySurveyModalCtrl',
                size: 'lg',
                windowClass: 'edit-survey-library-modal',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            survey: angular.copy(survey)
                        };
                    }
                }
            }).result.then(function (result) {
                survey.title = result.title;
                survey.lastModifiedDateTime = new Date();
            });
        }

        function loadMoreSurveys() {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.searchSurveys(vm.lastSearchTerm, vm.defaultLimit, vm.surveys.length).$promise.then(function (response) {
                vm.surveys.push.apply(vm.surveys, response.surveys);
                vm.totalSurveys = response.totalSurveys;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading surveys was not successful', error);
            });
        }
    }
})();