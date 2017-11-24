(function () {
    'use strict';

    angular
        .module('svt')
        .controller('questionDisplaySettingCtrl', QuestionDisplaySettingCtrl);

    QuestionDisplaySettingCtrl.$inject = [
        '$scope', 'surveyEditorPageSvc', '$modal', 'skipCommandSvc',
        'settingConst', 'stringUtilSvc', 'questionPreviewerSvc', 'questionAdvanceSettingSvc',
        'serverValidationSvc', 'questionConst', 'surveyContentValidation'
    ];

    function QuestionDisplaySettingCtrl(
        $scope, surveyEditorPageSvc, $modal, skipCommandSvc,
        settingConst, stringUtilSvc, questionPreviewerSvc, questionAdvanceSettingSvc,
        serverValidationSvc, questionConst, surveyContentValidation) {
        /* jshint -W040 */
        var vm = this;
        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();

        vm.questionTypes = questionConst.questionTypes;
        vm.maxlengthQuestionAlias = settingConst.question.alias.maxlength;
        vm.questionOrders = [
             { code: 0, name: 'In Order' },
             { code: 1, name: 'Randomized' },
             { code: 2, name: 'Flipped' },
             { code: 3, name: 'Rotated' },
             { code: 4, name: 'Alphabetical' }
        ];

        vm.optionsMaskTypes = [
             { code: 1, name: 'Display Options Shown' },
             { code: 2, name: 'Display Options Not Shown' },
             { code: 3, name: 'Display Options Selected' },
             { code: 4, name: 'Display Options Not Selected' }
        ];

        vm.isQuestionUsingErrorOptionsMask = isQuestionUsingErrorOptionsMask;
        vm.onCheckDisplayLogic = onCheckDisplayLogic;
        vm.onCheckOptionsMask = onCheckOptionsMask;
        vm.onOptionsMaskChange = onOptionsMaskChange;
        vm.showEditConditionDialog = showEditConditionDialog;
        vm.isUseCustomOptionsMask = isUseCustomOptionsMask;
        vm.isShowQuestionMask = isShowQuestionMask;

        vm.onLongTextAdvancedSettingsChange = onLongTextAdvancedSettingsChange;
        vm.onRenderOptionAsButtonChange = onRenderOptionAsButtonChange;
        vm.onDisplayOrientationChange = onDisplayOrientationChange;
        vm.onTransposedChange = onTransposedChange;
        vm.onOptionsOrderChange = onOptionsOrderChange;
        vm.onMaxPicturesInGridChange = onMaxPicturesInGridChange;
        vm.onIsScalePictureToFitContainerChange = onIsScalePictureToFitContainerChange;
        vm.onIsPictureShowLabelChange = onIsPictureShowLabelChange;
        vm.onAlwaysHiddenChange = onAlwaysHiddenChange;
        vm.onSubLongTextQuestionSizeChange = onSubLongTextQuestionSizeChange;

        init();

        $scope.$on('event:ReInitializeAdvancedSettings', function (evt) {
            init();
        });

        function init() {
            var validationTypes = serverValidationSvc.getServerValidationTypes();

            setupOptionsMask();
            setupShowQuestionMark();
            setupUseQuestionMark();

            vm.multipleDisplayOrientationList = questionAdvanceSettingSvc.getDisplayOrientations(false);
            vm.singleDisplayOrientationList = questionAdvanceSettingSvc.getDisplayOrientations(true);

            function setupOptionsMask() {
                if (!$scope.question.optionsMask) return;
                vm.optionsMaskError = null;
                if (isUsingOptionsMask($scope.question.optionsMask)) {
                    $scope.question.advancedSettings.isUseOptionMask = true;
                    vm.optionsMaskError = surveyContentValidation.getOptionsMaskErrorByQuesionId($scope.question.id);
                }
            }

            function setupShowQuestionMark() {
                var questionMarkExpression = $scope.question.questionMaskExpression;
                $scope.question.displayedExpressionItems = questionMarkExpression ?
                    skipCommandSvc.getDisplayedExpressionItems(questionMarkExpression.expressionItems, $scope.question.pageId) : [];
            }

            function setupUseQuestionMark() {
                if ($scope.question.advancedSettings.hasOwnProperty('isUseQuestionMask')) return;
                if ($scope.question.questionMaskExpression) {
                    $scope.question.advancedSettings.isUseQuestionMask = true;
                } else {
                    $scope.question.advancedSettings.isUseQuestionMask = false;
                }
            }
        }

        function isUsingOptionsMask(optionsMask) {
            return stringUtilSvc.isNotEmpty($scope.question.optionsMask.questionId) ||
                stringUtilSvc.isNotEmpty($scope.question.optionsMask.optionsMaskType) ||
                stringUtilSvc.isNotEmpty($scope.question.optionsMask.customOptionsMask);
        }

        function isQuestionUsingErrorOptionsMask() {
            if (!$scope.question.optionsMask ||
                !isUsingOptionsMask($scope.question.optionsMask) ||
                !vm.optionsMaskError) return false;
            if (!vm.optionsMaskError.hasOwnProperty('optionsMaskQuestionId')) return false;
            return $scope.question.optionsMask.questionId === vm.optionsMaskError.optionsMaskQuestionId;
        }

        function onCheckDisplayLogic() {
            $scope.$emit('event:DetectQuestionEditorError');
        }

        function onCheckOptionsMask() {
            $scope.$emit('event:DetectQuestionEditorError');
        }        

        function onOptionsMaskChange() {
            if ($scope.question.optionsMask.optionsMaskType === '') {
                $scope.question.optionsMask.questionId = '';
            }
            $scope.$emit('event:DetectQuestionEditorError');
        }

        function showEditConditionDialog() {
            $modal.open({
                size: 'lg',
                windowClass: 'large-modal',
                templateUrl: 'survey/question/editConditionDialog/edit-condition-dialog.html',
                controller: 'editConditionDialogCtrl',
                resolve: {
                    modalData: function () {
                        return {
                            question: angular.copy($scope.question)
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                $scope.question = result.question;
                $scope.question.displayedExpressionItems = skipCommandSvc.getDisplayedExpressionItems(
                    $scope.question.questionMaskExpression.expressionItems, $scope.question.pageId);
                $scope.$apply();
                $scope.$emit('event:DetectQuestionEditorError');
            });
        }

        function isUseCustomOptionsMask() {
            var customOptionMaskType = 5;
            return $scope.question.optionsMask && $scope.question.optionsMask.optionsMaskType === customOptionMaskType;
        }

        function isShowQuestionMask() {
            return surveyEditorPageSvc.getQuestionsBeforePageId($scope.pageId).length > 0;
        }

        function onLongTextAdvancedSettingsChange() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.longText.advancedSettings, {
                cols: $scope.question.cols,
                rows: $scope.question.rows
            });
        }

        function onRenderOptionAsButtonChange() {
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onOptionsOrderChange() {
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onDisplayOrientationChange() {
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onTransposedChange() {
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onMaxPicturesInGridChange() {
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onIsScalePictureToFitContainerChange() {
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onIsPictureShowLabelChange() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.pictureSelection.isPictureShowLabel, $scope.question.isPictureShowLabel);
        }

        function onAlwaysHiddenChange() {
            questionPreviewerSvc.updateAlwaysHiddenMessage($scope.question.isAlwaysHidden);
        }

        function onSubLongTextQuestionSizeChange() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.textList.subLongTextQuestionSize, {
                rows: $scope.question.subQuestionDefinition.rows,
                cols: $scope.question.subQuestionDefinition.cols
            });
        }
    }
})();
