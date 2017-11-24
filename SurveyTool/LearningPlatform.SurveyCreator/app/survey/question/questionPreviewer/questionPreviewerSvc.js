(function () {
    angular
        .module('svt')
        .service('questionPreviewerSvc', questionPreviewerSvc);

    questionPreviewerSvc.$inject = ['questionEditorSvc', 'questionWithOptionsSvc'];

    function questionPreviewerSvc(questionEditorSvc, questionWithOptionsSvc) {
        var UPDATING_COMMAND_TYPES = {
            questionTitle: 'QuestionTitle',
            questionDescription: 'QuestionDescription',
            advancedSettings: {
                required: 'AdvanceSetting_Required',
                alwaysHidden: 'AdvanceSetting_AlwaysHidden'
            },
            longText: {
                advancedSettings: 'LongText_AdvancedSettings'
            },
            scale: {
                content: 'Scale_Content'
            },
            netPromoterScore: {
                content: 'NetPromoterScore_Content'
            },
            rating: {
                content: 'Rating_Content'
            },
            simpleSelection: {
                content: 'SimpleSelection_Content'
            },
            simpleOptionGroupHeader: {
                content: 'SimpleOptionGroupHeader_Content'
            },
            pictureSelection: {
                isPictureShowLabel: 'PictureSelection_IsPictureShowLabel',
                content: 'PictureSelection_Content'
            },
            textList: {
                topicTitles: 'TextList_TopicTitles',
                subLongTextQuestionSize: 'TextList_SubLongTextQuestionSize'
            },
            selectionGrid: {
                content: 'SelectionGrid_Content'
            },
            scaleGrid: {
                topicTitles: 'ScaleGrid_TopicTitles',
                likertText: 'ScaleGrid_LikertText'
            },
            ratingGrid: {
                topicTitles: 'RatingGrid_TopicTitles',
                subQuestionContent: 'RatingGrid_SubQuestionContent'
            }
        };

        var updatingCommands = [];
        var reloadCommands = [];

        var service = {
            getUpdatingCommandTypes: getUpdatingCommandTypes,
            getUpdatingCommands: getUpdatingCommands,
            addOrUpdateUpdatingCommand: addOrUpdateUpdatingCommand,
            excuteUpdatingCommands: excuteUpdatingCommands,
            clearUpdatingCommands: clearUpdatingCommands,
            clearNullOptionGroups: clearNullOptionGroups,
            getReloadCommands: getReloadCommands,
            addReloadCommand: addReloadCommand,
            getLatestReloadCommand: getLatestReloadCommand,
            updateAlwaysHiddenMessage: updateAlwaysHiddenMessage
        };

        return service;

        function getUpdatingCommandTypes() {
            return UPDATING_COMMAND_TYPES;
        }

        function getUpdatingCommands() {
            return updatingCommands;
        }

        function addOrUpdateUpdatingCommand(commandType, value) {
            var indexOfCommand = getIndexOfCommandInList(commandType);

            if (indexOfCommand < 0) {
                updatingCommands.push({
                    type: commandType,
                    value: value,
                    callback: function () {
                        var iframe = $('#questionPreviewerIframe')[0];
                        if (iframe) {
                            iframe.contentWindow.postMessage({ type: commandType, value: value }, '*');
                        }
                    }
                });
            } else {
                updatingCommands[indexOfCommand].value = value;
            }

            function getIndexOfCommandInList(type) {
                for (var index = 0; index < updatingCommands.length; index++) {
                    if (updatingCommands[index].type === type) return index;
                }
                return -1;
            }
        }

        function excuteUpdatingCommands() {
            var numberOfUpdatingCommands = updatingCommands.length;

            for (var index = 0; index < numberOfUpdatingCommands; index++) {
                updatingCommands[index].callback();
            }

            updatingCommands.splice(0, numberOfUpdatingCommands); // Clear all excuted commands
        }

        function clearUpdatingCommands() {
            updatingCommands.splice(0, updatingCommands.length);
        }

        function clearNullOptionGroups(question) {
            var isNeedClearOptionGroups = question.hasOwnProperty('optionList') && question.optionList !== null && question.optionList.hasOwnProperty('optionGroups') && question.optionList.optionGroups !== null;
            var isNeedClearOptionGroupsInSubQuestionDefinition = question.hasOwnProperty('subQuestionDefinition') && question.subQuestionDefinition.hasOwnProperty('optionList') && question.subQuestionDefinition.optionList !== null && question.subQuestionDefinition.optionList.hasOwnProperty('optionGroups') && question.subQuestionDefinition.optionList.optionGroups !== null;

            if (isNeedClearOptionGroups) {
                question.optionList.optionGroups = question.optionList.optionGroups.filter(function (group) {
                    return group.alias !== null;
                });
            }
            if (isNeedClearOptionGroupsInSubQuestionDefinition) {
                question.subQuestionDefinition.optionList.optionGroups = question.subQuestionDefinition.optionList.optionGroups.filter(function (group) {
                    return group.alias !== null;
                });
            }
        }

        function getReloadCommands() {
            return reloadCommands;
        }

        function addReloadCommand(question) {
            var copyOfQuestion = angular.copy(question);

            copyOfQuestion.alias = copyOfQuestion.guid;
            copyOfQuestion.temporaryPictures = [];

            if (copyOfQuestion.optionList) {
                copyOfQuestion.optionList.options.forEach(function (o) {
                    o.alias = o.guid;
                    if (o.picture && o.picture.name) copyOfQuestion.temporaryPictures.push(o.picture.name);
                });
            }

            if (copyOfQuestion.subQuestionDefinition && copyOfQuestion.subQuestionDefinition.optionList) {
                copyOfQuestion.subQuestionDefinition.optionList.options.forEach(function (o) {
                    o.alias = o.guid;
                });
            }

            copyOfQuestion.questionMaskExpression = null;
            questionEditorSvc.cleanValidationsForSaving(copyOfQuestion);
            copyOfQuestion.optionsMask = questionWithOptionsSvc.getDefaultOptionsMask();

            reloadCommands.push({
                question: copyOfQuestion
            });
        }

        function getLatestReloadCommand() {
            var numberOfReloadCommands = reloadCommands.length;
            if (numberOfReloadCommands === 0) {
                return null;
            } else {
                var latestReloadCommand = angular.copy(reloadCommands[numberOfReloadCommands - 1]);
                reloadCommands.splice(0, numberOfReloadCommands);
                return latestReloadCommand;
            }
        }

        function updateAlwaysHiddenMessage(isAlwaysHidden) {
            var hiddenQuestionMessage = 'This question will not be displayed in the survey due to always hide setting';
            addOrUpdateUpdatingCommand(UPDATING_COMMAND_TYPES.advancedSettings.alwaysHidden, isAlwaysHidden ? hiddenQuestionMessage : '');
        }
    }
})();