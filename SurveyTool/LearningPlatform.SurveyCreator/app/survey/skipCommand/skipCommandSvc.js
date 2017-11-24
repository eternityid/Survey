(function() {
    angular.module('svt').service('skipCommandSvc', skipCommandSvc);
    skipCommandSvc.$inject = [
        'settingConst', 'expressionBuilderSvc', 'skipCommandEditorSvc', 'questionTypeSvc', 'arrayUtilSvc',
        'surveyEditorSvc', 'stringUtilSvc', 'surveyContentValidation'
    ];

    function skipCommandSvc(
        settingConst, expressionBuilderSvc, skipCommandEditorSvc, questionTypeSvc, arrayUtilSvc,
        surveyEditorSvc, stringUtilSvc, surveyContentValidation) {
        var questionTypesConst = settingConst.questionTypes;
        var service = {
            getDisplayedExpressionItems: getDisplayedExpressionItems
        };
        return service;

        function getDisplayedExpressionItems(expressionItems, pageId) {
            if (!expressionItems) return null;            
            var expressionMessages = [];

            var currentGroupExpressionMessage = null;
            var positionInGroup = 0;
            for (var i = 0; i < expressionItems.length; i++) {
                var expressionItem = getExpressionItem(expressionItems[i], pageId);
                var previousExpression = expressionBuilderSvc.getPreviousExpressionItem(
                    expressionItems, expressionItem.position);

                if (expressionItem.indent === 0) {
                    var messageGroup = (expressionItem.logicalOperator !== null && expressionItem.logicalOperator !== undefined) ?
                        skipCommandEditorSvc.renderLogicalOperatorStringForDisplay(expressionItem.logicalOperator) : 'WHEN';
                    currentGroupExpressionMessage = { indent: 0, message: messageGroup, position: expressionItem.position };
                    positionInGroup = 0;
                } else {
                    var message = buildDisplayedMessage(expressionItem, previousExpression);
                    expressionMessages.push({
                        indent: 1,
                        message: message,
                        position: expressionItem.position,
                        positionInGroup: positionInGroup,
                        parent: currentGroupExpressionMessage
                    });
                    positionInGroup++;
                }
            }
            return expressionMessages;
        }

        function getExpressionItem(expressionItem, pageId) {
            var expressionQuestions = expressionBuilderSvc.getQuestionsForExpressionByPageId(pageId);
            if (expressionItem.questionId) {
                var selectedQuestion = expressionBuilderSvc.getSelectedQuestion(expressionQuestions, expressionItem.questionId);
                if (!selectedQuestion) return expressionItem;

                //TODO whe set this property in view mode?
                expressionItem.isQuestionHasOptions = questionTypeSvc.isQuestionTypeHasOptions(selectedQuestion.questionType);
                expressionItem.questionType = selectedQuestion.questionType;
                expressionItem.questionName = getDisplayText(selectedQuestion.title);
                expressionItem.optionName =  getDisplayText(getOptionTitle(expressionItem.optionId));
            }
            return expressionItem;

            function getOptionTitle(optionId) {
                var optionTitlesInSurvey = surveyEditorSvc.getData().optionTitlesInSurvey;
                var matchOptionTitles = optionTitlesInSurvey.filter(function(optionTitle) {
                    return optionTitle.id === optionId;
                });
                return matchOptionTitles.length > 0 ? matchOptionTitles[0].title : '';
            }
        }

        function getDisplayText(inputText) {
            inputText = inputText || '';
            if (typeof inputText !== 'string') return '';

            var truncateLength = 40,
                truncateAppendText = '...',
                displayText = stringUtilSvc.getPlainText(inputText);

            return stringUtilSvc.truncateByCharAmount(displayText, truncateLength, truncateAppendText);
        }

        function buildDisplayedMessage(expressionItem, previousExpression) {
            if (expressionBuilderSvc.isErrorExpressionItem(expressionItem)) {
                var error = surveyContentValidation.getErrorByExpressionItemGuid(expressionItem.guid);
                return '<span class="question-view__content--error"><strong>' + error.message + '</strong></span>';
            }
            var messageItem = "";
            if (previousExpression && previousExpression.logicalOperator !== null && previousExpression.logicalOperator !== undefined) {
                messageItem = "<span class='logical-operator-title'>" +
                    skipCommandEditorSvc.renderLogicalOperatorStringForDisplay(previousExpression.logicalOperator) +
                    "</span>";
            }
            var questionName = " <span class='question-title'>" + expressionItem.questionName + "</span>";

            if (expressionItem.isQuestionHasOptions) {
                if (arrayUtilSvc.hasValueIn([questionTypesConst.NetPromoterScoreQuestionDefinition.value,
                    questionTypesConst.ScaleQuestionDefinition.value,
                    questionTypesConst.RatingQuestionDefinition.value], expressionItem.questionType)) {
                    messageItem += (messageItem ? " the" : "The") +
                        " question " + questionName + " <span class='operator-title'>" +
                        skipCommandEditorSvc.renderOperatorStringForDisplay(expressionItem.operator) + "</span> " +
                        getDisplayTextFromNPS(expressionItem);
                } else {
                    messageItem += (messageItem ? " the" : "The") +
                        " option <span class='option-title'>" + expressionItem.optionName + "</span> of question " +
                        questionName + " <span class='operator-title'>" +
                        skipCommandEditorSvc.renderOperatorStringForDisplay(expressionItem.operator) + "</span> " +
                        getDisplayTextFromNPS(expressionItem);
                }
            } else if (arrayUtilSvc.hasValueIn([questionTypesConst.NumericQuestionDefinition.value,
                questionTypesConst.OpenEndedShortTextQuestionDefinition.value,
                questionTypesConst.OpenEndedLongTextQuestionDefinition.value], expressionItem.questionType)) {
                messageItem += (messageItem ? " the" : "The") +
                    " question " + questionName + " <span class='operator-title'>" +
                    skipCommandEditorSvc.renderOperatorStringForDisplay(expressionItem.operator) + "</span> " +
                    (getDisplayText(expressionItem.value) || '');
            } else {
                messageItem += " has question type NA.";
            }
            return messageItem;
        }

        function getDisplayTextFromNPS(item) {
            if (arrayUtilSvc.hasValueIn([questionTypesConst.NetPromoterScoreQuestionDefinition.value,
                questionTypesConst.ScaleQuestionDefinition.value,
                questionTypesConst.RatingQuestionDefinition.value], item.questionType)) {

                return getDisplayText(item.value) || '';
            }
            return '';            
        }
    }
})();