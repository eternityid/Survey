(function () {
    angular
        .module('svt')
        .controller('selectionOptionListCtrl', selectionOptionListCtrl);

    selectionOptionListCtrl.$inject = [
        '$scope', '$timeout', 'arrayUtilSvc', '$modal', 'questionEditorSvc', 'surveyEditorSvc',
        'domUtilSvc', 'selectionOptionListSvc', 'questionPreviewerSvc', 'moveOptionSvc', 'moveGroupHeaderSvc',
        'deleteOptionAndGroupSvc'
    ];

    function selectionOptionListCtrl(
        $scope, $timeout, arrayUtilSvc, $modal, questionEditorSvc, surveyEditorSvc,
        domUtilSvc, selectionOptionListSvc, questionPreviewerSvc, moveOptionSvc, moveGroupHeaderSvc,
        deleteOptionAndGroupSvc) {
        /* jshint -W040 */
        var vm = this;
        var questionForPreviewing = angular.copy($scope.previewQuestion.id === $scope.question.id ? $scope.question : $scope.previewQuestion);
        vm.optionList = $scope.optionList;

        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey && survey.customColumns;
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

        vm.sortableGroupOptions = {
            containment: 'showQuestionType',
            orderChanged: function (event) {
                onChangeGroupPositions(event);
            },
            itemMoved: function (event) {
                onMoveGroupHeaderIntoAnotherGroup(event);
            },
            accept: function (sourceItemScope, sortableScope, destScope) {
                return sourceItemScope.modelValue.$type === 'OptionGroup' ? true : false;
            }
        };

        vm.sortableOptions = {
            itemMoved: function (event) {
                moveOptionToAnotherOptionGroup(event);
            },
            orderChanged: function (event) {
                onMoveOptionInsideOptionGroup(event);
            },
            containment: 'showQuestionType',
            accept: function (sourceItemScope, sortableScope, destScope) {
                return true;
            }
        };

        vm.isSingleSelectionType = arrayUtilSvc.hasValueIn([
            'SingleSelectionQuestionDefinition',
            'SingleSelectionGridQuestionDefinition'
        ], $scope.question.$type);

        vm.optionTypes = {
            normalOption: 'NormalOption',
            optionHasOtherQuestion: 'OptionHasOtherQuestion',
            carryOverOption: 'CarryOverOption'
        };

        vm.addOption = addOption;
        vm.addGroupOption = addGroupOption;
        vm.addGroupEnd = addGroupEnd;
        vm.onKeyDownOnOptionAliasField = onKeyDownOnOptionAliasField;
        vm.isOverloadedOptions = isOverloadedOptions;

        vm.toggleOption = toggleOption;
        vm.onOrderOptionChange = onOrderOptionChange;
        vm.onOptionGroupTitleChange = onOptionGroupTitleChange;
        vm.onRemoveGroupHeader = onRemoveGroupHeader;
        vm.onRemoveGroupEnd = onRemoveGroupEnd;
        vm.isNullOptionGroup = isNullOptionGroup;

        init();

        function init() {
            vm.optionList.optionGroups = selectionOptionListSvc.sortOptionGroups(vm.optionList);

            vm.optionList.optionGroups = vm.optionList.optionGroups.filter(function (group) {
                return group.alias !== null;
            });
            vm.optionList.optionGroups.unshift({
                $type: 'OptionGroup',
                alias: null,
                isDisplayed: true,
                hideHeading: false
            });

            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
            $scope.$on('event:DeleteOption', function (event, data) {
                selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
                previewQuestion();
            });
            $scope.$on('event:ChangeCarryOverQuestion', function () {
                previewQuestion();
            });
        }

        function toggleOption(optionToggle, options) {
            options.forEach(function (option) {
                if (option !== optionToggle) {
                    option.isOpened = false;
                }
            });
        }

        function onOrderOptionChange() {
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onOptionGroupTitleChange() {
            $scope.onOptionGroupHeaderChange();
            var validationResult = selectionOptionListSvc.validateOptionGroupTitles($scope.question.id, vm.optionList.optionGroups);
            if (validationResult.valid === true) {
                if (validationResult.message) toastr.warning(validationResult.message);
            } else {
                toastr.error(validationResult.message);
            }
        }

        function previewQuestion() {
            questionForPreviewing = angular.copy($scope.previewQuestion);
            questionForPreviewing.optionList.optionGroups = questionForPreviewing.optionList.optionGroups.filter(function (optionGroup) {
                return optionGroup.alias !== null;
            });
            if (questionForPreviewing.subQuestionDefinition &&
                questionForPreviewing.subQuestionDefinition.optionList &&
                questionForPreviewing.subQuestionDefinition.optionList.optionGroups) {
                questionForPreviewing.subQuestionDefinition.optionList.optionGroups = questionForPreviewing.subQuestionDefinition.optionList.optionGroups.filter(function (optionGroup) {
                    return optionGroup.alias !== null;
                });
            }
            questionPreviewerSvc.addReloadCommand(questionForPreviewing);
        }

        function onChangeGroupPositions(event) {
            moveGroupHeaderSvc.moveGroupHeaders(event, vm.optionList);
            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
            previewQuestion();
        }

        function onMoveGroupHeaderIntoAnotherGroup(event) {
            moveGroupHeaderSvc.moveGroupHeaderIntoAnotherGroup(event, vm.optionList);
            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
            previewQuestion();
        }

        function moveOptionToAnotherOptionGroup(event) {
            moveOptionSvc.moveOptionToAnotherOptionGroup(event, vm.optionList);
            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
            previewQuestion();
        }

        function onMoveOptionInsideOptionGroup(event) {
            moveOptionSvc.moveOptionInsideOptionGroup(event, vm.optionList);
            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
            previewQuestion();
        }

        function addOption(optionType) {
            if (!selectionOptionListSvc.canAddNewOption(vm.optionList, $scope.displayLogic)) return;

            var newOption = selectionOptionListSvc.buildNewOptionBasedOnExistedOptions(
                vm.optionList, $scope.displayLogic.isTopic);

            if (optionType === vm.optionTypes.optionHasOtherQuestion) {
                newOption.otherQuestionDefinition = selectionOptionListSvc.buildDefaultOtherQuestionDefinition($scope.question.surveyId);
                newOption.isOptionHasOtherQuestion = true;
            } else if (optionType === vm.optionTypes.carryOverOption) {
                newOption.isCarryOverOption = true;
                newOption.text.items[0].text = 'Carry over from';
                $scope.openningOption.guid = newOption.guid;
            }

            vm.optionList.options.push(newOption);
            selectOptionAliasField(newOption.guid);

            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);

            previewQuestion();
        }

        function addGroupOption() {
            var newOptionGroupHeader = selectionOptionListSvc.buildNewOptionGroupHeader(vm.optionList);
            vm.optionList.optionGroups.push(newOptionGroupHeader);
            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
        }

        function addGroupEnd() {
            var newGroupEnd = selectionOptionListSvc.buildNewGroupEnd(vm.optionList);
            vm.optionList.optionGroups.push(newGroupEnd);
            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
        }

        function onKeyDownOnOptionAliasField($event, option) {
            var keyCode = $event.which;
            if (!(/^(9|13|38|40)$/g.test(keyCode))) return;

            var isPressedShiftKey = $event.shiftKey;
            var optionIndex = vm.optionList.options.findIndex(function (opt) {
                return opt.alias === option.alias && opt.id === option.id;
            });

            switch (keyCode) {
                case 38:
                    jumpToPreviousOption();
                    break;
                case 13:
                case 40:
                    jumpToNextOptionOrAddNewOption();
                    break;
                case 9:
                    if (isPressedShiftKey) {
                        jumpToPreviousOption();
                    } else {
                        jumpToNextOptionOrAddNewOption();
                    }
                    break;
            }

            function jumpToPreviousOption() {
                var previousOption = vm.optionList.options[optionIndex - 1];
                if (previousOption) selectOptionAliasField(previousOption.guid);
            }

            function jumpToNextOptionOrAddNewOption() {
                var isLastOption = (vm.optionList.options.length === (optionIndex + 1));
                if (isLastOption) {
                    vm.addOption(vm.optionTypes.normalOption);
                } else {
                    var nextOption = vm.optionList.options[optionIndex + 1];
                    selectOptionAliasField(nextOption.guid);
                }
            }
        }

        function isOverloadedOptions() {
            return $scope.displayLogic.maximumOfOptions && vm.optionList.options.length >= $scope.displayLogic.maximumOfOptions;
        }

        function selectOptionAliasField(optionGuid) {
            $timeout(function () {
                domUtilSvc.selectElementContent(optionGuid);
            }, 0);
        }

        function isNullOptionGroup(optionGroup) {
            return (optionGroup.alias === null) && (optionGroup.options.length === 0);
        }

        function onRemoveGroupHeader(group) {
            var options = group.options;
            if (options.length === 0) {
                return vm.optionList.optionGroups.splice(vm.optionList.optionGroups.indexOf(group), 1);
            }
            var isAlowDeleteGroupComplete = options.length < vm.optionList.options.length;
            $modal.open({
                templateUrl: 'survey/common/deleteGroupHeaderDialog/deleteGroupHeaderDialog.html',
                controller: 'deleteGroupHeaderDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            isAlowDeleteGroupComplete: isAlowDeleteGroupComplete
                        };
                    }
                }
            }).result.then(function (result) {
                if (result.status) {
                    if (result.status === 'justDeleteGroupHeader') {
                        deleteOptionAndGroupSvc.deleteGroupHeaderOnly(vm.optionList, group);
                    } else {
                        deleteOptionAndGroupSvc.deleteGroupHeaderAndChildrenOptions(vm.optionList, group);
                    }
                    selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
                    previewQuestion();
                }
            });
        }

        function onRemoveGroupEnd(labelOption) {
            deleteOptionAndGroupSvc.deleteGroupEnd(vm.optionList, labelOption);
            selectionOptionListSvc.buildOptionListForMovingOptions(vm.optionList);
            previewQuestion();
        }
    }
})();