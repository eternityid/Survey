(function () {
    angular.module('svt').service('questionEditorSvc', questionEditorSvc);
    questionEditorSvc.$inject = [
        'stringUtilSvc', 'arrayUtilSvc', 'surveyEditorValidationSvc',
        'surveyEditorMessageSvc', 'questionCarryOverSvc', 'questionConst', 'serverValidationSvc',
        'questionWithOptionsSvc', 'surveyEditorSvc'
    ];

    function questionEditorSvc(
        stringUtilSvc, arrayUtilSvc, surveyEditorValidationSvc,
        surveyEditorMessageSvc, questionCarryOverSvc, questionConst, serverValidationSvc,
        questionWithOptionsSvc, surveyEditorSvc) {

        var QUETION_TYPES = questionConst.questionTypes;
        var CKEDITOR_DATA = {
            placeholderQuestionItems: []
        };

        var service = {
            settingQuestionForCreating: settingQuestionForCreating,
            settingQuestionForUpdating: settingQuestionForUpdating,
            cleanOptionsMask: cleanOptionsMask,
            cleanValidationsForSaving: cleanValidationsForSaving,
            cleanOptionList: cleanOptionList,
            getValidationMessageWhenChangingQuestionType: getValidationMessageWhenChangingQuestionType,
            getValidationMessageWhenChangingOptionRange: getValidationMessageWhenChangingOptionRange,
            isQuestionChanged: isQuestionChanged,
            setSvtPlaceholderQuestionItems: setSvtPlaceholderQuestionItems,
            getSvtPlaceholderQuestionItems: getSvtPlaceholderQuestionItems
        };

        return service;

        function settingQuestionForCreating(vm) {
            cleanOptionsMask(vm.question);
            cleanValidationsForSaving(vm.question);

            vm.question.pageId = vm.pageId;
            vm.question.title.surveyId = vm.question.surveyId;
            vm.question.description.surveyId = vm.question.surveyId;

            return vm.question;
        }

        function settingQuestionForUpdating(vm) {
            cleanOptionsMask(vm.question);
            cleanValidationsForSaving(vm.question);
            return vm.question;
        }

        function cleanOptionsMask(question) {
            if (question.$type === QUETION_TYPES.singleSelection || question.$type === QUETION_TYPES.multipleSelection) {
                if (!question.advancedSettings.isUseOptionMask) question.optionsMask = questionWithOptionsSvc.getDefaultOptionsMask();
            }
        }

        function cleanValidationsForSaving(question) {
            //TODO later we will separate this function into each question type
            if (!question.validations) return;
            var serverValidationTypes = serverValidationSvc.getServerValidationTypes();

            question.validations.forEach(function(validation) {
                switch (validation.$type) {
                    case serverValidationTypes.required:
                        if (question.$type === QUETION_TYPES.information) {
                            validation.selected = false;
                        }
                        if (!validation.selected) {
                            validation.willBeRemoved = true;
                        }
                        delete validation.selected;
                        break;
                    case serverValidationTypes.length:
                    case serverValidationTypes.wordsAmount:
                        if ([QUETION_TYPES.shortText,
                             QUETION_TYPES.longText,
                             QUETION_TYPES.shortTextList,
                             QUETION_TYPES.longTextList].indexOf(question.$type) >= 0) {
                            updateRemoveFlagByMinMaxValues(validation);
                        } else {
                            validation.willBeRemoved = true;
                        }
                        break;
                    case serverValidationTypes.selection:
                        if (QUETION_TYPES.multipleSelection === question.$type) {
                            updateRemoveFlagByMinMaxValues(validation);
                        } else {
                            validation.willBeRemoved = true;
                        }
                        break;
                    case serverValidationTypes.rangeNumber:
                    case serverValidationTypes.decimalPlacesNumber:
                        if (QUETION_TYPES.numeric !== question.$type) {
                            validation.willBeRemoved = true;
                        }
                        break;
                    default:
                        break;
                }
            });

            question.validations = question.validations.filter(function(validation) {
                return validation.willBeRemoved !== true;
            });

            return;

            function updateRemoveFlagByMinMaxValues(rangeValidation) {
                if (stringUtilSvc.isEmpty(rangeValidation.min) && stringUtilSvc.isEmpty(rangeValidation.max)) {
                    rangeValidation.willBeRemoved = true;
                }
            }
        }

        function cleanOptionList(question) {
            if (question.optionList) {
                removeUnuseProperty(question.optionList.optionGroups);
            }
            if (question.subQuestionDefinition && question.subQuestionDefinition.optionList) {
                removeUnuseProperty(question.subQuestionDefinition.optionList.optionGroups);
            }
            return;

            function removeUnuseProperty(optionGroups) {
                if (optionGroups) {
                    for (var i = optionGroups.length - 1; i >= 0; i--) {
                        if (optionGroups[i].alias === null) {
                            optionGroups.splice(i, 1);
                        } else {
                            if (optionGroups[i].hasOwnProperty('options')) delete optionGroups[i].options;
                        }
                    }
                }
            }
        }

        function getValidationMessageWhenChangingQuestionType(originalQuestion, newQuestionType) {
            var validationResult = {
                willBeAffectedOther: false,
                message: ''
            };

            if (!originalQuestion || originalQuestion.$type === newQuestionType) {
                return validationResult;
            }

            var childQuestionPositions = questionCarryOverSvc.getChildQuestionPositions(originalQuestion.id);
            var questionMarkPositions = surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseQuestion(originalQuestion);
            var optionMaskPositions = surveyEditorValidationSvc.getQuestionPositionsHaveOptionMarkUseQuestions([originalQuestion]);
            var pageTitlesUseSkip = surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseQuestion(originalQuestion);

            if (!arrayUtilSvc.isElementHasSubElement([childQuestionPositions, questionMarkPositions, optionMaskPositions, pageTitlesUseSkip])) return validationResult;

            var messageBuilder = [];
            var messageContent = surveyEditorMessageSvc.buildReferenceQuestionPageMessageContent(
                childQuestionPositions, questionMarkPositions, optionMaskPositions, pageTitlesUseSkip);

            messageBuilder.push('<strong>Changing question type will affect other questions/pages in survey.</strong>');
            messageBuilder.push(messageContent);
            messageBuilder.push('Do you want to change this question type?');

            validationResult.willBeAffectedOther = true;
            validationResult.message = messageBuilder.join('<br/><br/>');
            return validationResult;
        }

        function getValidationMessageWhenChangingOptionRange(updatingQuestion) {
            var validationMessage = {
                willBeAffectedOther: false,
                message: ''
            };

            if (!arrayUtilSvc.hasValueIn([QUETION_TYPES.rating, QUETION_TYPES.scale], updatingQuestion.$type)) return validationMessage;

            var questionPositionsUseOutOfRangeInMask = surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseOutOfRange(updatingQuestion);
            var pageTitlesUseOutOfRangeInSkip = surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseOutOfRange(updatingQuestion);

            if (!arrayUtilSvc.isElementHasSubElement([questionPositionsUseOutOfRangeInMask, pageTitlesUseOutOfRangeInSkip])) return validationMessage;

            var messageBuilder = [];
            var messageContent = surveyEditorMessageSvc.buildReferenceQuestionPageMessageContent(
                [], questionPositionsUseOutOfRangeInMask, [], pageTitlesUseOutOfRangeInSkip);

            messageBuilder.push('<strong>Changing option range will affect other questions/pages in survey.</strong>');
            messageBuilder.push(messageContent);
            messageBuilder.push('Do you want to change this range?');

            validationMessage.willBeAffectedOther = true;
            validationMessage.message = messageBuilder.join('<br/><br/>');
            return validationMessage;
        }

        function isQuestionChanged(originalQuestion, newQuestion) {
            if (originalQuestion.$type !== newQuestion.$type ||
                originalQuestion.alias !== newQuestion.alias ||
                originalQuestion.isFixedPosition !== newQuestion.isFixedPosition)
                return true;
            if (!deepCompare(originalQuestion.title, newQuestion.title) ||
                !deepCompare(originalQuestion.description, newQuestion.description) ||
                !deepCompare(originalQuestion.questionMaskExpression, newQuestion.questionMaskExpression) ||
                !deepCompare(originalQuestion.validations, newQuestion.validations) ||
                !deepCompare(originalQuestion.rowVersion, newQuestion.rowVersion))
                return true;
            if (!isSameQuestionContentAndSettingsByQuestionType(originalQuestion, newQuestion)) return true;

            return false;

            function deepCompare(left, right) {
                if (angular.equals(left, right)) return true;

                if (!(left instanceof Object) || !(right instanceof Object))
                    return false;

                if (left.constructor !== right.constructor)
                    return false;

                for (var property in left) {
                    if (property.indexOf("$") >= 0 || property === "otherQuestionDefinition") continue;

                    if (property === "options") {
                        if (left[property].length !== right[property].length)
                            return false;
                    }

                    if (!left.hasOwnProperty(property)) continue;

                    if (!right.hasOwnProperty(property))
                        return false;

                    if (left[property] === right[property]) continue;

                    if (typeof left[property] !== "object")
                        return false;

                    if (!deepCompare(left[property], right[property]))
                        return false;
                }
                return true;
            }

            function isSameQuestionContentAndSettingsByQuestionType(leftQuestion, rightQuestion) {
                var sameContentAndSettings = true;
                switch (leftQuestion.$type) {
                    case QUETION_TYPES.longText:
                        sameContentAndSettings = leftQuestion.rows === rightQuestion.rows &&
                            leftQuestion.cols === rightQuestion.cols;
                        break;
                    case QUETION_TYPES.singleSelection:
                    case QUETION_TYPES.multipleSelection:
                        sameContentAndSettings = deepCompare(leftQuestion.optionList, rightQuestion.optionList) &&
                            deepCompare(leftQuestion.optionsMask, rightQuestion.optionsMask) &&
                            leftQuestion.displayOrientation === rightQuestion.displayOrientation &&
                            leftQuestion.orderType === rightQuestion.orderType;
                        break;
                    case QUETION_TYPES.rating:
                        sameContentAndSettings = deepCompare(leftQuestion.optionList, rightQuestion.optionList) &&
                            leftQuestion.shapeName === rightQuestion.shapeName;
                        break;
                    case QUETION_TYPES.scale:
                        sameContentAndSettings = deepCompare(leftQuestion.optionList, rightQuestion.optionList) &&
                            deepCompare(leftQuestion.likertLeftText, rightQuestion.likertLeftText) &&
                            deepCompare(leftQuestion.likertCenterText, rightQuestion.likertCenterText) &&
                            deepCompare(leftQuestion.likertRightText, rightQuestion.likertRightText) &&
                            leftQuestion.renderOptionByButton === rightQuestion.renderOptionByButton;
                        break;
                    case QUETION_TYPES.netPromoterScore:
                        sameContentAndSettings = deepCompare(leftQuestion.likertLeftText, rightQuestion.likertLeftText) &&
                            deepCompare(leftQuestion.likertRightText, rightQuestion.likertRightText) &&
                            leftQuestion.renderOptionByButton === rightQuestion.renderOptionByButton;
                        break;
                    case QUETION_TYPES.pictureSingleSelection:
                    case QUETION_TYPES.pictureMultipleSelection:
                        sameContentAndSettings = deepCompare(leftQuestion.optionList, rightQuestion.optionList) &&
                            leftQuestion.orderType === rightQuestion.orderType &&
                            leftQuestion.isPictureShowLabel === rightQuestion.isPictureShowLabel &&
                            leftQuestion.maxPicturesInGrid === rightQuestion.maxPicturesInGrid &&
                            leftQuestion.isScalePictureToFitContainer === rightQuestion.isScalePictureToFitContainer;
                        break;
                    case QUETION_TYPES.singleSelectionGrid:
                    case QUETION_TYPES.multipleSelectionGrid:
                        sameContentAndSettings = deepCompare(leftQuestion.optionList, rightQuestion.optionList) &&
                            deepCompare(leftQuestion.subQuestionDefinition, rightQuestion.subQuestionDefinition) &&
                            leftQuestion.transposed === rightQuestion.transposed;
                        break;
                    case QUETION_TYPES.scaleGrid:
                    case QUETION_TYPES.ratingGrid:
                        sameContentAndSettings = deepCompare(leftQuestion.optionList, rightQuestion.optionList) &&
                            deepCompare(leftQuestion.subQuestionDefinition, rightQuestion.subQuestionDefinition);
                        break;
                    case QUETION_TYPES.shortTextList:
                        sameContentAndSettings = deepCompare(leftQuestion.optionList, rightQuestion.optionList);
                        break;
                    case QUETION_TYPES.longTextList:
                        sameContentAndSettings = deepCompare(leftQuestion.optionList, rightQuestion.optionList) &&
                            deepCompare(leftQuestion.subQuestionDefinition, rightQuestion.subQuestionDefinition);
                        break;
                    default: break;
                }
                return sameContentAndSettings;
            }
        }

        function setSvtPlaceholderQuestionItems(questionId) {
            angular.copy(surveyEditorSvc.getSvtPlaceholderItemsByQuestionId(questionId), CKEDITOR_DATA.placeholderQuestionItems);
        }

        function getSvtPlaceholderQuestionItems() {
            return CKEDITOR_DATA.placeholderQuestionItems;
        }
    }
})();