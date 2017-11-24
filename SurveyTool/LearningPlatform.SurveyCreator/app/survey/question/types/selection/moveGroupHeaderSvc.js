(function () {
    angular.module('svt').service('moveGroupHeaderSvc', MoveGroupHeaderSvc);
    MoveGroupHeaderSvc.$inject = ['moveOptionAndGroupSvc'];

    function MoveGroupHeaderSvc(moveOptionAndGroupSvc) {
        var service = {
            moveGroupHeaders: moveGroupHeaders,
            moveGroupHeaderIntoAnotherGroup: moveGroupHeaderIntoAnotherGroup
        };
        return service;

        function moveGroupHeaders(event, optionList) {
            appendBelowSourceOptionsToAboveSourceOptions();
            appendBelowDestOptionsToMovedGroup();
            keepDestGroupEndBeforeGroupHeader();
            arrangeGroupEndBelongToMovedGroup();
            setStandaloneGroupAlwaysOnTop();
            moveOptionAndGroupSvc.updateOptionsBySortableOptions(optionList);
            return;

            function appendBelowSourceOptionsToAboveSourceOptions() {
                if (event.source.index >= optionList.optionGroups.length - 1) return;
                var belowGroup, aboveGroup;

                if (event.source.index < event.dest.index) {
                    belowGroup = optionList.optionGroups[event.source.index];
                    aboveGroup =
                        event.source.index > 0 ?
                        optionList.optionGroups[event.source.index - 1] :
                        moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, null);
                } else {
                    belowGroup = optionList.optionGroups[event.source.index + 1];
                    aboveGroup = optionList.optionGroups[event.source.index];
                }

                if (!belowGroup.hideHeading) return;

                var aboveGroupAlias = moveOptionAndGroupSvc.getGroupAliasOfLastOption(aboveGroup);
                belowGroup.displayedOptions.forEach(function (option) {
                    option.groupAlias = aboveGroupAlias;
                    aboveGroup.displayedOptions.push(option);
                });
                belowGroup.displayedOptions = belowGroup.displayedOptions.filter(function (option) {
                    return !moveOptionAndGroupSvc.isRealOption(option);
                });
            }

            function appendBelowDestOptionsToMovedGroup() {
                if (event.dest.index >= optionList.optionGroups.length - 1) return;
                var belowGroup = optionList.optionGroups[event.dest.index + 1];
                if (!belowGroup.hideHeading && belowGroup.alias !== null) return;

                var sourceModelValue = event.source.itemScope.modelValue;
                var groupAlias = moveOptionAndGroupSvc.getGroupAliasOfLastOption(sourceModelValue);
                var lastDestOption = sourceModelValue.displayedOptions.length > 0 ? sourceModelValue.displayedOptions[sourceModelValue.displayedOptions.length - 1] : null;
                var containedGroup =
                    lastDestOption && !moveOptionAndGroupSvc.isRealOption(lastDestOption) ?
                    moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, lastDestOption.referToGroupAlias) : sourceModelValue;

                belowGroup.displayedOptions.forEach(function (option) {
                    option.groupAlias = groupAlias;
                    containedGroup.displayedOptions.push(option);
                });
                belowGroup.displayedOptions = belowGroup.displayedOptions.filter(function (option) {
                    return !moveOptionAndGroupSvc.isRealOption(option);
                });
            }

            function keepDestGroupEndBeforeGroupHeader() {
                var aboveGroup = event.dest.index > 0 ? optionList.optionGroups[event.dest.index - 1] : null;
                if (aboveGroup === null || aboveGroup.alias === null || aboveGroup.hideHeading || aboveGroup.displayedOptions.length === 0) return;
                var lastAboveOption = aboveGroup.displayedOptions[aboveGroup.displayedOptions.length - 1];
                if (moveOptionAndGroupSvc.isRealOption(lastAboveOption)) return;
                var belowGroup = event.dest.index < optionList.optionGroups.length - 1 ? optionList.optionGroups[event.dest.index + 1] : null;
                if (!belowGroup) return;
                if (lastAboveOption.referToGroupAlias === belowGroup.alias) {
                    optionList.optionGroups = optionList.optionGroups.filter(function (group) {
                        return group.alias !== belowGroup.alias;
                    });
                    optionList.optionGroups.splice(event.dest.index, 0, belowGroup);
                }
            }

            function arrangeGroupEndBelongToMovedGroup() {
                var movedGroupHeader = event.source.itemScope.modelValue;
                var lastOption = movedGroupHeader.displayedOptions.length > 0 ? movedGroupHeader.displayedOptions[movedGroupHeader.displayedOptions.length - 1] : null;
                if (!lastOption || !lastOption.hasOwnProperty('renderAsLabel') || !lastOption.renderAsLabel) return;

                var groupEnd = moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, lastOption.referToGroupAlias);
                optionList.optionGroups = optionList.optionGroups.filter(function (group) {
                    return group.$$hashKey !== groupEnd.$$hashKey;
                });
                var index = optionList.optionGroups.findIndex(function (group) {
                    return group.$$hashKey === movedGroupHeader.$$hashKey;
                });
                optionList.optionGroups.splice(index + 1, 0, groupEnd);
            }

            function setStandaloneGroupAlwaysOnTop() {
                var standaloneGroup = optionList.optionGroups.find(function (group) {
                    return group.alias === null;
                });
                optionList.optionGroups = optionList.optionGroups.filter(function (group) {
                    return group.alias !== null;
                });
                optionList.optionGroups.unshift(standaloneGroup);
            }
        }

        function moveGroupHeaderIntoAnotherGroup(event, optionList) {
            var movedGroupHeader = event.source.itemScope.modelValue;
            optionList.optionGroups = optionList.optionGroups.filter(function (group) {
                return group.$$hashKey !== movedGroupHeader.$$hashKey;
            });

            var destIndex = event.dest.index;
            if (destIndex === 0) {
                moveToTop();
            } else if (destIndex < event.dest.sortableScope.modelValue.length - 1) {
                moveToMiddle();
            } else {
                moveToBottom();
            }            

            moveOptionAndGroupSvc.updateOptionsBySortableOptions(optionList);
            return;

            function moveToTop() {
                updateOptionsBelowSourceGroup();
                var destGroupIndex = detectDestGroupIndex();
                var destGroupAlias = optionList.optionGroups[destGroupIndex].alias;
                event.dest.sortableScope.modelValue.splice(0, 1);
                if (moveOptionAndGroupSvc.isRealOption(event.dest.sortableScope.modelValue[0])) {
                    optionList.optionGroups.splice(destGroupIndex + 1, 0, event.source.itemScope.modelValue);
                    processDestOptionsBelowDestIndex(destGroupAlias);
                } else {
                    if (optionList.optionGroups[destGroupIndex].hideHeading) {
                        optionList.optionGroups.splice(destGroupIndex, 0, event.source.itemScope.modelValue);
                    } else {
                        optionList.optionGroups.splice(destGroupIndex + 1, 0, event.source.itemScope.modelValue);
                    }
                }
                moveGroupEndOfSourceGroup();
            }

            function detectDestGroupIndex() {
                var index = optionList.optionGroups.findIndex(function (group) {
                    return isGroupContainMovedGroupHeader(group);
                });
                return index;
            }

            function isGroupContainMovedGroupHeader(group) {
                return group.displayedOptions.some(function (option) {
                    return option.$$hashKey === event.source.itemScope.modelValue.$$hashKey;
                });
            }

            function processDestOptionsBelowDestIndex(destGroupAlias) {
                var isGroupHeaderContainGroupEnd = isMoveGroupHeaderAndGroupEnd();
                var options = event.source.itemScope.modelValue.displayedOptions;
                var groupAlias = isGroupHeaderContainGroupEnd ? options[options.length - 1].referToGroupAlias : event.source.itemScope.modelValue.alias;
                var containedGroup =
                    isGroupHeaderContainGroupEnd ?
                    moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, groupAlias) :
                    event.source.itemScope.modelValue;
                var movedOptions = [];
                var destGroup = moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, destGroupAlias);
                for (var i = event.dest.index; i < destGroup.displayedOptions.length; i++) {
                    if (moveOptionAndGroupSvc.isRealOption(destGroup.displayedOptions[i])) {
                        destGroup.displayedOptions[i].groupAlias = groupAlias;
                        movedOptions.push(destGroup.displayedOptions[i]);
                        destGroup.displayedOptions.splice(i, 1);
                        i--;
                    }
                }
                containedGroup.displayedOptions = containedGroup.displayedOptions.concat(movedOptions);
            }

            function isMoveGroupHeaderAndGroupEnd() {
                var displayedOptions = event.source.itemScope.modelValue.displayedOptions;
                return displayedOptions.length > 0 && !moveOptionAndGroupSvc.isRealOption(displayedOptions[displayedOptions.length - 1]);
            }

            function moveGroupEndOfSourceGroup() {
                if (!isMoveGroupHeaderAndGroupEnd()) return;
                var groupEndAlias = moveOptionAndGroupSvc.getGroupAliasOfLastOption(event.source.itemScope.modelValue);
                var groupEnd = moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, groupEndAlias);
                moveOptionAndGroupSvc.moveOutGroupByAlias(optionList, groupEndAlias);
                var sourceGroupIndex = moveOptionAndGroupSvc.getGroupIndexByAlias(optionList, event.source.itemScope.modelValue.alias);
                optionList.optionGroups.splice(sourceGroupIndex + 1, 0, groupEnd);
            }

            function moveToMiddle() {
                var destGroupAlias = optionList.optionGroups[detectDestGroupIndex()].alias;
                processDestOptionsAboveDestIndex();
                updateOptionsBelowSourceGroup();
                moveSourceGroupToRightPosition();
                moveGroupEndOfSourceGroup();
                processDestOptionsBelowDestIndex(destGroupAlias);
                return;

                function moveSourceGroupToRightPosition() {
                    var destGroupIndex = detectDestGroupIndex();
                    optionList.optionGroups[destGroupIndex].displayedOptions.splice(event.dest.index, 1);
                    var displayedOptions = optionList.optionGroups[destGroupIndex].displayedOptions;
                    var lastOption = displayedOptions.length > 0 ? displayedOptions[displayedOptions.length - 1] : null;
                    if (lastOption && !moveOptionAndGroupSvc.isRealOption(lastOption) && lastOption.referToGroupAlias === optionList.optionGroups[destGroupIndex].alias) {
                        optionList.optionGroups.splice(destGroupIndex, 0, event.source.itemScope.modelValue);
                    } else {
                        optionList.optionGroups.splice(destGroupIndex + 1, 0, event.source.itemScope.modelValue);
                    }
                }
            }

            function processDestOptionsAboveDestIndex() {
                var destGroupIndex = detectDestGroupIndex();
                var destGroup = optionList.optionGroups[destGroupIndex];
                if (destGroup.alias === null || !destGroup.hideHeading) return;
                if (destGroup.alias !== moveOptionAndGroupSvc.getGroupAliasOfLastOption(event.source.itemScope.modelValue)) return;

                var previousGroup = moveOptionAndGroupSvc.getPreviousGroupByAlias(optionList, destGroup.alias);
                if (!previousGroup) return;

                var previousGroupAlias = moveOptionAndGroupSvc.getGroupAliasOfLastOption(previousGroup);
                var containedGroup = moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, previousGroupAlias);
                for (var i = 0; i < event.dest.index; i++) {
                    var option = event.dest.sortableScope.modelValue[i];
                    if (moveOptionAndGroupSvc.isRealOption(option) && option.groupAlias !== previousGroupAlias) {
                        option.groupAlias = previousGroupAlias;
                        containedGroup.displayedOptions.push(option);
                    }
                }
            }

            function moveToBottom() {
                var destGroupIndex = detectDestGroupIndex();
                var destGroupAlias = optionList.optionGroups[destGroupIndex].alias;
                updateOptionsBelowSourceGroup();
                processDestOptionsAboveDestIndex();
                event.dest.sortableScope.modelValue.splice(event.dest.index, 1);
                var destGroup = moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, destGroupAlias);
                if (destGroup.hideHeading) {
                    optionList.optionGroups.splice(destGroupIndex + 1, 0, event.source.itemScope.modelValue);
                } else {
                    if (moveOptionAndGroupSvc.isRealOption(destGroup.displayedOptions[destGroup.displayedOptions.length - 1])) {
                        optionList.optionGroups.splice(destGroupIndex + 1, 0, event.source.itemScope.modelValue);
                    } else {
                        optionList.optionGroups.splice(destGroupIndex + 2, 0, event.source.itemScope.modelValue);
                    }
                }
                moveGroupEndOfSourceGroup();
                moveOptionAndGroupSvc.removeDisplayedOptionNotBelongToGroup(destGroup);
            }

            function updateOptionsBelowSourceGroup() {
                if (!isMoveGroupHeaderAndGroupEnd()) return;
                var groupEndAlias = moveOptionAndGroupSvc.getGroupAliasOfLastOption(event.source.itemScope.modelValue);
                var previousGroup = moveOptionAndGroupSvc.getPreviousGroupByAlias(optionList, groupEndAlias);
                if (!previousGroup) return;
                var groupEnd = moveOptionAndGroupSvc.getOptionGroupByAlias(optionList, groupEndAlias);
                var movedOptions = [];
                var groupAlias = moveOptionAndGroupSvc.getGroupAliasOfLastOption(previousGroup);
                for (var i = 0; i < groupEnd.displayedOptions.length; i++) {
                    if (moveOptionAndGroupSvc.isRealOption(groupEnd.displayedOptions[i])) {
                        groupEnd.displayedOptions[i].groupAlias = groupAlias;
                        movedOptions.push(groupEnd.displayedOptions[i]);
                        groupEnd.displayedOptions.splice(i, 1);
                        i--;
                    }
                }
                previousGroup.displayedOptions = previousGroup.displayedOptions.concat(movedOptions);
            }
        }
    }
})();