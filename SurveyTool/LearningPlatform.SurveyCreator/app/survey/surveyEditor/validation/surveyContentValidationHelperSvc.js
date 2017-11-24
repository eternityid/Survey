(function () {
    angular.module('svt')
        .service('surveyContentValidationHelperSvc', SurveyContentValidationHelperSvc);
    SurveyContentValidationHelperSvc.$inject = [
        'surveyEditorSvc', 'questionConst'];

    function SurveyContentValidationHelperSvc(
        surveyEditorSvc, questionConst) {
        var _relationship = {};
        var _questionPosition = 0;
        var _informationPosition = 0;
        var service = {
            surveyContentRelationship: _relationship,
            buildSurveyContentRelationship: buildSurveyContentRelationship
        };
        return service;

        function buildSurveyContentRelationship() {
            resetRelationship();
            _questionPosition = 0;
            _informationPosition = 0;
            var pages = surveyEditorSvc.getPages();

            pages.forEach(function (page, index) {
                addPageMap(page, index);
                buildQuestionsMap(page);
            });
            buildFullOptionIdsByCarryOver();
        }

        function resetRelationship() {
            _relationship.pageMap = {};
            _relationship.questionMap = {};
            _relationship.optionMap = {};
        }

        function addPageMap(page, index) {
            var questionIds = page.questionDefinitions.map(function (question) {
                return question.id;
            });
            _relationship.pageMap[page.id] = {
                id: page.id,
                title: page.title ? page.title.items[0].text : '',
                position: index + 1,
                questionIds: questionIds
            };
        }

        function buildQuestionsMap(page) {
            page.questionDefinitions.forEach(function (question, index) {
                var position = 0;
                if (question.$type === questionConst.questionTypes.information) {
                    _informationPosition++;
                    position = _informationPosition;
                } else {
                    _questionPosition++;
                    position = _questionPosition;
                }

                _relationship.questionMap[question.id] = {
                    pageId: page.id,
                    id: question.id,
                    type: question.$type,
                    title: question.title ? question.title.items[0].text : '',
                    alias: question.alias,
                    position: position
                };
                var optionIds = getOptionIds(question);
                if (optionIds) {
                    _relationship.questionMap[question.id].optionIds = optionIds;
                }
                var carryOverOptionIds = getCarryOverOptionIds(question);
                if (carryOverOptionIds) {
                    _relationship.questionMap[question.id].carryOverOptionIds = carryOverOptionIds;
                }
                var subQuestionMap = buildSubQuestionMap(question);
                if (subQuestionMap) {
                    _relationship.questionMap[question.id].subQuestion = subQuestionMap;
                }
                buildOptionsMap(question);
            });
        }

        function buildSubQuestionMap(question) {
            var subQuestion = null;
            if (!question.subQuestionDefinition) return null;
            subQuestion = {
                type: question.subQuestionDefinition.$type
            };
            if (question.subQuestionDefinition.optionList) {
                var subOptionIds = question.subQuestionDefinition.optionList.options.map(function (option) {
                    return option.id;
                });
                subQuestion.optionIds = subOptionIds;
            }
            return subQuestion;
        }

        function getOptionIds(question) {
            if (!question.optionList) return null;
            return question.optionList.options.map(function (option) {
                return option.id;
            });
        }

        function getCarryOverOptionIds(question) {
            if (!question.optionList) return null;
            var options = question.optionList.options.filter(function (option) {
                return option.optionsMask.questionId !== null;
            });
            if (options.length === 0) return null;
            return options.map(function (option) {
                return option.id;
            });
        }

        function buildOptionsMap(question) {
            if (!question.optionList) return;
            question.optionList.options.forEach(function (option, index) {
                buildOptionMap(question.id, option, index + 1, false);
            });
            if (!question.subQuestionDefinition || !question.subQuestionDefinition.optionList) return;
            question.subQuestionDefinition.optionList.options.forEach(function (option, index) {
                buildOptionMap(question.id, option, index + 1, true);
            });
        }

        function buildOptionMap(questionId, option, index, isInSubQuestion) {
            _relationship.optionMap[option.id] = {
                id: option.id,
                inSubQuestion: isInSubQuestion,
                title: option.text ? option.text.items[0].text : '',
                position: index,
                questionId: questionId
            };
            if (option.optionsMask.questionId) {
                _relationship.optionMap[option.id].carryOverFrom = option.optionsMask.questionId;
            }
        }

        function buildFullOptionIdsByCarryOver() {
            var carryOverQuestion = getQuestionHasCarryOverOption();
            while (carryOverQuestion !== null) {
                parseOptionIdsForCarryOverQuestion(carryOverQuestion);
                carryOverQuestion = getQuestionHasCarryOverOption();
            }
        }

        function getQuestionHasCarryOverOption() {
            var question = null;
            for (var questionId in _relationship.questionMap) {
                if (!_relationship.questionMap.hasOwnProperty(questionId)) continue;
                if (_relationship.questionMap[questionId].carryOverOptionIds) {
                    question = _relationship.questionMap[questionId];
                    break;
                }
            }
            return question;
        }

        function parseOptionIdsForCarryOverQuestion(question) {
            //TODO not a very good solution but acceptable to reduce complexity
            //We don't need to process sub question now
            var newCarryOverIds = [];
            question.carryOverOptionIds.forEach(function (optionId) {
                var carryOverFromQuestion = _relationship.questionMap[_relationship.optionMap[optionId].carryOverFrom];
                if (carryOverFromQuestion === undefined) return;
                //Note don't need to check optionIds is existing or not. It musts be exist.
                var index = question.optionIds.indexOf(optionId);
                question.optionIds.splice.apply(question.optionIds, [index, 1].concat(carryOverFromQuestion.optionIds));

                if (carryOverFromQuestion.carryOverOptionIds) {
                    Array.prototype.push.apply(newCarryOverIds, carryOverFromQuestion.carryOverOptionIds);
                }

            });

            if (newCarryOverIds.length > 0) {
                question.carryOverOptionIds = newCarryOverIds;
            } else {
                delete question.carryOverOptionIds;
            }
        }
    }
})();