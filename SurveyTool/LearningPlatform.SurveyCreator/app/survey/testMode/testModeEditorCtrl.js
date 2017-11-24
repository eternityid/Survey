(function () {
    angular
        .module('svt')
        .controller('testModeEditorCtrl', testModeEditorCtrl);

    testModeEditorCtrl.$inject = [
        '$scope', 'testModeSvc', '$routeParams', 'pushDownSvc', 'respondentListSvc',
        'respondentListDataSvc', 'spinnerUtilSvc', '$timeout', 'errorHandlingSvc', '$modal',
        'constantSvc', 'respondentDetailDialogDataSvc', 'surveyEditorSvc', 'surveyMenuSvc'
    ];

    function testModeEditorCtrl(
        $scope, testModeSvc, $routeParams, pushDownSvc, respondentListSvc,
        respondentListDataSvc, spinnerUtilSvc, $timeout, errorHandlingSvc, $modal,
        constantSvc, respondentDetailDialogDataSvc, surveyEditorSvc, surveyMenuSvc) {
        var vm = this;

        vm.surveyId = $routeParams.id;
        vm.pushDownSettings = pushDownSvc.getPushDownSettings();
        vm.removableRespondentIds = [];

        vm.showGenerateRandomData = showGenerateRandomData;
        vm.handleAfterGenerateRandomData = handleAfterGenerateRandomData;
        vm.showStartNew = showStartNew;
        vm.search = search;
        vm.loadMore = loadMore;
        vm.changeRespondentMasterCheckbox = changeRespondentMasterCheckbox;
        vm.changeRespondentCheckboxValue = changeRespondentCheckboxValue;
        vm.deleteRespondents = deleteRespondents;
        vm.showRetakeDialog = showRetakeDialog;
        vm.showRespondentDetailDialog = showRespondentDetailDialog;
        vm.questionDictionary = null;

        init();

        function init() {
            surveyMenuSvc.updateMenuForSurveyTest(vm.surveyId);
            vm.testModeSettings = testModeSvc.getTestModeSettings(vm.surveyId);
            vm.respondents = [];
            vm.searchModel = {};
            getSurveyLatestVersion();
            vm.search();
        }

        function showGenerateRandomData() {
            pushDownSvc.showGenerateRandomData();
        }

        function handleAfterGenerateRandomData() {
            vm.search();
        }

        function showStartNew() {
            pushDownSvc.hidePushDown();
            $modal.open({
                size: 'lg',
                windowClass: 'large-modal',
                templateUrl: 'survey/page/previewDialog/preview-dialog.html',
                controller: 'previewDialogCtrl',
                resolve: {
                    modalData: function () {
                        return {
                            selectSurveyId: vm.surveyId
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
            });
        }

        function search() {
            pushDownSvc.hidePushDown();

            vm.respondentsFound = 0;
            vm.respondents.splice(0, vm.respondents.length);
            vm.searchModel.paging = respondentListSvc.getDefaultPaging();

            spinnerUtilSvc.showSpinner();
            respondentListDataSvc.search(vm.surveyId, vm.searchModel, true).$promise.then(function (response) {
                vm.respondents = respondentListSvc.populateRespondents(vm.respondents, response.respondents, vm.surveyId, vm.removableRespondentIds, true);
                vm.respondentsFound = response.totalRespondentsFound;
                updatePaging(response.respondents.length);
                resetSelectedRespondentList();
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Searching respondents was not successful.', error);
            });
        }

        function updatePaging(size) {
            vm.searchModel.paging.start += size;
            vm.searchModel.paging.hashNext = !(size === 0 || vm.respondentsFound === vm.respondents.length);
        }

        function loadMore() {
            spinnerUtilSvc.showSpinner();
            respondentListDataSvc.search(vm.surveyId, vm.searchModel, true).$promise.then(function (response) {
                vm.respondents = respondentListSvc.populateRespondents(vm.respondents, response.respondents, vm.surveyId, vm.removableRespondentIds, true);
                updatePaging(response.respondents.length);
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading more respondens was not successful.', error);
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

            var allClear = vm.removableRespondentIds.length === 0,
                allSet = vm.removableRespondentIds.length === vm.respondents.length;

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
                    respondentListDataSvc.deleteRespondents(vm.surveyId, vm.removableRespondentIds, true).$promise.then(function () {
                        search();
                    }, function (err) {
                        toastr.error(err.data);
                        spinnerUtilSvc.hideSpinner();
                    });
                }
            });
        }

        function showRetakeDialog(respondentId) {
            respondentDetailDialogDataSvc.getRespondentDetail(vm.surveyId, respondentId, true).$promise.then(function (result) {
                showPreview(result.link);
            }, function (error) {
                errorHandlingSvc.writeErrorToConsole('Getting respondent Link was not successful.', error);
            });

            function showPreview(respondentLink) {
                $modal.open({
                    size: 'lg',
                    windowClass: 'large-modal',
                    templateUrl: 'survey/page/previewDialog/preview-dialog.html',
                    controller: 'previewDialogCtrl',
                    resolve: {
                        modalData: function () {
                            return {
                                sourcedLink: respondentLink
                            };
                        }
                    }
                }).result.then(function (result) {
                    if (!result.status) return;
                    spinnerUtilSvc.showSpinner();
                });
            }
        }

        function showRespondentDetailDialog(respondentId) {
            $modal.open({
                size: 'lg',
                windowClass: 'large-modal',
                templateUrl: 'survey/respondentDetailDialog/response-detail-dialog.html',
                controller: 'respondentDetailDialogCtrl',
                resolve: {
                    modalData: function () {
                        return {
                            surveyId: vm.surveyId,
                            respondentId: respondentId,
                            isTestMode: true,
                            questionDictionary: vm.questionDictionary,
                            surveyIsPublished: surveyEditorSvc.getCurrentSurveyInfo().isPublished
                        };
                    }
                }
            }).result.then(function () { });
        }

        function getSurveyLatestVersion() {
            var surveyInfo = surveyEditorSvc.getCurrentSurveyInfo();
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