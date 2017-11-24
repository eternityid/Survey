(function () {
    'use strict';

    angular
        .module('svt')
        .controller('surveysCtrl', surveysCtrl);

    surveysCtrl.$inject = [
        'surveyDataSvc', '$scope', 'errorHandlingSvc',
        'surveyListSvc', 'surveySvc', 'pushDownSvc', 'exportSurveySvc',
        'spinnerUtilSvc', '$modal', 'constantSvc', 'errorCode', 'libraryDataSvc',
        'authSvc', 'surveyMenuSvc'
    ];

    function surveysCtrl(
        surveyDataSvc, $scope, errorHandlingSvc,
        surveyListSvc, surveySvc, pushDownSvc, exportSurveySvc,
        spinnerUtilSvc, $modal, constantSvc, errorCode, libraryDataSvc,
        authSvc, surveyMenuSvc) {
        /* jshint -W040 */
        var vm = this;

        vm.surveysFound = 0;
        vm.searchString = '';
        vm.surveys = [];

        vm.showCreateNewSurvey = showCreateNewSurvey;
        vm.search = search;
        vm.loadMore = loadMore;
        vm.onSearchKeyPress = onSearchKeyPress;
        vm.status = surveySvc.surveyStatus;
        vm.handleAfterCreateSurvey = handleAfterCreateSurvey;
        vm.pushDownSettings = pushDownSvc.getPushDownSettings();
        vm.showImportSurvey = showImportSurvey;
        vm.handleAfterImportSurvey = handleAfterImportSurvey;
        vm.duplicateSurvey = duplicateSurvey;
        vm.addSurveyToLibrary = addSurveyToLibrary;
        vm.exportSurvey = exportSurvey;
        vm.deleteSurvey = deleteSurvey;
        vm.restoreSurvey = restoreSurvey;
        vm.getSurveyStatusClass = getSurveyStatusClass;
        vm.getDisplayedStatus = getDisplayedStatus;
        vm.doQuickSearch = doQuickSearch;
        vm.doAdvancedSearch = doAdvancedSearch;
        vm.setDefaultValueForSearchModel = setDefaultValueForSearchModel;
        vm.changeSelectStatus = changeSelectStatus;
        vm.changeCheckAll = changeCheckAll;

        init();

        function init() {
            surveyMenuSvc.updateMenuForSurveyList();
            vm.filterSurveyCollapsed = true;
            $scope.searchStatusForCheckBoxList = surveyListSvc.getSearchStatusForCheckBoxList();

            vm.paging = surveyListSvc.getDefaultPaging();
            vm.searchModel = surveyListSvc.getDefaultSearchModel();
            vm.latestSearchModel = angular.copy(vm.searchModel);
            vm.isAdvancedSearch = false;
            vm.checkAll = true;
            setStatusValue(true);
            vm.search();
        }

        function setStatusValue(value) {
            vm.searchModel.status.Closed = value;
            vm.searchModel.status.New = value;
            vm.searchModel.status.Open = value;
            vm.searchModel.status.TemprorarilyClosed = value;
        }

        function showCreateNewSurvey() {
            pushDownSvc.showCreateNewSurvey();
        }

        function handleAfterCreateSurvey() {
            vm.search();
        }

        function showImportSurvey() {
            pushDownSvc.showImportSurvey();
        }

        function handleAfterImportSurvey() {
            vm.search();
        }

        function setDefaultValueForSearchModel() {
            vm.searchStatusModel = surveyListSvc.getDefaultForSearchStatusModel();
            vm.searchModel = angular.copy(surveyListSvc.getDefaultSearchModel());
            vm.latestSearchModel = angular.copy(vm.searchModel);
        }

        function search() {
            var searchData = surveyListSvc.buildSearchSurveysModel(vm.searchModel);
            if (vm.isAdvancedSearch && !surveyListSvc.validateSearchData(searchData)) return;

            vm.paging = surveyListSvc.getDefaultPaging();
            spinnerUtilSvc.showSpinner();
            surveyDataSvc.search(surveyListSvc.getSearchForm(searchData, vm.paging)).$promise.then(function (response) {
                vm.surveys = response.surveys;
                populateSurveyMetaData(vm.surveys);
                vm.surveysFound = response.totalSurveys;
                updatePaging(response.surveys.length);
                vm.latestSearchModel = angular.copy(vm.searchModel);

                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status !== errorCode.Unauthorized) {
                    errorHandlingSvc.manifestError('Searching surveys was not successful', error);
                }
            });
        }

        function loadMore() {
            var searchData = surveyListSvc.buildSearchSurveysModel(vm.latestSearchModel);
            spinnerUtilSvc.showSpinner();
            surveyDataSvc.search(surveyListSvc.getSearchForm(searchData, vm.paging)).$promise.then(function (response) {
                populateSurveyMetaData(response.surveys);
                vm.surveys.push.apply(vm.surveys, response.surveys);
                updatePaging(response.surveys.length);

                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading more surveys was not successful', error);
            });
        }

        function populateSurveyMetaData(surveys) {
            var loginData = authSvc.getLoginData();
            if (!loginData) return;

            surveys.forEach(function (survey) {
                var isSurveyOwner = survey.userId === loginData.userId;
                var isUserHaveFullPermission = survey.accessRights && survey.accessRights.full.indexOf(loginData.userId) >= 0;
                if (isSurveyOwner || isUserHaveFullPermission) {
                    survey.isUserHaveFullPermission = true;
                }
            });
        }

        function updatePaging(size) {
            vm.paging.start += size;
            if (size === 0 || vm.surveysFound === vm.surveys.length) {
                vm.paging.hashNext = false;
            } else {
                vm.paging.hashNext = true;
            }
        }

        function onSearchKeyPress($event, isAdvancedSearch) {
            if ($event.which === 13) {
                vm.isAdvancedSearch = isAdvancedSearch;
                vm.search();
                $event.preventDefault();
            }
        }

        function duplicateSurvey(surveyId) {
            spinnerUtilSvc.showSpinner();
            surveyDataSvc.duplicateSurvey(surveyId).$promise.then(function () {
                vm.search();
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status !== errorCode.Unauthorized) {
                    errorHandlingSvc.manifestError(error.data || 'Duplicate survey was not successful', error);
                }
            });
        }

        function addSurveyToLibrary(surveyId) {
            var addLibraryMessage = {
                fail: 'Adding survey to library was not successful.',
                success: 'Adding survey to library was successful.'
            };

            spinnerUtilSvc.showSpinner();
            libraryDataSvc.addSurvey(surveyId).$promise.then(function () {
                spinnerUtilSvc.hideSpinner();
                toastr.success(addLibraryMessage.success);
            }, function () {
                spinnerUtilSvc.hideSpinner();
                toastr.error(addLibraryMessage.fail);
            });
        }

        function deleteSurvey(survey) {
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            message: constantSvc.messages.deleteSurvey + survey.title + '?'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
                surveyDataSvc.deleteSurvey(survey.id).$promise.then(function () {
                    spinnerUtilSvc.hideSpinner();
                    search();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status !== errorCode.Unauthorized) {
                        errorHandlingSvc.manifestError('Deleting survey was not successful', error);
                    }
                });
            });
        }

        function restoreSurvey(survey) {
            spinnerUtilSvc.showSpinner();
            surveyDataSvc.restoreSurvey(survey.id).$promise.then(function () {
                spinnerUtilSvc.hideSpinner();
                search();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status !== errorCode.Unauthorized) {
                    errorHandlingSvc.manifestError('Restoring survey was not successful', error);
                }
            });
        }

        function exportSurvey(survey) {
            spinnerUtilSvc.showSpinner();
            surveyDataSvc.exportSurvey(survey.id).$promise.then(function (result) {
                exportSurveySvc.buildFile(result.data, survey.title);
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status !== errorCode.Unauthorized) {
                    errorHandlingSvc.manifestError('Export survey was not successful', error);
                }
            });
        }

        function getSurveyStatusClass(survey) {
            if (survey.isDeleted) return "survey-status--deleted";
            switch (survey.status) {
                case vm.status.NEW: return "survey-status--new";
                case vm.status.OPEN: return "survey-status--open";
                case vm.status.CLOSED: return "survey-status--close";
                case vm.status.TEMPORARILY_CLOSED: return "survey-status--temporarily-close";
                default: return "";
            }
        }

        function getDisplayedStatus(survey) {
            return survey.isDeleted ? "Deleted" : surveySvc.getStatusDisplay(survey.status);
        }

        function doQuickSearch() {
            vm.isAdvancedSearch = false;
            vm.search();
        }

        function doAdvancedSearch() {
            vm.isAdvancedSearch = true;
            vm.search();
        }

        function changeSelectStatus() {
            $scope.$watch(function () {
                var checkArray = [vm.searchModel.status.Closed, vm.searchModel.status.New, vm.searchModel.status.Open, vm.searchModel.status.TemprorarilyClosed];
                if (checkArray.indexOf(false) < 0) {
                    vm.checkAll = true;
                    document.getElementById('check-all').indeterminate = false;
                    return;
                }
                if (checkArray.indexOf(true) < 0) {
                    vm.checkAll = false;
                    document.getElementById('check-all').indeterminate = false;
                    return;
                }
                document.getElementById('check-all').indeterminate = true;
            }, true);
        }

        function changeCheckAll() {
            vm.checkAll = !vm.checkAll;
            if (vm.checkAll) setStatusValue(true);
            else setStatusValue(false);
        }

    }
})();