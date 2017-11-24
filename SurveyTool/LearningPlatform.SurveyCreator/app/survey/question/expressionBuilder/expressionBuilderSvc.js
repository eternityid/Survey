(function () {
    angular.module('svt').service('expressionBuilderSvc', expressionBuilderSvc);
    expressionBuilderSvc.$inject = [
        'expressionBuilderConst', 'surveyEditorSvc', 'surveyEditorPageSvc',
        'questionConst', 'arrayUtilSvc', 'questionCarryOverSvc', 'surveyContentValidation',
        'settingConst', 'numberUtilSvc', 'guidUtilSvc', 'expressionItemSvc', 'questionTypeSvc'
    ];

    function expressionBuilderSvc(
        expressionBuilderConst, surveyEditorSvc, surveyEditorPageSvc,
        questionConst, arrayUtilSvc, questionCarryOverSvc, surveyContentValidation,
        settingConst, numberUtilSvc, guidUtilSvc, expressionItemSvc, questionTypeSvc) {
        var _expression;
        var QUESTION_TYPES = questionConst.questionTypes;
        var _groupIndent = 0,
            _itemIndent = 1;

        var service = {
            setupRequiredProperties: setupRequiredProperties,
            setExpression: setExpression,
            getSummaryExpression: getSummaryExpression,
            getExpressionItemGroupInfo: getExpressionItemGroupInfo,
            updateExpressionItems: updateExpressionItems,
            getQuestionsForExpression: getQuestionsForExpression,
            getDefaultExpression: getDefaultExpression,
            getPreviousExpressionItem: getPreviousExpressionItem,
            getQuestionsForExpressionByPageId: getQuestionsForExpressionByPageId,
            validateExpression: validateExpression,
            buildQuestionViewModelForExpression: buildQuestionViewModelForExpression,
            isErrorExpressionItem: isErrorExpressionItem,
            getSelectedQuestion: getSelectedQuestion,
            getQuestionById: getQuestionById
        };
        return service;

        function setupRequiredProperties() {
            var currentGroupGuid,
                firstGroupGuid;
            _expression.expressionItems.forEach(function (item, index) {
                item.position = index;
                if (item.indent === _groupIndent) {
                    currentGroupGuid = item.guid;
                    if (!firstGroupGuid) {
                        firstGroupGuid = item.guid;
                    }
                } else {
                    item.groupGuid = currentGroupGuid;
                    var nextItem = index < _expression.expressionItems.length - 1 ?
                        _expression.expressionItems[index + 1] : null;
                    var isNextGroup = nextItem && nextItem.indent === _groupIndent;
                    if (isNextGroup || nextItem === null) {
                        item.isLastExpressionInGroup = true;
                        item.isLastExpressionInFirstGroup =
                            currentGroupGuid === firstGroupGuid && firstGroupGuid !== undefined;
                    } else {
                        item.isLastExpressionInGroup = false;
                        item.isLastExpressionInFirstGroup = false;
                    }
                }
            });
        }

        function setExpression(sharedExpression) {
            _expression = sharedExpression;
        }

        function getSummaryExpression() {
            return {
                totalOfLevel0Groups: getTotalOfLevelOGroups(),
                totalOfItems: _expression.expressionItems.length
            };

            function getTotalOfLevelOGroups() {
                return _expression.expressionItems.filter(function (item) {
                    return item.indent === 0;
                }).length;
            }
        }

        function getExpressionItemGroupInfo(expressionItems, expressionItemGroupPosition) {
            var expressionItemsInGroup = [];

            for (var index = expressionItemGroupPosition; index < expressionItems.length; index++) {
                var item = expressionItems[index];
                if (index !== expressionItemGroupPosition && item.indent === 0) break;
                expressionItemsInGroup.push(item);
            }

            return {
                firstItemPosition: expressionItemsInGroup[0].position,
                lastItemPosition: expressionItemsInGroup[expressionItemsInGroup.length - 1].position,
                numOfItemsInGroup: expressionItemsInGroup.length
            };
        }

        function updateExpressionItems(expressionItems) {
            service.setupRequiredProperties();
            var expressionItemGroups = [],
                expressionItemsInGroup = [];
            pullDataForGroup();
            setLogicalOperatorForGroup();
            return;

            function pullDataForGroup() {
                for (var index = 0; index < expressionItems.length; index++) {
                    var item = expressionItems[index];

                    if (item.indent === 0) {
                        expressionItemsInGroup = [];
                        expressionItemGroups.push(expressionItemsInGroup);
                    }

                    expressionItemsInGroup.push(item);
                }
            }

            function setLogicalOperatorForGroup() {
                var logicalOperatorConst = '';
                var numOfExpressionItemGroups = expressionItemGroups.length;
                for (var i = 0; i < numOfExpressionItemGroups; i++) {
                    var items = expressionItemGroups[i];

                    for (var j = 0; j < items.length; j++) {
                        if (!items[j].logicalOperator) {
                            logicalOperatorConst = expressionBuilderConst.logicalOperators.and.value;
                            if (j > 0 && j < (items.length - 1) && items[j - 1].indent > 0 && items[j - 1].logicalOperator === expressionBuilderConst.logicalOperators.or.value) {
                                if (j + 1 !== items.length - 1 || items[j + 1].logicalOperator) {
                                    logicalOperatorConst = expressionBuilderConst.logicalOperators.or.value;
                                    items[j - 1].logicalOperator = expressionBuilderConst.logicalOperators.and.value;
                                }
                            }
                            items[j].logicalOperator = logicalOperatorConst;
                        }
                    }
                    items[items.length - 1].logicalOperator = null;

                    if (i === 0) {
                        items[0].logicalOperator = null;
                    }
                }
            }
        }

        function getQuestionsForExpressionByPageId(pageId) {
            var pages = surveyEditorSvc.getPages(),
                questionsForExpression = [];

            for (var i = 0; i < pages.length; i++) {
                var page = pages[i];
                if (surveyEditorPageSvc.isThankYouPage(page)) continue;

                for (var j = 0; j < page.questionDefinitions.length; j++) {
                    var question = page.questionDefinitions[j];
                    var questionViewModelForExpression = service.buildQuestionViewModelForExpression(question);
                    if (questionViewModelForExpression) questionsForExpression.push(questionViewModelForExpression);
                }

                if (page.id === pageId) break;
            }

            return questionsForExpression;
        }

        function getQuestionsForExpression(parentQuestion) {
            var pages = surveyEditorSvc.getPages(),
                questionsForExpression = [];

            for (var i = 0; i < pages.length; i++) {
                var page = pages[i];
                if (surveyEditorPageSvc.isThankYouPage(page)) continue;
                if (parentQuestion.pageId === page.id) break;

                for (var j = 0; j < page.questionDefinitions.length; j++) {
                    var question = page.questionDefinitions[j];
                    var questionViewModelForExpression = service.buildQuestionViewModelForExpression(question);
                    if (questionViewModelForExpression) questionsForExpression.push(questionViewModelForExpression);
                }
            }

            return questionsForExpression;
        }

        function validateExpression(expressionBuilder) {
            var expressionItems = expressionBuilder.expressionItems,
                expressionItemGroups = getExpressionItemGroups();

            return validateExpressionItemGroups();

            function getExpressionItemGroups() {
                var groups = [],
                    itemsInGroup = [];

                for (var index = 0; index < expressionItems.length; index++) {
                    var item = expressionItems[index];
                    item.position = index;

                    if (item.indent === 0) {
                        itemsInGroup = [];
                        groups.push(itemsInGroup);
                    }

                    itemsInGroup.push(item);
                }

                return groups;
            }

            function validateExpressionItemGroups() {
                var numOfGroups = expressionItemGroups.length;

                if (expressionItemGroups[0][0].logicalOperator) return false;

                for (var m = 1; m < numOfGroups - 1; m++) {
                    if (expressionItemGroups[m][0].logicalOperator === null) return false;
                }

                for (var n = 0; n < numOfGroups; n++) {
                    if (!expressionItemSvc.validateExpressionItemsInGroup(expressionItemGroups[n])) return false;
                }

                return true;
            }
        }

        function buildQuestionViewModelForExpression(question) {
            if (!questionTypeSvc.canUseExpressionItemFrom(question.$type)) return;

            var questionViewModel = {
                id: question.id,
                alias: question.alias,
                questionType: question.$type,
                title: question.title.items[0].text
            };
            if (questionTypeSvc.isQuestionTypeHasOptions(question.$type)) {
                questionViewModel.options = getQuestionOptions(question.id, question.optionList);
            }
            return questionViewModel;

            function getQuestionOptions(questionId, questionOptionList) {
                var optionsViewModel = [];
                if (!questionOptionList) return optionsViewModel;

                questionOptionList.options.forEach(function (option) {
                    option.optionsMask = option.optionsMask;
                });

                var options = questionCarryOverSvc.getExpandOptions(questionId, questionOptionList.options);

                options.forEach(function (option) {
                    optionsViewModel.push({
                        id: option.id,
                        text: (option.text) ? option.text.items[0].text : option.value,
                        alias: option.alias || option.alias
                    });
                });
                return optionsViewModel;
            }
        }

        function getDefaultExpression() {
            var defaultExpression = {
                id: '',
                expressionItems: [
                    {
                        questionId: null,
                        optionId: null,
                        operator: null,
                        logicalOperator: null,
                        indent: 0,
                        guid: guidUtilSvc.createGuid()
                    },
                    {
                        questionId: null,
                        optionId: null,
                        operator: null,
                        logicalOperator: null,
                        indent: 1,
                        guid: guidUtilSvc.createGuid()
                    }
                ]
            };
            return defaultExpression;
        }

        function getPreviousExpressionItem(expressionItems, expressionItemPosition) {
            var groups = [], items = [];
            for (var i = 0; i < expressionItems.length; i++) {
                var item = expressionItems[i];

                if (item.position === expressionItemPosition) {
                    if (item.indent === 0 && groups.length > 0) return groups[groups.length - 1];
                    if (item.indent === 1 && items.length > 0) return items[items.length - 1];
                } else {
                    if (item.indent === 0) {
                        groups.push(item);
                    } else {
                        items.push(item);
                    }
                }
            }
            return null;
        }

        function isErrorExpressionItem(expressionItem) {
            var error = surveyContentValidation.getErrorByExpressionItemGuid(expressionItem.guid);
            if (error && error.hasOwnProperty('expressionItem') &&
                error.expressionItem.questionId === expressionItem.questionId &&
                error.expressionItem.optionId === expressionItem.optionId &&
                error.expressionItem.operator === expressionItem.operator &&
                error.expressionItem.value === expressionItem.value) {
                return true;
            }
            return false;
        }

        //TODO refactor move it to question service
        function getSelectedQuestion(questions, questionId) {
            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];
                if (question.id === questionId) {
                    return question;
                }
            }
            return null;
        }

        //TODO refactor move it to another service (sample question, survey ...)
        function getQuestionById(questionId) {
            var pages = surveyEditorSvc.getPages();
            for (var i = 0; i < pages.length; i++) {
                var page = pages[i];

                for (var j = 0; j < page.questionDefinitions.length; j++) {
                    var question = page.questionDefinitions[j];
                    if (question.id === questionId) return question;
                }
            }
            return null;
        }
    }
})();