(function () {
    'use strict';
    angular.module('svt').controller('respondentListCtrl', respondentListCtrl);
    respondentListCtrl.$inject = [
        '$scope', '$routeParams', 'respondentListDataSvc', 'spinnerUtilSvc', '$modal', 'errorHandlingSvc',
        'respondentListSvc', 'pushDownSvc', 'testModeSvc', 'constantSvc',
        'surveyEditorSvc', 'surveyMenuSvc'
    ];

    function respondentListCtrl(
        $scope, $routeParams, respondentListDataSvc, spinnerUtilSvc, $modal, errorHandlingSvc,
        respondentListSvc, pushDownSvc, testModeSvc, constantSvc,
        surveyEditorSvc, surveyMenuSvc) {
        /* jshint -W040 */
        var vm = this;

        vm.pushDownSettings = pushDownSvc.getPushDownSettings();
        vm.respondentsFound = 0;
        vm.surveyId = $routeParams.id;
        vm.filterResponseCollapsed = true;
        vm.respondents = [];
        vm.removableRespondentIds = [];
        vm.questionDictionary = null;

        vm.search = search;
        vm.clear = clear;
        vm.loadMore = loadMore;

        vm.showUploadRespondent = showUploadRespondent;
        vm.handleAfterImportRespondent = handleAfterImportRespondent;
        vm.handleAfterEmailRespondent = handleAfterEmailRespondent;
        vm.handleAfterAddRespondent = handleAfterAddRespondent;

        vm.showEmailEditor = showEmailEditor;
        vm.searchPanelOnKeyPress = searchPanelOnKeyPress;
        vm.showExportResponses = showExportResponses;
        vm.showRespondentDetail = showRespondentDetail;
        vm.showAddRespondent = showAddRespondent;
        vm.changeRespondentMasterCheckbox = changeRespondentMasterCheckbox;
        vm.changeRespondentCheckboxValue = changeRespondentCheckboxValue;
        vm.deleteRespondents = deleteRespondents;
        vm.showRespondentDetailDialog = showRespondentDetailDialog;

        init();
        function init() {
            surveyMenuSvc.updateMenuForSurveyResponses(vm.surveyId);
            vm.respondents.splice(0, vm.respondents.length);
            vm.searchModel = respondentListSvc.getDefaultSearchModel();
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);
            onChangeTestMode();
            getSurveyLatestVersion();
        }

        function onChangeTestMode() {
            $scope.$watch('vm.testModeSettings.isActive', function () {
                vm.search();
            });
        }

        function searchPanelOnKeyPress($event) {
            if ($event.which === 13) {
                vm.search();
                $event.preventDefault();
            }
        }

        function showUploadRespondent() {
            pushDownSvc.showImportRespondent();
        }

        function handleAfterImportRespondent() {
            vm.search();
        }

        function handleAfterEmailRespondent() {
            vm.search();
        }

        function showAddRespondent() {
            pushDownSvc.showAddRespondent();
        }

        function handleAfterAddRespondent() {
            vm.search();
        }

        function search() {
            pushDownSvc.hidePushDown();
            var searchRespondentModel = transferSearchModelFromUIToBackend(vm.searchModel);
            searchRespondentModel.paging = respondentListSvc.getDefaultPaging();
            if (!respondentListSvc.validateSearch(searchRespondentModel)) {
                return;
            }
            vm.respondentsFound = 0;
            vm.respondents.splice(0, vm.respondents.length);

            spinnerUtilSvc.showSpinner();

            respondentListDataSvc.search(vm.surveyId, searchRespondentModel, vm.testModeSettings.isActive).$promise.then(function (response) {
                spinnerUtilSvc.hideSpinner();
                vm.respondents = respondentListSvc.populateRespondents(vm.respondents, response.respondents, vm.surveyId, vm.removableRespondentIds);
                vm.respondentsFound = response.totalRespondentsFound;
                vm.searchModel.paging = respondentListSvc.getDefaultPaging();
                updatePaging(response.respondents.length);
                resetSelectedRespondentList();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Searching respondents was not successful.', error);
            });
        }

        function clear() {
            vm.searchModel = respondentListSvc.getDefaultSearchModel();
            pushDownSvc.hidePushDown();
        }

        function loadMore() {
            spinnerUtilSvc.showSpinner();
            var searchRespondentModel = transferSearchModelFromUIToBackend(vm.searchModel);
            searchRespondentModel.paging = vm.searchModel.paging;
            respondentListDataSvc.search(vm.surveyId, searchRespondentModel, vm.testModeSettings.isActive).$promise.then(function (response) {
                vm.respondents = respondentListSvc.populateRespondents(vm.respondents, response.respondents, vm.surveyId, vm.removableRespondentIds);
                updatePaging(response.respondents.length);
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading more respondens was not successful.', error);
            });
        }

        function transferSearchModelFromUIToBackend(searchModel) {
            return {
                surveyId: searchModel.surveyId,
                email: searchModel.email,
                status: searchModel.status,
                numberSent: searchModel.numberSent.numberFrom,
                numberSentTo: searchModel.numberSent.numberTo,
                numberSentOperator: searchModel.numberSent.conditionOperator,
                lastTimeSent: searchModel.lastTimeSent.datetimeFrom,
                lastTimeSentTo: searchModel.lastTimeSent.datetimeTo,
                lastTimeSentOperator: searchModel.lastTimeSent.conditionOperator,
                completedTimeSentOperator: searchModel.completedTimeSent.conditionOperator,
                completedTimeSent: searchModel.completedTimeSent.datetimeFrom,
                completedTimeSentTo: searchModel.completedTimeSent.datetimeTo,
                customColumns: searchModel.customColumns
            };
        }

        function updatePaging(size) {
            vm.searchModel.paging.start += size;
            vm.searchModel.paging.hashNext = !(size === 0 || vm.respondentsFound === vm.respondents.length);
        }

        function showEmailEditor() {
            if (!respondentListSvc.validateShowingEmailEditor(vm.respondents)) return;

            initEmailData();
            pushDownSvc.showEmailRespondent();
        }

        function initEmailData() {
            vm.emailData = {
                surveyId: vm.surveyId,
                numberOfRespondents: vm.respondentsFound,
                searchModel: angular.copy(vm.searchModel)
            };
        }

        function showExportResponses() {
            pushDownSvc.showExportResponses();
        }

        function showRespondentDetail(respondent) {
            $modal.open({
                templateUrl: 'survey/respondentDetail/respondent-detail.html',
                controller: 'respondentDetailCtrl as vm',
                windowClass: 'respondent-detail-modal-window',
                resolve: {
                    surveyData: function () {
                        return {
                            surveyId: vm.surveyId
                        };
                    },
                    respondentData: function () {
                        return respondent;
                    }
                },
                backdrop: 'static',
                keyboard: false,
                size: 'lg'
            });
        }

        function changeRespondentMasterCheckbox() {
            if (vm.masterCheckboxStatus) {
                vm.removableRespondentIds = [];
                angular.forEach(vm.respondents, function (respondent) {
                    vm.removableRespondentIds.push(respondent.id);
                    respondent.isSelected = true;
                });
            } else {
                resetSelectedRespondentList();
                angular.forEach(vm.respondents, function (respondent) {
                    respondent.isSelected = false;
                });
            }
        }

        function resetSelectedRespondentList() {
            vm.removableRespondentIds = [];
            vm.masterCheckboxStatus = false;
            masterRespondentHTMLNode.prop("indeterminate", false);
        }

        var masterRespondentHTMLNode = angular.element('#masterCheckbox');
        function changeRespondentCheckboxValue(respondentId) {
            var index = vm.removableRespondentIds.indexOf(respondentId);
            if (index > -1) {
                vm.removableRespondentIds.splice(index, 1);
            } else {
                vm.removableRespondentIds.push(respondentId);
            }

            var allSet = vm.removableRespondentIds.length === vm.respondents.length,
                allClear = vm.removableRespondentIds.length === 0;

            if (allSet) {
                vm.masterCheckboxStatus = true;
                masterRespondentHTMLNode.prop("indeterminate", false);
            }
            else if (allClear) {
                vm.masterCheckboxStatus = false;
                masterRespondentHTMLNode.prop("indeterminate", false);
            }
            else {
                vm.masterCheckboxStatus = false;
                masterRespondentHTMLNode.prop("indeterminate", true);
            }
        }

        function deleteRespondents() {
            var confirmMessage = constantSvc.messages.deleteRespondent;
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            message: confirmMessage
                        };
                    }
                }
            }).result.then(function (result) {
                if (result.status) {
                    spinnerUtilSvc.showSpinner();
                    respondentListDataSvc.deleteRespondents(vm.surveyId, vm.removableRespondentIds, vm.testModeSettings.isActive).$promise.then(function () {
                        search();
                        spinnerUtilSvc.hideSpinner();
                    }, function (err) {
                        toastr.error(err.data);
                        spinnerUtilSvc.hideSpinner();
                    });
                }
            });
        }

        function showRespondentDetailDialog(respondentId) {
            $modal.open({
                size: 'lg',
                windowClass: 'respondent-detail-modal-window',
                templateUrl: 'survey/respondentDetailDialog/response-detail-dialog.html',
                controller: 'respondentDetailDialogCtrl',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            surveyId: vm.surveyId,
                            respondentId: respondentId,
                            isTestMode: vm.testModeSettings.isActive,
                            questionDictionary: vm.questionDictionary,
                            surveyIsPublished: surveyEditorSvc.getCurrentSurveyInfo().isPublished
                        };
                    }
                }
            }).result.then(function () { });
        }

        function getSurveyLatestVersion() {
            var surveyInfo = surveyEditorSvc.getCurrentSurveyInfo();
            vm.surveyName = surveyInfo ? surveyInfo.name : '';
            if (surveyInfo && surveyInfo.isPublished) {
                respondentListDataSvc.getSurveyLatestVerion(vm.surveyId).$promise.then(function (result) {
                    vm.questionDictionary = respondentListSvc.buildQuestionDictionary(angular.fromJson(result.surveyVersion));
                }, function (error) {
                    errorHandlingSvc.writeErrorToConsole('Getting survey version was not successful', error);
                });
            }
        }
    }
})();