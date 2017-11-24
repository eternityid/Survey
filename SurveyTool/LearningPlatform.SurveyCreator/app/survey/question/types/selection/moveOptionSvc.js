(function () {
    angular.module('svt').service('moveOptionSvc', MoveOptionSvc);
    MoveOptionSvc.$inject = ['arrayUtilSvc', 'moveOptionAndGroupSvc'];

    function MoveOptionSvc(arrayUtilSvc, moveOptionAndGroupSvc) {
        var service = {
            moveOptionInsideOptionGroup: moveOptionInsideOptionGroup,
            moveOptionToAnotherOptionGroup: moveOptionToAnotherOptionGroup
        };
        return service;

        function moveOptionInsideOptionGroup(event, optionList) {
            var movedOption = event.source.itemScope.modelValue;

            if (moveOptionAndGroupSvc.isRealOption(movedOption)) {
                if (event.source.index > event.dest.index) {
                    moveOptionUp();
                } else {
                    moveOptionDown();
                }
            } else {
                if (event.source.index > event.dest.index) {
                    moveGroupEndUp();
                } else {
                    moveGroupEndDown();
                }
            }
            return;

            function moveOptionUp() {
                moveOptionAndGroupSvc.updateOptionsBySortableOptions(optionList);
            }

            function moveOptionDown() {
                var lastEffectedOption = event.dest.sortableScope.modelValue[event.dest.index - 1];
                var isMoveOptionToOption = moveOptionAndGroupSvc.isRealOption(lastEffectedOption);
                if (isMoveOptionToOption) {
                    moveOptionAndGroupSvc.updateOptionsBySortableOptions(optionList);
                } else {
                    var displayedGroup = optionList.optionGroups.filter(function (group) {
                        return group.alias === lastEffectedOption.referToGroupAlias;
                    })[0];
                    lastEffectedOption.isIndent = false;
                    delete lastEffectedOption.referToGroupAlias;
                    lastEffectedOption.groupAlias = displayedGroup.alias;
                    event.source.itemScope.modelValue.groupAlias = displayedGroup.alias;

                    displayedGroup.isDisplayed = true;
                    displayedGroup.displayedOptions.length = 0;
                    displayedGroup.displayedOptions.unshift(event.dest.sortableScope.modelValue.pop());
                    displayedGroup.displayedOptions.unshift(event.dest.sortableScope.modelValue.pop());

                    var isNeedToUpdatePosition = event.dest.sortableScope.modelValue.length > 2;
                    if (isNeedToUpdatePosition) {
                        moveOptionAndGroupSvc.updateOptionsBySortableOptions(optionList);
                    }
                }
            }

            function moveGroupEndUp() {
                var movedGroupEnd = event.source.itemScope.modelValue;
                var displayedGroup = optionList.optionGroups.filter(function (group) {
                    return group.alias === movedGroupEnd.referToGroupAlias;
                })[0];
                movedGroupEnd.isIndent = false;
                delete movedGroupEnd.referToGroupAlias;
                movedGroupEnd.groupAlias = displayedGroup.alias;

                displayedGroup.isDisplayed = true;
                displayedGroup.displayedOptions.length = 0;
                for (var i = event.dest.sortableScope.modelValue.length - 1; i >= event.dest.index; i--) {
                    event.dest.sortableScope.modelValue[i].groupAlias = displayedGroup.alias;
                    displayedGroup.displayedOptions.unshift(event.dest.sortableScope.modelValue.pop());
                }
            }

            function moveGroupEndDown() {
                var previousOptionGroup = detectPreviousSourceOptionGroup(event, optionList);
                if (!previousOptionGroup) return;
                event.dest.sortableScope.modelValue.forEach(function (option) {
                    if (moveOptionAndGroupSvc.isRealOption(option)) {
                        option.groupAlias = previousOptionGroup.alias;
                    }
                });
            }
        }

        function moveOptionToAnotherOptionGroup(event, optionList) {
            var movedOption = event.source.itemScope.modelValue;
            if (moveOptionAndGroupSvc.isRealOption(movedOption)) {
                moveOption();
            } else {
                moveGroupEnd();
            }
            return;

            function moveOption() {
                var destOptionGroup = detectDestinationGroup();
                if (event.dest.index === 0) {
                    event.source.itemScope.modelValue.groupAlias = destOptionGroup.alias;
                } else {
                    var previousOption = event.dest.sortableScope.modelValue[event.dest.index - 1];
                    if (moveOptionAndGroupSvc.isRealOption(previousOption)) {
                        event.source.itemScope.modelValue.groupAlias = destOptionGroup.alias;
                    } else if (previousOption.isIndent) {
                        var displayedGroup = optionList.optionGroups.filter(function (group) {
                            return group.alias === previousOption.referToGroupAlias;
                        })[0];
                        previousOption.isIndent = false;
                        delete previousOption.referToGroupAlias;
                        previousOption.groupAlias = displayedGroup.alias;
                        event.source.itemScope.modelValue.groupAlias = displayedGroup.alias;

                        displayedGroup.isDisplayed = true;
                        displayedGroup.displayedOptions.length = 0;
                        displayedGroup.displayedOptions.unshift(event.dest.sortableScope.modelValue.pop());
                        displayedGroup.displayedOptions.unshift(event.dest.sortableScope.modelValue.pop());
                    } else {
                        event.source.itemScope.modelValue.groupAlias = previousOption.groupAlias;
                    }
                }
                moveOptionAndGroupSvc.updateOptionsBySortableOptions(optionList);
            }

            function detectDestinationGroup() {
                return optionList.optionGroups.filter(function (optionGroup) {
                    return optionGroup.displayedOptions.some(function (option) {
                        return option.$$hashKey === event.source.itemScope.modelValue.$$hashKey;
                    });
                })[0];
            }

            function moveGroupEnd() {
                updateGroupAliasForDestOptions();
                updateGroupAliasForSourceOptions();
                updateOptionGroupsPositionBySortableOptionGroups();
            }

            function updateOptionGroupsPositionBySortableOptionGroups() {
                var movedOptionGroup = detectMovedOptionGroupByGroupEndLabel();
                var destOptionGroup = detectDestinationGroup();
                var displayedGroupAliasesOrdinal = [];
                optionList.optionGroups.forEach(function (optionGroup) {
                    if (optionGroup.$$hashKey === movedOptionGroup.$$hashKey) return;
                    var groupAlias;
                    if (destOptionGroup.$$hashKey === optionGroup.$$hashKey) {
                        if (!optionGroup.hideHeading) {
                            arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, optionGroup.alias);
                        }
                        var previousOption = event.dest.index > 0 ? optionGroup.displayedOptions[event.dest.index - 1] : null;
                        var nextOption = event.dest.index < optionGroup.displayedOptions.length - 1 ? optionGroup.displayedOptions[event.dest.index + 1] : null;
                        groupAlias = getGroupAliasWithOption(event.source.itemScope.modelValue);

                        if (previousOption === null) {
                            if (nextOption !== null) {
                                if (moveOptionAndGroupSvc.isRealOption(nextOption)) {
                                    arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, optionGroup.alias);
                                    arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, groupAlias);
                                } else {
                                    arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, groupAlias);
                                    arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, getGroupAliasWithOption(nextOption));
                                }
                            } else {
                                arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, optionGroup.alias);
                                arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, groupAlias);
                            }
                        } else {
                            if (moveOptionAndGroupSvc.isRealOption(previousOption)) {
                                arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, previousOption.groupAlias);
                                arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, groupAlias);
                            } else {
                                arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, getGroupAliasWithOption(previousOption));
                                arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, groupAlias);
                            }
                        }
                        return;
                    }
                    if (optionGroup.displayedOptions.length > 0) {
                        arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, optionGroup.alias);
                        optionGroup.displayedOptions.forEach(function (option) {
                            groupAlias = getGroupAliasWithOption(option);
                            arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, groupAlias);
                        });
                    } else {
                        arrayUtilSvc.pushPrimitiveUniqueElement(displayedGroupAliasesOrdinal, optionGroup.alias);
                    }
                });
            }

            function detectMovedOptionGroupByGroupEndLabel() {
                var groupAlias = getGroupAliasWithOption(event.source.itemScope.modelValue);
                return optionList.optionGroups.filter(function (optionGroup) {
                    return optionGroup.alias === groupAlias;
                })[0];
            }

            function isOptionGroupHasOption(groupAlias) {
                return optionList.options.some(function (option) {
                    return option.groupAlias === groupAlias;
                });
            }

            function updateGroupAliasForDestOptions() {
                var destModelValues = event.dest.sortableScope.modelValue;
                if (event.dest.index === destModelValues.length - 1 || !moveOptionAndGroupSvc.isRealOption(destModelValues[event.dest.index + 1])) return;

                var groupAlias = getGroupAliasWithOption(event.source.itemScope.modelValue);
                for (var i = event.dest.index + 1; i < destModelValues.length; i++) {
                    var option = destModelValues[i];
                    if (moveOptionAndGroupSvc.isRealOption(option)) {
                        option.groupAlias = groupAlias;
                    }
                }
            }

            function updateGroupAliasForSourceOptions() {
                var previousOptionGroup = detectPreviousSourceOptionGroup(event, optionList);
                if (!previousOptionGroup) return;
                var movedGroupEndLabel = event.source.itemScope.modelValue;
                var isMoveToPreviousGroup = previousOptionGroup.displayedOptions.some(function (option) {
                    return option.$$hashKey === movedGroupEndLabel.$$hashKey;
                });

                var groupAlias = previousOptionGroup.alias;
                if (previousOptionGroup.displayedOptions.length > 0) {
                    var lastOption = previousOptionGroup.displayedOptions[previousOptionGroup.displayedOptions.length - 1];
                    if (moveOptionAndGroupSvc.isRealOption(lastOption)) {
                        if (isMoveToPreviousGroup && moveOptionAndGroupSvc.isRealOption(previousOptionGroup.displayedOptions[event.dest.index + 1])) {
                            groupAlias = movedGroupEndLabel.isIndent ? movedGroupEndLabel.referToGroupAlias : movedGroupEndLabel.groupAlias;
                        }
                    } else {
                        groupAlias = lastOption.isIndent ? lastOption.referToGroupAlias : lastOption.groupAlias;
                    }
                }
                event.source.sortableScope.modelValue.forEach(function (option) {
                    option.groupAlias = groupAlias;
                });
            }
        }

        function detectPreviousSourceOptionGroup(event, optionList) {
            var groupAlias = getGroupAliasWithOption(event.source.itemScope.modelValue);
            var index = optionList.optionGroups.findIndex(function (group) {
                return group.alias === groupAlias;
            });
            return index <= 0 ? null : optionList.optionGroups[index - 1];
        }

        function getGroupAliasWithOption(option) {
            if (moveOptionAndGroupSvc.isRealOption(option)) return option.groupAlias;
            return option.isIndent ? option.referToGroupAlias : option.groupAlias;
        }
    }
})();