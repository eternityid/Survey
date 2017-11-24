(function () {
    angular
        .module('svt')
        .controller('selectionOptionCtrl', selectionOptionCtrl);

    selectionOptionCtrl.$inject = [
        '$scope', '$modal', 'selectionOptionListSvc', 'surveyEditorSvc',
        'questionPreviewerSvc', 'settingConst', 'questionCarryOverSvc', 'questionConst',
        'questionEditorSvc', 'questionSvc', 'surveyContentValidation'
    ];

    function selectionOptionCtrl(
        $scope, $modal, selectionOptionListSvc, surveyEditorSvc,
        questionPreviewerSvc, settingConst, questionCarryOverSvc, questionConst,
        questionEditorSvc, questionSvc, surveyContentValidation) {
        /* jshint -W040 */
        var vm = this;
        var existedOtherQuestion = null;
        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey && survey.customColumns;

        vm.questionTypes = questionConst.questionTypes;

        vm.options = $scope.options;
        vm.option = $scope.option ? $scope.option : $scope.options;
        vm.optionList = $scope.optionList;

        vm.questionOrders = [
             { code: 0, name: 'In Order' },
             { code: 1, name: 'Randomized' },
             { code: 2, name: 'Flipped' },
             { code: 3, name: 'Rotated' },
             { code: 4, name: 'Alphabetical' }
        ];

        vm.optionsMaskType = [
            { code: settingConst.optionsMaskType.AllOptions, name: 'All Options' },
            { code: settingConst.optionsMaskType.OptionsShown, name: 'Options Shown' },
            { code: settingConst.optionsMaskType.OptionsNotShown, name: 'Options Not Shown' },
            { code: settingConst.optionsMaskType.OptionsSelected, name: 'Options Selected' },
            { code: settingConst.optionsMaskType.OptionsNotSelected, name: 'Options Not Selected' }
        ];
        vm.availableCarryOverQuestions = [];
        vm.carriedOverQuestionTitle = null;

        vm.placeholderRespondentItems = surveyEditorSvc.getSvtPlaceholderRespondentItems(customColumns);
        vm.ckeditorConfig = {
            extraPlugins: 'sourcedialog,svtinserthelper,svtquestionplaceholder,svtrespondentplaceholder',
            oneLineMode: true,
            toolbarType: 'option-short',
            svtData: {
                placeholderQuestionItems: questionEditorSvc.getSvtPlaceholderQuestionItems(),
                placeholderRespondentItems: vm.placeholderRespondentItems
            }
        };

        vm.isOpenningNormalOption = isOpenningNormalOption;
        vm.onClickToggleIconNormalOption = onClickToggleIconNormalOption;
        vm.isOpenning = isOpenning;
        vm.canBeDeleted = canBeDeleted;
        vm.onClickToggleIcon = onClickToggleIcon;
        vm.onOtherQuestionChange = onOtherQuestionChange;
        vm.onOptionAliasChange = onOptionAliasChange;
        vm.onOptionTitleChange = onOptionTitleChange;
        vm.onRemoveOption = onRemoveOption;
        vm.onCarryOverQuestionChange = onCarryOverQuestionChange;
        vm.onClickCarryOverFromQuestionDropdownList = onClickCarryOverFromQuestionDropdownList;

        init();

        function init() {
            if (vm.option.otherQuestionDefinition) {
                existedOtherQuestion = angular.copy(vm.option.otherQuestionDefinition);
                vm.option.isOptionHasOtherQuestion = true;
            }
            if (vm.option.isCarryOverOption) {
                setupAvailableCarryOverQuestions();
                setupCarriedOverQuestionTitle();
            }
        }

        function isOpenningNormalOption() {
            return vm.option.guid === $scope.openningOption.guid;
        }

        function onClickToggleIconNormalOption() {
            $scope.openningOption.guid = isOpenningNormalOption() ? null : vm.option.guid;
        }

        function isOpenning() {
            return vm.option.guid === $scope.openningOption.guid;
        }

        function canBeDeleted() {
            return $scope.question.optionList.options.length > 1;
        }

        function onClickToggleIcon() {
            $scope.openningOption.guid = isOpenning() ? null : vm.option.guid;
        }

        function onOtherQuestionChange() {
            if (vm.option.isOptionHasOtherQuestion) {
                vm.option.otherQuestionDefinition = existedOtherQuestion || selectionOptionListSvc.buildDefaultOtherQuestionDefinition($scope.question.surveyId);
            } else {
                vm.option.otherQuestionDefinition = null;
            }
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onOptionTitleChange() {
            $scope.onOptionTitleChange();
            var validationResult = selectionOptionListSvc.validateOptionTitles($scope.question.id, $scope.options);
            if (validationResult.valid === true) {
                if (validationResult.message) toastr.warning(validationResult.message);
            } else {
                toastr.error(validationResult.message);
            }
        }

        function onOptionAliasChange() {
            var validationResult = selectionOptionListSvc.validateOptionAliases($scope.question.id, $scope.options);
            if (validationResult.valid === false) {
                toastr.error(validationResult.message);
            }
        }

        function onRemoveOption(hashKey) {
            var isNewQuestion = !$scope.question.hasOwnProperty('id') || $scope.question.id === 0,
                previewQuestion;
            if (isNewQuestion) {
                removeSelectedOption(hashKey);
                return;
            }

            var validationResult = selectionOptionListSvc.getValidateMessagesWhenRemovingOption($scope.question, [vm.option]);
            if (validationResult.willBeAffectedOther === false) {
                removeSelectedOption(hashKey);
                return;
            }
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            message: validationResult.message
                        };
                    }
                }
            }).result.then(function (result) {
                if (result.status) {
                    removeSelectedOption(hashKey);
                }
            });
            return;

            function removeSelectedOption(hashKey) {
                $scope.options.forEach(function (option, index) {
                    if (option.$$hashKey === hashKey) {
                        $scope.options.splice(index, 1);
                        return;
                    }
                });
                $scope.$emit('event:DeleteOption', {});
                $scope.$emit('event:DetectQuestionEditorError');
            }
        }

        function onCarryOverQuestionChange() {
            var optionAliasesValidationResult = selectionOptionListSvc.validateOptionAliases($scope.question.id, $scope.options);
            if (optionAliasesValidationResult.valid === false) {
                toastr.error(optionAliasesValidationResult.message);
            } else {
                setupCarriedOverQuestionTitle();
                $scope.$emit('event:ChangeCarryOverQuestion', {});
                $scope.$emit('event:DetectQuestionEditorError');
            }
        }

        function onClickCarryOverFromQuestionDropdownList() {
            setupAvailableCarryOverQuestions();
        }

        function setupAvailableCarryOverQuestions() {
            var remainingOptions = $scope.options.filter(function (o) {
                return o.guid !== vm.option.guid;
            });
            vm.availableCarryOverQuestions = questionCarryOverSvc.getAvailableCarryOverQuestionsForOption($scope.question.id, remainingOptions);
        }

        function setupCarriedOverQuestionTitle() {
            if (!vm.option.optionsMask || !vm.option.optionsMask.questionId) {
                vm.carriedOverQuestionTitle = '';
                return;
            }

            var carryOverError = surveyContentValidation.getCarryOverErrorByOptionId(vm.option.id);
            vm.carriedOverQuestionTitle = carryOverError === undefined ||
                                          carryOverError.carryOverFromQuestionId !== vm.option.optionsMask.questionId ?
                questionSvc.getQuestionTitle(vm.option.optionsMask.questionId) :
                carryOverError.message;
        }
    }
})();