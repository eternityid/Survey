(function () {
    angular.module('svt')
        .service('surveyContentValidation', SurveyContentValidation);
    SurveyContentValidation.$inject = [
        'surveyEditorSvc', 'questionConst', 'guidUtilSvc', 'expressionOperatorSvc', 'surveyErrorConst',
        'surveyContentValidationHelperSvc', 'questionTypeSvc'];

    function SurveyContentValidation(
        surveyEditorSvc, questionConst, guidUtilSvc, expressionOperatorSvc, surveyErrorConst,
        surveyContentValidationHelperSvc, questionTypeSvc) {
        var _relationship = surveyContentValidationHelperSvc.surveyContentRelationship;
        var _generalErrors = [];
        var ERROR_TYPES = surveyErrorConst.errorTypes;
        var expressionItemIndent = {
            group: 0,
            condition: 1
        };

        var service = {
            generalErrors: _generalErrors,
            validateLatestSurvey: validateLatestSurvey,
            isErrorQuestionContent: isErrorQuestionContent,
            isErrorSkipCommandContent: isErrorSkipCommandContent,
            getQuestionMapByQuestionId: getQuestionMapByQuestionId,
            getErrorsBySkipClientId: getErrorsBySkipClientId,
            getSkipToErrorBySkipClientId: getSkipToErrorBySkipClientId,
            getCarryOverErrorByOptionId: getCarryOverErrorByOptionId,
            getOptionsMaskErrorByQuesionId: getOptionsMaskErrorByQuesionId,
            getErrorByExpressionItemGuid: getErrorByExpressionItemGuid,
            getErrorsByQuestionId: getErrorsByQuestionId,
            resetGeneralErrors: resetGeneralErrors
        };
        return service;

        function validateLatestSurvey() {
            surveyContentValidationHelperSvc.buildSurveyContentRelationship();
            var errors = [];
            var pages = surveyEditorSvc.getPages();

            pages.forEach(function (page) {
                validateQuestions(page, errors);
                validateSkipActions(page, errors);
            });

            resetGeneralErrors();
            Array.prototype.push.apply(_generalErrors, errors);
        }

        function validateQuestions(page, errors) {
            page.questionDefinitions.forEach(function (question) {
                validateCarryOver(page.id, question, errors);
                validateDisplayLogic(page.id, question, errors);
                validateOptionsMask(page.id, question, errors);
            });
        }

        function validateCarryOver(pageId, question, errors) {
            if (!question.optionList) return;
            question.optionList.options.forEach(function (option) {
                validateCarryOverOption(option, false, pageId, question.id, errors);
            });
            if (!question.subQuestionDefinition || !question.subQuestionDefinition.optionList) return;
            question.subQuestionDefinition.optionList.options.forEach(function (option) {
                validateCarryOverOption(option, true, pageId, question.id, errors);
            });
        }

        function validateCarryOverOption(option, isInSubQuestion, pageId, questionId, errors) {
            if (option.optionsMask.questionId === null) return;
            var sourceQuestion = _relationship.questionMap[option.optionsMask.questionId];
            var error;

            if (sourceQuestion) {
                if (!questionTypeSvc.canCarryOverFrom(sourceQuestion.type)) {
                    error = generateCarryOverError(pageId, questionId, option.id, 'unsupported question type');
                }
            } else {
                error = generateCarryOverError(pageId, questionId, option.id, 'non existing question');
            }
            if (error) {
                error.isInSubQuestion = isInSubQuestion;
                error.carryOverFromQuestionId = option.optionsMask.questionId;
                errors.push(error);
            }
        }

        function generateCarryOverError(pageId, questionId, optionId, message) {
            var page = _relationship.pageMap[pageId];
            var question = _relationship.questionMap[questionId];
            var option = _relationship.optionMap[optionId];
            return {
                guid: guidUtilSvc.createGuid(),
                type: ERROR_TYPES.carryOver,
                pageId: pageId,
                pageTitle: page.title,
                questionId: question.id,
                questionType: question.type,
                questionTitle: question.title,
                questionAlias: question.alias,
                optionId: option.id,
                optionPosition: option.position,
                message: message
            };
        }

        function validateDisplayLogic(pageId, question, errors) {
            if (!question.questionMaskExpression) return;
            var conditionExpressionItems = question.questionMaskExpression.expressionItems.filter(function (item) {
                return item.indent === expressionItemIndent.condition;
            });
            conditionExpressionItems.forEach(function (item, index) {
                var errorMessage = getEpressionItemErrorMessage(item);
                if (errorMessage !== null) {
                    errors.push(generateDisplayLogicError(pageId, question.id, item, index + 1, errorMessage));
                }
            });
        }

        function generateDisplayLogicError(pageId, questionId, expressionItem, expressionItemPosition, message) {
            var page = _relationship.pageMap[pageId];
            var question = _relationship.questionMap[questionId];
            return {
                guid: guidUtilSvc.createGuid(),
                type: ERROR_TYPES.displayLogic,
                pageId: pageId,
                pageTitle: page.title,
                questionId: question.id,
                questionType: question.type,
                questionTitle: question.title,
                questionAlias: question.alias,
                expressionItem: {
                    guid: expressionItem.guid,
                    position: expressionItemPosition,
                    questionId: expressionItem.questionId,
                    optionId: expressionItem.optionId,
                    operator: expressionItem.operator,
                    value: expressionItem.value
                },
                message: message
            };
        }

        function getEpressionItemErrorMessage(item) {
            if (item.questionId === null) return null;
            if (!_relationship.questionMap.hasOwnProperty(item.questionId)) return 'non existing question';
            var sourceQuestion = _relationship.questionMap[item.questionId];
            var operators = expressionOperatorSvc.getOperatorsByQuestionType(sourceQuestion.type);
            if (operators === null) return 'unsupported question type';
            var validOperator = operators.some(function (operator) {
                return operator.value === item.operator;
            });
            if (!validOperator) return 'uses invalid operator';
            if (sourceQuestion.hasOwnProperty('optionIds') && item.optionId !== null) {
                if (sourceQuestion.optionIds.indexOf(item.optionId) < 0) return 'non existing option';
            }
            return null;
        }

        function validateOptionsMask(pageId, question, errors) {
            if (!question.optionsMask || question.optionsMask.questionId === null) return;
            var sourceQuestion = _relationship.questionMap[question.optionsMask.questionId];

            if (!sourceQuestion) {
                errors.push(generateOptionsMaskError(pageId, question.id, question.optionsMask.questionId, 'non existing question'));
            } else if (!questionTypeSvc.canUseOptionsMaskFrom(sourceQuestion.type)) {
                errors.push(generateOptionsMaskError(pageId, question.id, question.optionsMask.questionId, 'unsupported question type'));
            }
        }

        function generateOptionsMaskError(pageId, questionId, optionsMaskQuestionId, message) {
            var page = _relationship.pageMap[pageId];
            var question = _relationship.questionMap[questionId];
            return {
                guid: guidUtilSvc.createGuid(),
                type: ERROR_TYPES.optionsMask,
                pageId: pageId,
                pageTitle: page.title,
                questionId: question.id,
                questionType: question.type,
                questionTitle: question.title,
                questionAlias: question.alias,
                optionsMaskQuestionId: optionsMaskQuestionId,
                message: message
            };
        }

        function validateSkipActions(page, errors) {
            page.skipCommands.forEach(function (skip, index) {
                validateSkipAction(page.id, skip, index + 1, errors);
            });
        }

        function validateSkipAction(pageId, skipAction, skipIndex, errors) {
            var page = _relationship.pageMap[pageId];
            var conditionExpressionItems = skipAction.expression.expressionItems.filter(function (item) {
                return item.indent === expressionItemIndent.condition;
            });
            conditionExpressionItems.forEach(function (item, index) {
                var errorMessage = getEpressionItemErrorMessage(item);
                if (errorMessage !== null) {
                    var expressionError = {
                        guid: guidUtilSvc.createGuid(),
                        type: ERROR_TYPES.skipAction,
                        pageId: pageId,
                        pageTitle: page.title,
                        skipClientId: skipAction.clientId,
                        skipIndex: skipIndex,
                        expressionItem: {
                            guid: item.guid,
                            position: index + 1,
                            questionId: item.questionId,
                            optionId: item.optionId,
                            operator: item.operator,
                            value: item.value
                        },
                        message: errorMessage
                    };
                    errors.push(expressionError);
                }
            });
            var message = null;
            if (!_relationship.questionMap.hasOwnProperty(skipAction.skipToQuestionId)) {
                message = 'non existing question';
            }
            else {
                var destQuestion = _relationship.questionMap[skipAction.skipToQuestionId];
                var destPage = _relationship.pageMap[destQuestion.pageId];
                if (destPage.position <= page.position) {
                    message = 'invalid page';
                }
            }
            if (message !== null) {
                var skipError = {
                    guid: guidUtilSvc.createGuid(),
                    type: ERROR_TYPES.skipAction,
                    pageId: pageId,
                    pageTitle: page.title,
                    skipClientId: skipAction.clientId,
                    skipIndex: skipIndex,
                    skipToQuestionId: skipAction.skipToQuestionId,
                    message: message
                };
                errors.push(skipError);
            }
        }

        function isErrorQuestionContent(question) {
            questionErrorTypes = [ERROR_TYPES.carryOver, ERROR_TYPES.displayLogic, ERROR_TYPES.optionsMask];
            var questionErrors = _generalErrors.filter(function (error) {
                return questionErrorTypes.indexOf(error.type) >= 0;
            });
            return questionErrors.some(function (error) {
                return error.questionId === question.id;
            });
        }

        function isErrorSkipCommandContent(skipCommand) {
            return _generalErrors.some(function (error) {
                return error.type === ERROR_TYPES.skipAction && skipCommand.clientId === error.skipClientId;
            });
        }

        function getQuestionMapByQuestionId(id) {
            return _relationship.questionMap.hasOwnProperty(id) ?
                _relationship.questionMap[id] :
                null;
        }

        function getErrorsBySkipClientId(clientId) {
            return _generalErrors.filter(function (error) {
                return error.type === ERROR_TYPES.skipAction &&
                    error.hasOwnProperty('skipClientId') &&
                    error.skipClientId === clientId;
            });
        }

        function getSkipToErrorBySkipClientId(clientId) {
            return _generalErrors.find(function (error) {
                return error.type === ERROR_TYPES.skipAction &&
                    !error.hasOwnProperty('expressionItem') &&
                    error.hasOwnProperty('skipClientId') &&
                    error.skipClientId === clientId;
            });
        }

        function getCarryOverErrorByOptionId(optionId) {
            return _generalErrors.find(function (error) {
                return error.type === ERROR_TYPES.carryOver &&
                    error.hasOwnProperty('optionId') &&
                    error.optionId === optionId;
            });
        }

        function getOptionsMaskErrorByQuesionId(questionId) {
            return _generalErrors.find(function (error) {
                return error.type === ERROR_TYPES.optionsMask &&
                    error.hasOwnProperty('questionId') &&
                    error.questionId === questionId;
            });
        }

        function getErrorByExpressionItemGuid(expressionItemGuid) {
            return _generalErrors.find(function (error) {
                return error.hasOwnProperty('expressionItem') &&
                    error.expressionItem.guid === expressionItemGuid;
            });
        }

        function getErrorsByQuestionId(questionId) {
            return _generalErrors.filter(function (error) {
                var isQuestionError = [ERROR_TYPES.carryOver, ERROR_TYPES.displayLogic, ERROR_TYPES.optionsMask]
                    .indexOf(error.type) >= 0;
                return isQuestionError && error.hasOwnProperty('questionId') && error.questionId === questionId;
            });
        }

        function resetGeneralErrors() {
            _generalErrors.length = 0;
        }
    }
})();