(function () {
    angular
        .module('svt')
        .service('selectionOptionListSvc', SelectionOptionListSvc);
    SelectionOptionListSvc.$inject = [
        'surveyEditorValidationSvc', 'arrayUtilSvc', 'surveyEditorMessageSvc', 'languageStringUtilSvc',
        'guidUtilSvc', 'stringUtilSvc', 'questionCarryOverSvc', 'surveyContentValidation', 'questionTypeSvc'
    ];

    function SelectionOptionListSvc(
        surveyEditorValidationSvc, arrayUtilSvc, surveyEditorMessageSvc, languageStringUtilSvc,
        guidUtilSvc, stringUtilSvc, questionCarryOverSvc, surveyContentValidation, questionTypeSvc) {
        var service = {
            buildDefaultOptions: buildDefaultOptions,
            canAddNewOption: canAddNewOption,
            buildNewOptionBasedOnExistedOptions: buildNewOptionBasedOnExistedOptions,
            buildDefaultOtherQuestionDefinition: buildDefaultOtherQuestionDefinition,
            buildOptionListForMovingOptions: buildOptionListForMovingOptions,
            validateOptions: validateOptions,
            validateOptionTitles: validateOptionTitles,
            validateOptionGroupTitles: validateOptionGroupTitles,
            validateOptionAliases: validateOptionAliases,
            getValidateMessagesWhenRemovingOption: getValidateMessagesWhenRemovingOption,
            buildNewOptionGroupHeader: buildNewOptionGroupHeader,
            buildNewGroupEnd: buildNewGroupEnd,
            validateOptionGroup: validateOptionGroup,
            sortOptionGroups: sortOptionGroups,
            getRealOptionHeaderTitles: getRealOptionHeaderTitles
        };
        return service;

        function sortOptionGroups(optionList) {
            return angular.copy(optionList.optionGroups);
        }

        function getValidateMessagesWhenRemovingOption(question, options) {
            var validationResult = {
                willBeAffectedOther: false,
                message: ''
            };
            var questionPositionsUsed = surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseOptions(question, options),
                pageTitlesUsed = surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseOptions(options);

            if (!arrayUtilSvc.isElementHasSubElement([questionPositionsUsed, pageTitlesUsed])) {
                return validationResult;
            }

            var messageBuilder = [];
            var messageContent = surveyEditorMessageSvc.buildReferenceQuestionPageMessageContent(
                [], questionPositionsUsed, [], pageTitlesUsed);
            var optionTitles = options.map(function (option) {
                return option.text.items[0].text;
            }).join(', ');

            messageBuilder.push('<strong>Deleting <i>' + optionTitles + '</i> will affect other questions/pages in survey.</strong>');
            messageBuilder.push(messageContent);
            messageBuilder.push('Do you want to delete this option?');

            validationResult.willBeAffectedOther = true;
            validationResult.message = messageBuilder.join('<br/><br/>');
            return validationResult;
        }

        function buildDefaultOptions(surveyId, isTopic) {
            var prefixOptionName = isTopic ? 'Topic' : 'Option';
            return [{
                $type: "Option",
                text: languageStringUtilSvc.buildLanguageString(surveyId, prefixOptionName + ' 1'),
                alias: "1",
                isFixedPosition: false,
                isExclusive: false,
                isNotApplicable: false,
                optionsMask: {
                    $type: "OptionsMask",
                    questionId: null,
                    optionsMaskType: null,
                    customOptionsMask: null
                },
                otherQuestionDefinition: null,
                pictureName: null,
                groupAlias: null,
                referenceListId: null,
                guid: prefixOptionName + guidUtilSvc.createGuid()
            }];
        }

        function canAddNewOption(optionList, displayLogic) {
            if (displayLogic.hasOwnProperty('maximumOfOptions') &&
                displayLogic.maximumOfOptions !== null && displayLogic.maximumOfOptions !== undefined &&
                optionList.options.length >= displayLogic.maximumOfOptions) return false;
            return true;
        }

        function buildNewOptionBasedOnExistedOptions(optionList, isTopic) {
            var prefixOptionName = isTopic ? 'Topic' : 'Option';
            var nextOptionOrderNumber = generateNextOptionOrderNumber();

            return {
                $type: "Option",
                text: languageStringUtilSvc.buildLanguageString(optionList.surveyId, prefixOptionName + ' ' + nextOptionOrderNumber),
                alias: String(nextOptionOrderNumber),
                isFixedPosition: false,
                isExclusive: false,
                isNotApplicable: false,
                optionsMask: {
                    $type: "OptionsMask",
                    questionId: null,
                    optionsMaskType: null,
                    customOptionsMask: null
                },
                otherQuestionDefinition: null,
                pictureName: null,
                groupAlias: getLastOptionGroupAlias(),
                referenceListId: null,
                guid: prefixOptionName + guidUtilSvc.createGuid()
            };

            function generateNextOptionOrderNumber() {
                var suitableOptions = optionList.options.filter(function (option) {
                    return !isNaN(parseInt(option.alias));
                });
                var numbers = suitableOptions.map(function (option) {
                    return parseInt(option.alias);
                });
                numbers.sort(function (value1, value2) {
                    return value2 - value1;
                });

                return numbers.length > 0 ? numbers[0] + 1 : 1;
            }

            function getLastOptionGroupAlias() {
                return optionList.optionGroups.length > 0 ?
                    optionList.optionGroups[optionList.optionGroups.length - 1].alias : null;
            }
        }

        function buildNewOptionGroupHeader(optionList) {
            var prefix = 'group';
            var nextGroupAliasNumber = generateNextGroupAliasNumber(optionList.optionGroups, prefix);
            var newOptionGroupHeader = generateNewOptionGroup(optionList, prefix, nextGroupAliasNumber);

            newOptionGroupHeader.heading = languageStringUtilSvc.buildLanguageString(optionList.surveyId, 'Option Group ' + nextGroupAliasNumber);
            newOptionGroupHeader.hideHeading = false;

            return newOptionGroupHeader;
        }

        function buildNewGroupEnd(optionList) {
            var prefix = 'end';
            var nextGroupAliasNumber = generateNextGroupAliasNumber(optionList.optionGroups, prefix);
            var newGroupEnd = generateNewOptionGroup(optionList, prefix, nextGroupAliasNumber);

            newGroupEnd.heading = languageStringUtilSvc.buildLanguageString(optionList.surveyId, 'Group End ' + nextGroupAliasNumber);
            newGroupEnd.hideHeading = true;

            return newGroupEnd;
        }

        function generateNewOptionGroup(optionList, prefix, generatedNumber) {
            return {
                $type: "OptionGroup",
                alias: prefix + generatedNumber,
                guid: prefix + guidUtilSvc.createGuid(),
                orderType: 0
            };
        }

        function generateNextGroupAliasNumber(optionGroups, groupKey) {
            var suitableOptionGroups = optionGroups.filter(function (optionGroup) {
                return optionGroup.alias &&
                    optionGroup.alias.indexOf(groupKey) === 0 &&
                    !isNaN(parseInt(optionGroup.alias.replace(groupKey, '')));
            });
            var orderNumbers = suitableOptionGroups.map(function (optionGroup) {
                return parseInt(optionGroup.alias.replace(groupKey, ''));
            });
            orderNumbers.sort(function (number1, number2) {
                return number2 - number1;
            });
            return orderNumbers.length > 0 ? orderNumbers[0] + 1 : 1;
        }

        function buildDefaultOtherQuestionDefinition(surveyId) {
            return {
                $type: 'OpenEndedShortTextQuestionDefinition',
                alias: 'OtherQuestion-' + Date.now(),
                surveyId: surveyId
            };
        }

        function buildOptionListForMovingOptions(optionList) {
            setShowHideForOptionGroups();

            optionList.optionGroups.forEach(function (optionGroup) {
                optionGroup.options = optionList.options.filter(function (option) {
                    return option.groupAlias === optionGroup.alias;
                });

                var firstLabelOption = buildFirstLabelOption(optionGroup);
                var lastLabelOption = buildLastLabelOption(optionGroup);

                optionGroup.displayedOptions = [];
                if (firstLabelOption !== null) optionGroup.displayedOptions.push(firstLabelOption);
                optionGroup.displayedOptions = optionGroup.displayedOptions.concat(optionGroup.options);
                if (lastLabelOption !== null) optionGroup.displayedOptions.push(lastLabelOption);
            });
            return;

            function setShowHideForOptionGroups() {
                optionList.optionGroups.forEach(function (optionGroup) {
                    optionGroup.isDisplayed = false;
                    if (!optionGroup.hideHeading || optionGroup.alias === null) {
                        optionGroup.isDisplayed = true;
                        return;
                    }
                    var previousOptionGroup = getPreviousOptionGroup(optionGroup);
                    if (!previousOptionGroup || previousOptionGroup.alias === null || previousOptionGroup.hideHeading) {
                        optionGroup.isDisplayed = true;
                        return;
                    }

                    var options = getOptionsInOptionGroup(optionGroup);
                    optionGroup.isDisplayed = options.length > 0;
                });
            }

            function getPreviousOptionGroup(optionGroup) {
                var groupIndex = optionList.optionGroups.findIndex(function (group) {
                    return optionGroup.alias === group.alias;
                });
                return groupIndex > 0 ? optionList.optionGroups[groupIndex - 1] : null;
            }

            function getOptionsInOptionGroup(optionGroup) {
                return optionList.options.filter(function (option) {
                    return option.groupAlias === optionGroup.alias;
                });
            }

            function buildFirstLabelOption(optionGroup) {
                if (optionGroup.alias === null || !optionGroup.isDisplayed || !optionGroup.hideHeading) return null;
                var previousGroup = getPreviousOptionGroup(optionGroup);
                if (previousGroup && previousGroup.alias !== null && !previousGroup.hideHeading) return null;

                return {
                    renderAsLabel: true,
                    label: 'Group end',
                    isIndent: false,
                    id: optionGroup.id,
                    groupAlias: optionGroup.alias
                };
            }

            function buildLastLabelOption(optionGroup) {
                if (optionGroup.alias === null || !optionGroup.isDisplayed || optionGroup.hideHeading) return null;
                var nextOptionGroup = getNextOptionGroup(optionGroup);
                if (!nextOptionGroup || !nextOptionGroup.hideHeading) return null;

                return {
                    renderAsLabel: true,
                    label: 'Group end',
                    isIndent: true,
                    id: nextOptionGroup.id,
                    groupAlias: optionGroup.alias,
                    referToGroupAlias: nextOptionGroup.alias
                };
            }

            function getNextOptionGroup(optionGroup) {
                var index = optionList.optionGroups.findIndex(function (og) {
                    return og.alias === optionGroup.alias;
                });
                return index >= 0 && index < optionList.optionGroups.length - 1 ?
                    optionList.optionGroups[index + 1] : null;
            }
        }

        function validateOptions(questionId, options, optionGroups) {
            var expandOptions = questionCarryOverSvc.getExpandOptions(questionId, options);
            var optionGroupTitlesValidation;
            if (options) {
                optionGroupTitlesValidation = validateOption(questionId, options);
            }
            else {
                optionGroupTitlesValidation = service.validateOptionGroup(questionId, optionGroups);
            }

            if (optionGroupTitlesValidation && !optionGroupTitlesValidation.valid) {
                return optionGroupTitlesValidation;
            }

            var optionTitlesValidation = service.validateOptionTitles(questionId, options, expandOptions);
            if (!optionTitlesValidation.valid) {
                return optionTitlesValidation;
            }
            var carryOverOptionsValidationResult = validateCarryOverOptions();
            if (!carryOverOptionsValidationResult.valid) {
                return carryOverOptionsValidationResult;
            }
            return service.validateOptionAliases(questionId, options, expandOptions);

            function validateCarryOverOptions() {
                var validationResult = {
                    valid: true,
                    message: ''
                };

                for (var i = 0; i < options.length; i++) {
                    var option = options[i];
                    if (option.isCarryOverOption !== true) {
                        continue;
                    }
                    if (option.optionsMask.optionsMaskType === null || option.optionsMask.optionsMaskType === undefined) {
                        setErrorResult(validationResult, 'is missing Carry Over Option Type.', option, i);
                        break;
                    }

                    if (!option.optionsMask.questionId) {
                        setErrorResult(validationResult, 'is missing Carry Over From Question.', option, i);
                        break;
                    }
                    var questionMap = surveyContentValidation.getQuestionMapByQuestionId(option.optionsMask.questionId);
                    if (questionMap === null) {
                        setErrorResult(validationResult, 'uses Carry Over from non existing question.', option, i);
                        break;
                    }
                    if (!questionTypeSvc.canCarryOverFrom(questionMap.type)) {
                        setErrorResult(validationResult, 'uses Carry Over from unsupported question type.', option, i);
                        break;
                    }
                }

                return validationResult;

                function setErrorResult(result, message, option, index) {
                    result.valid = false;
                    result.message = 'Option at position "' + (index + 1) + '" ' + message;
                    result.optionGuid = option.guid;
                }
            }
        }

        function validateOptionGroup(questionId, optionGroups) {
            var optionGroupTitlesValidation = validateOptionGroupTitles(questionId, optionGroups);
            if (!optionGroupTitlesValidation.valid) {
                return optionGroupTitlesValidation;
            }
        }

        function validateOption(questionId, option) {
            var validateOptionResult = service.validateOptionTitles(questionId, option);
            if (!validateOptionResult.valid) {
                return validateOptionResult;
            }
        }

        function validateOptionGroupTitles(questionId, optionGroups) {
            var options = angular.copy(optionGroups);
            var validationResult = {
                valid: true,
                message: '',
                optionGroupId: ''
            };

            for (var i = 0; i < options.length; i++) {
                if (options[i].alias === null) {
                    options.splice(i, 1);
                }
            }

            for (var o = 0; o < options.length; o++) {
                if (stringUtilSvc.isEmpty(options[o].heading.items[0].text)) {
                    validationResult.valid = false;
                    validationResult.message = 'Option Group at position "' + (o + 1) + '" is missing title.';
                    validationResult.optionGuid = options[o].guid;
                    return validationResult;
                }
            }

            for (var k = 0; k < options.length; k++) {
                var option1 = options[k];
                for (var j = 0; j < options.length; j++) {
                    var option2 = options[j];
                    if ((option1.guid !== option2.guid || option1.id !== option2.id) &&
                        stringUtilSvc.isEquals(option1.heading.items[0].text, option2.heading.items[0].text)) {
                        validationResult.valid = true;
                        if (stringUtilSvc.isEquals(option1.parentQuestionId, option2.parentQuestionId)) {
                            validationResult.message = 'Option Group title "' + stringUtilSvc.getPlainText(option1.heading.items[0].text) + '" have already existed in question.';
                        } else {
                            validationResult.message = 'Option Group title "' + stringUtilSvc.getPlainText(option2.heading.items[0].text) + '" have already existed in question "' + option2.parentQuestionTitle + '".';
                        }
                        validationResult.optionGuid = option1.guid;
                        return validationResult;
                    }
                }
            }

            return validationResult;
        }

        function validateOptionTitles(questionId, options, expandOptions) {
            var validationResult = {
                valid: true,
                message: '',
                optionGuid: ''
            };

            for (var o = 0; o < options.length; o++) {
                if (options[o].isCarryOverOption !== true && stringUtilSvc.isEmpty(options[o].text.items[0].text)) {
                    validationResult.valid = false;
                    validationResult.message = 'Option at position "' + (o + 1) + '" is missing title.';
                    validationResult.optionGuid = options[o].guid;
                    return validationResult;
                }
            }

            if (!expandOptions) {
                expandOptions = questionCarryOverSvc.getExpandOptions(questionId, options);
            }

            for (var i = 0; i < expandOptions.length; i++) {
                var option1 = expandOptions[i];
                for (var j = 0; j < expandOptions.length; j++) {
                    var option2 = expandOptions[j];
                    if ((option1.guid !== option2.guid || option1.id !== option2.id) &&
                        stringUtilSvc.isEquals(option1.text.items[0].text, option2.text.items[0].text)) {
                        validationResult.valid = true;
                        if (stringUtilSvc.isEquals(option1.parentQuestionId, option2.parentQuestionId)) {
                            validationResult.message = 'Option title "' + stringUtilSvc.getPlainText(option1.text.items[0].text) + '" have already existed in question.';
                        } else {
                            validationResult.message = 'Option title "' + stringUtilSvc.getPlainText(option2.text.items[0].text) + '" have already existed in question "' + option2.parentQuestionTitle + '".';
                        }
                        validationResult.optionGuid = option1.guid;
                        return validationResult;
                    }
                }
            }

            return validationResult;
        }

        function validateOptionAliases(questionId, options, expandOptions) {
            var validationResult = {
                valid: true,
                message: '',
                optionGuid: ''
            };

            for (var o = 0; o < options.length; o++) {
                if (options[o].isCarryOverOption !== true && stringUtilSvc.isEmpty(options[o].alias) && options[o].$type !== 'OptionGroup') {
                    validationResult.valid = false;
                    validationResult.message = 'Option at position "' + (o + 1) + '" is missing alias.';
                    validationResult.optionGuid = options[o].guid;
                    return validationResult;
                }
            }

            if (!expandOptions) {
                expandOptions = questionCarryOverSvc.getExpandOptions(questionId, options);
            }

            for (var i = 0; i < expandOptions.length; i++) {
                var option1 = expandOptions[i];
                for (var j = 0; j < expandOptions.length; j++) {
                    var option2 = expandOptions[j];
                    if ((option1.guid !== option2.guid || option1.id !== option2.id) &&
                        stringUtilSvc.isEquals(option1.alias, option2.alias)) {
                        validationResult.valid = false;
                        if (stringUtilSvc.isEquals(option1.parentQuestionId, option2.parentQuestionId)) {
                            validationResult.message = 'Option alias "' + option1.alias + '" have already existed in question.';
                        } else {
                            validationResult.message = 'Option alias "' + option1.alias + '" have already existed in question "' + option2.parentQuestionTitle + '".';
                        }
                        validationResult.optionGuid = option1.guid;
                        return validationResult;
                    }
                }
            }

            return validationResult;
        }

        function getRealOptionHeaderTitles(optionList) {
            var realOptionHeaders = optionList.optionGroups.filter(function (optionGroup) {
                return optionGroup.alias !== null && !optionGroup.hideHeading;
            });
            return realOptionHeaders.map(function (optionGroup) {
                return optionGroup.heading.items[0].text;
            });
        }
    }
})();