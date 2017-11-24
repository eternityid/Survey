(function () {
    'use strict';

    angular
        .module('svt')
        .controller('skipCommandEditorCtrl', skipCommandEditorCtrl);

    skipCommandEditorCtrl.$inject = [
        '$scope', 'skipCommandEditorSvc', 'surveyEditorSvc',
        'surveyEditorPageSvc', 'pageSvc', 'pageDataSvc',
        'errorHandlingSvc', 'questionSvc', 'constantSvc',
        '$modal', 'indexSvc', 'spinnerUtilSvc', 'surveyContentValidation', 'httpStatusCode'
    ];

    function skipCommandEditorCtrl(
        $scope, skipCommandEditorSvc, surveyEditorSvc,
        surveyEditorPageSvc, pageSvc, pageDataSvc,
        errorHandlingSvc, questionSvc, constantSvc,
        $modal, indexSvc, spinnerUtilSvc, surveyContentValidation, httpStatusCode) {
        /* jshint -W040 */
        var vm = this;

        vm.htmlContainerId = $scope.htmlContainerId;

        vm.getEditorClasses = getEditorClasses;
        vm.onSkipToChanged = onSkipToChanged;
        vm.cancelSkipCommandEditor = cancelSkipCommandEditor;
        vm.saveSkipCommand = saveSkipCommand;

        vm.init = init;

        vm.init();

        function init() {
            vm.parentPage = surveyEditorPageSvc.getPageById($scope.pageId);

            vm.skipCommand = skipCommandEditorSvc.buildSkipCommand($scope.skipCommand, vm.parentPage.surveyId, vm.parentPage.id);
            vm.sourceSkipCommand = angular.copy(vm.skipCommand);

            vm.skipCommandErrors = surveyContentValidation.getErrorsBySkipClientId(vm.skipCommand.clientId);
            vm.isSkipRemainError = skipCommandEditorSvc.isSkipCommandRemainError(vm.skipCommandErrors, vm.skipCommand);

            $scope.$on('event:DetectSkipCommandEditorError', function () {
                vm.isSkipRemainError = skipCommandEditorSvc.isSkipCommandRemainError(vm.skipCommandErrors, vm.skipCommand);
            });

            $scope.$on('event:ClickOnOverlayInDesigner', function () {
                if (isUpdateingSkipCommand()) {
                    cancelSkipCommandEditor(vm.skipCommand.clientId);
                } else {
                    confirmToCancelEditingSkipCommand(constantSvc.messages.cancelCreatingSkipAction,
                        vm.skipCommand.clientId);
                }
            });
        }

        function getEditorClasses() {
            var classes = ['question-form', 'highlight-selection', 'skip-command-edit'];
            if (vm.isSkipRemainError) {
                //TODO can find good name for this (for both question and skip)
                classes.push('survey-question--error');
            }
            return classes;
        }

        function onSkipToChanged() {
            vm.isSkipRemainError = skipCommandEditorSvc.isSkipCommandRemainError(vm.skipCommandErrors, vm.skipCommand);
        }

        function cancelSkipCommandEditor(skipCommandId) {
            var confirmMessage = isUpdateingSkipCommand() &&
                !skipCommandEditorSvc.deepCompareSkipCommands(vm.sourceSkipCommand, vm.skipCommand) ?
                constantSvc.messages.cancelEditingSkipAction :
                '';
            confirmToCancelEditingSkipCommand(confirmMessage, skipCommandId);
        }

        function confirmToCancelEditingSkipCommand(confirmMessage, skipCommandId) {
            if (confirmMessage !== '') {
                $modal.open({
                    templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                    controller: 'deleteDialogCtrl',
                    resolve: {
                        modalData: function () {
                            return {
                                message: confirmMessage,
                                modalTitle: 'Cancel Confirmation',
                                okTitle: 'Discard changes',
                                cancelTitle: 'Continue editing'
                            };
                        }
                    }
                }).result.then(function (result) {
                    if (!result.status) return;
                    doneCancelSkipCommandEditor(skipCommandId);
                });
            } else {
                doneCancelSkipCommandEditor(skipCommandId);
            }

            function doneCancelSkipCommandEditor(skipCommandId) {
                surveyEditorSvc.resetToViewMode();
                pageSvc.setSkipCommandEditorId(null);
                questionSvc.setActiveQuestion(skipCommandId);
                indexSvc.callbackCheckOverlay(false);
            }
        }

        function saveSkipCommand() {
            if (!skipCommandEditorSvc.validateSkipCommand(vm.skipCommand)) return;

            var modifiedPage = angular.copy(vm.parentPage);
            var isUpdate = isUpdateingSkipCommand();
            //TODO how to check update/create skip action ==> need to discuss with team
            if (isUpdate) {
                for (var i = 0; i < modifiedPage.skipCommands.length; i++) {
                    if (modifiedPage.skipCommands[i].clientId === vm.skipCommand.clientId) {
                        modifiedPage.skipCommands[i] = vm.skipCommand;
                        break;
                    }
                }
            } else {
                var newSkipCommand = angular.copy(vm.skipCommand);
                if (!modifiedPage.skipCommands) {
                    modifiedPage.skipCommands = [newSkipCommand];
                } else {
                    modifiedPage.skipCommands.push(newSkipCommand);
                }
            }

            spinnerUtilSvc.showSpinner();
            surveyEditorSvc.setSurveyEditMode(true);
            pageDataSvc.updateSkipCommands($scope.blockId, modifiedPage).$promise.then(function (response) {
                surveyEditorSvc.setSurveyVersion(response.headers['survey-etag']);
                vm.parentPage.version = response.headers.etag;
                surveyEditorSvc.resetToViewMode();
                pageSvc.setSkipCommandEditorId(null);
                pageSvc.setActivePage($scope.pageId);
                indexSvc.callbackCheckOverlay(false);

                angular.copy(modifiedPage.skipCommands, vm.parentPage.skipCommands);

                surveyEditorSvc.refreshSummarySkipCommandsInSurvey();
                surveyEditorSvc.setSurveyEditMode(false);

                spinnerUtilSvc.hideSpinner();
                surveyContentValidation.validateLatestSurvey();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                if (error.status === httpStatusCode.preConditionFail) {
                    errorHandlingSvc.manifestError('This question has changed. Please refresh to get the newest data', error);
                } else {
                    errorHandlingSvc.manifestError('Moving question was not successful.', error);
                }
                surveyEditorSvc.setSurveyEditMode(false);
            });
        }

        function isUpdateingSkipCommand() {
            if (!vm.skipCommand.hasOwnProperty('clientId')) return false;
            return vm.parentPage.skipCommands.some(function (skip) {
                return skip.clientId === vm.skipCommand.clientId;
            });
        }
    }
})();
