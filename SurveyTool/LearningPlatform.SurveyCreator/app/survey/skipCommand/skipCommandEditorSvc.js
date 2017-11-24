(function () {
    'use strict';

    angular
        .module('svt')
        .service('skipCommandEditorSvc', skipCommandEditorSvc);

    skipCommandEditorSvc.$inject = [
        'settingConst', 'expressionBuilderConst', 'surveyEditorSvc', 'numberUtilSvc', 'guidUtilSvc',
        'expressionBuilderSvc'];

    function skipCommandEditorSvc(
        settingConst, expressionBuilderConst, surveyEditorSvc, numberUtilSvc, guidUtilSvc,
        expressionBuilderSvc) {
        var OPERATORS = expressionBuilderConst.operators;
        var LOGILCAL_OPERATORS = expressionBuilderConst.logicalOperators;

        var service = {
            getQuestionDestinations: getQuestionDestinations,
            validateSkipCommand: validateSkipCommand,
            buildSkipCommand: buildSkipCommand,
            isSkipCommandRemainError: isSkipCommandRemainError,
            renderOperatorStringForDisplay: renderOperatorStringForDisplay,
            renderLogicalOperatorStringForDisplay: renderLogicalOperatorStringForDisplay,
            deepCompareSkipCommands: deepCompareSkipCommands
        };

        return service;

        function getQuestionDestinations(pageId) {
            var pages = surveyEditorSvc.getPages(),
                questionDestinations = [],
                minimumPagesInSurvey = 2;

            if (pages.length === minimumPagesInSurvey) return questionDestinations;

            var pageIdsInSurvey = getPageIdsInSurvey(),
                pageIndexInSurvey = pageIdsInSurvey.indexOf(pageId);

            if (pageIndexInSurvey < 0) return questionDestinations;
            var nextPageIndex = pageIndexInSurvey + 1;

            for (var i = nextPageIndex; i < pages.length; i++) {
                var page = pages[i];

                for (var j = 0; j < page.questionDefinitions.length; j++) {
                    var question = page.questionDefinitions[j];
                    questionDestinations.push({
                        id: question.id,
                        title: question.title.items[0].text
                    });
                }
            }

            return questionDestinations;

            function getPageIdsInSurvey() {
                var pageIds = [];

                for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
                    pageIds.push(pages[pageIndex].id);
                }

                return pageIds;
            }
        }

        function deepCompareSkipCommands(originalSkipCommand, newSkipCommand) {
            return deepCompare(originalSkipCommand, newSkipCommand);

            function deepCompare(left, right) {
                if (angular.equals(left, right)) return true;

                if (!(left instanceof Object) || !(right instanceof Object)) return false;

                if (left.constructor !== right.constructor) return false;

                for (var property in left) {
                    if (property.indexOf("$") >= 0) continue;
                    if (property === "logicalOperator") continue;

                    if (property === "expressionItems") {
                        if (left[property].length !== right[property].length) return false;
                    }

                    if (!left.hasOwnProperty(property)) continue;

                    if (!right.hasOwnProperty(property)) return false;

                    if (left[property] === right[property]) continue;

                    if (property === "value") {
                        if (left[property].replace(/['"]+/g, '') === right[property].replace(/['"]+/g, '')) continue;
                    }

                    if (typeof (left[property]) !== "object") return false;

                    if (!deepCompare(left[property], right[property])) return false;
                }
                return true;
            }
        }

        function validateSkipCommand(skipAction) {
            if (!skipAction.skipToQuestionId) {
                toastr.error('Skip To is required');
                return false;
            }

            if (!skipAction.expression || !expressionBuilderSvc.validateExpression(skipAction.expression)) {
                toastr.error('Invalid data in expression');
                return false;
            }

            return true;
        }

        function buildSkipCommand(skipCommand, surveyId, pageId) {
            var skipCommandViewModel = skipCommand ? angular.copy(skipCommand) : {
                $type: 'SkipCommand',
                surveyId: surveyId,
                pageDefinitionId: pageId,
                clientId: guidUtilSvc.createGuid()
            };
            skipCommandViewModel.questionDestinations = getQuestionDestinations(pageId);

            return skipCommandViewModel;
        }

        function isSkipCommandRemainError(errors, skipCommand) {
            if (errors.length === 0) return false;
            return haveExpressionError() ||
                haveSkipToError();

            function haveExpressionError() {
                var expressionItemErrors = errors.filter(function (error) {
                    return error.hasOwnProperty('expressionItem');
                });
                for (var i = 0; i < expressionItemErrors.length; i++) {
                    var errorItem = expressionItemErrors[i].expressionItem;
                    for (var j = 0; j < skipCommand.expression.expressionItems.length; j++) {
                        var item = skipCommand.expression.expressionItems[j];
                        if (errorItem.guid === item.guid &&
                            errorItem.questionId === item.questionId &&
                            errorItem.optionId === item.optionId &&
                            errorItem.operator === item.operator &&
                            errorItem.value === item.value) return true;
                    }
                }
                return false;
            }

            function haveSkipToError() {
                var skipToError = errors.find(function (error) {
                    return !error.hasOwnProperty('expressionItem') && error.hasOwnProperty('skipToQuestionId');
                });
                if (skipToError && skipToError.skipToQuestionId === skipCommand.skipToQuestionId) return true;
                return false;
            }
        }

        function renderOperatorStringForDisplay(operator) {
            for (var key in OPERATORS) {
                if (operator === OPERATORS[key].value) {
                    return OPERATORS[key].name;
                }
            }
            return '';
        }

        function renderLogicalOperatorStringForDisplay(logicalOperator) {
            for (var key in LOGILCAL_OPERATORS) {
                if (logicalOperator === LOGILCAL_OPERATORS[key].value) {
                    return LOGILCAL_OPERATORS[key].name;
                }
            }
            return '';
        }
    }
})();