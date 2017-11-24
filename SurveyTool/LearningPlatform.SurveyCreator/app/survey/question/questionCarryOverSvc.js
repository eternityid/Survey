(function () {
    angular.module('svt').service('questionCarryOverSvc', questionCarryOverSvc);

    questionCarryOverSvc.$inject = [
        'surveyEditorSvc', 'questionConst', 'arrayUtilSvc', 'stringUtilSvc'
    ];

    function questionCarryOverSvc(surveyEditorSvc, questionConst, arrayUtilSvc, stringUtilSvc) {
        var CARRY_OVER_DATA = {
            questions: [],
            relationships: {}
        };

        var service = {
            data: CARRY_OVER_DATA, //This property is used for testing
            setupData: setupData,
            getChildQuestionIds: getChildQuestionIds,
            getChildQuestionPositions: getChildQuestionPositions,
            getCarriedOverQuestionIdsByOptions: getCarriedOverQuestionIdsByOptions,
            getAvailableCarryOverQuestions: getAvailableCarryOverQuestions,
            getAvailableCarryOverQuestionsForOption: getAvailableCarryOverQuestionsForOption,
            getExpandOptions: getExpandOptions,
            getQuestionWithOptionsById: getQuestionWithOptionsById,
            getOptionsMaskQuestionTitle: getOptionsMaskQuestionTitle
        };

        return service;

        function getChildQuestionIds(questionId) {
            var childQuestionIds = [];

            buildChildQuestionIds(CARRY_OVER_DATA.relationships[questionId]);

            return arrayUtilSvc.removeDuplicatedPrimitiveElements(childQuestionIds);

            function buildChildQuestionIds(carryOverRelationship) {
                if (carryOverRelationship) {
                    childQuestionIds.push.apply(childQuestionIds, carryOverRelationship.childQuestionIds);
                    carryOverRelationship.childQuestionIds.forEach(function (id) {
                        buildChildQuestionIds(CARRY_OVER_DATA.relationships[id]);
                    });
                }
            }
        }

        function getChildQuestionPositions(questionId) {
            var childQuestionPositions = [];

            var childQuestionIds = service.getChildQuestionIds(questionId);
            var childQuestions = CARRY_OVER_DATA.questions.filter(function (q) {
                return arrayUtilSvc.hasValueIn(childQuestionIds, q.id);
            });

            childQuestionPositions = childQuestions.map(function (q) {
                return q.positionInSurvey;
            });

            return arrayUtilSvc.removeDuplicatedPrimitiveElements(childQuestionPositions);
        }

        function getCarriedOverQuestionIdsByOptions(options) {
            var carriedOverQuestionIds = [];

            options.forEach(function (o) {
                if (o.optionsMask && o.optionsMask.questionId) {
                    carriedOverQuestionIds.push(o.optionsMask.questionId);
                }
            });

            var copyOfCarriedOverQuestionIds = angular.copy(carriedOverQuestionIds);
            copyOfCarriedOverQuestionIds.forEach(function (id) {
                buildCarriedOverQuestionIds(CARRY_OVER_DATA.relationships[id]);
            });

            return arrayUtilSvc.removeDuplicatedPrimitiveElements(carriedOverQuestionIds);

            function buildCarriedOverQuestionIds(carryOverRelationship) {
                if (carryOverRelationship) {
                    carriedOverQuestionIds.push.apply(carriedOverQuestionIds, carryOverRelationship.carriedOverQuestionIds);
                    carryOverRelationship.carriedOverQuestionIds.forEach(function (id) {
                        buildCarriedOverQuestionIds(CARRY_OVER_DATA.relationships[id]);
                    });
                }
            }
        }

        function getAvailableCarryOverQuestions(questionId) {
            var childQuestionIds = service.getChildQuestionIds(questionId);
            var availableCarryOverQuestions = CARRY_OVER_DATA.questions.filter(function (q) {
                return q.id !== questionId &&
                       q.canBeCarriedOverTwoWay === true &&
                       arrayUtilSvc.hasValueIn(childQuestionIds, q.id) === false;
            });
            return availableCarryOverQuestions.map(function (q) {
                return {
                    id: q.id,
                    title: q.title.items[0].text
                };
            });
        }

        function getAvailableCarryOverQuestionsForOption(questionId, remainingOptions) {
            var childQuestionIds = service.getChildQuestionIds(questionId);
            var carriedOverQuestionIds = service.getCarriedOverQuestionIdsByOptions(remainingOptions);
            var availableCarryOverQuestions = CARRY_OVER_DATA.questions.filter(function (q) {
                return q.id !== questionId &&
                       q.canBeCarriedOverTwoWay === true &&
                       arrayUtilSvc.hasValueIn(carriedOverQuestionIds, q.id) === false &&
                       arrayUtilSvc.hasValueIn(childQuestionIds, q.id) === false;
            });
            return availableCarryOverQuestions.map(function (q) {
                return {
                    title: q.title.items[0].text,
                    id: q.id
                };
            });
        }

        function getExpandOptions(questionId, options) {
            var ALL_OPTIONS = [];

            var tempQuestion = {
                id: questionId,
                optionList: { options: options }
            };
            buildExpandOptions(tempQuestion);

            return ALL_OPTIONS;

            function buildExpandOptions(question) {
                ALL_OPTIONS.push.apply(ALL_OPTIONS, question.optionList.options.filter(function (o) {
                    return o.optionsMask && !o.optionsMask.questionId;
                }));

                var carriedOverQuestionIds = service.getCarriedOverQuestionIdsByOptions(question.optionList.options);
                carriedOverQuestionIds.forEach(function (id) {
                    var carriedOverQuestion = service.getQuestionWithOptionsById(id);
                    if (carriedOverQuestion) buildExpandOptions(carriedOverQuestion);
                });
            }
        }

        function getQuestionWithOptionsById(questionId) {
            var questions = CARRY_OVER_DATA.questions.filter(function (q) {
                return q.id === questionId;
            });
            return questions.length > 0 ? questions[0] : null;
        }

        function getOptionsMaskQuestionTitle(questionId) {
            var questionTitle = '';

            for (var i = 0; i < CARRY_OVER_DATA.questions.length; i++) {
                var question = CARRY_OVER_DATA.questions[i];
                if (question.canBeCarriedOverTwoWay === true && question.id === questionId) {
                    questionTitle = question.title.items[0].text;
                    break;
                }
            }

            return questionTitle;
        }

        function setupData() {
            var questionsWithOptions = surveyEditorSvc.getQuestionsWithOptions();

            angular.copy(setupQuestions(questionsWithOptions), CARRY_OVER_DATA.questions);
            angular.copy(setupCarryOverRelationships(), CARRY_OVER_DATA.relationships);
        }

        function setupQuestions(questionsWithOptions) {
            var data = [];

            questionsWithOptions.forEach(function (question) {
                if (question.subQuestionDefinition) {
                    if ([questionConst.questionTypes.shortText,
                        questionConst.questionTypes.longText,
                        questionConst.questionTypes.rating,
                        questionConst.questionTypes.scale].indexOf(question.subQuestionDefinition.$type) === -1) {
                        question.subQuestionDefinition.positionInSurvey = question.positionInSurvey;
                        data.push(question.subQuestionDefinition);
                    }
                } else {
                    question.canBeCarriedOverTwoWay = true;
                    for (var i = 0; i < question.optionList.options.length; i++) {
                        var option = question.optionList.options[i];
                        option.parentQuestionTitle = stringUtilSvc.getPlainText(question.title.items[0].text);
                        option.parentQuestionId = question.id;
                    }
                }
                data.push(question);
            });

            return data;
        }

        function setupCarryOverRelationships() {
            var relationships = {};

            CARRY_OVER_DATA.questions.forEach(buildCarriedOverRelationshipByQuestion);

            return relationships;

            function buildCarriedOverRelationshipByQuestion(question) {
                question.optionList.options.forEach(function (o) {
                    if (o.optionsMask && o.optionsMask.questionId) {
                        addDefaultRelationship(question.id, o.optionsMask.questionId);
                        updateRelationshipData(question.id, o.optionsMask.questionId);
                    }
                });
            }

            function addDefaultRelationship(questionId, carriedOverQuestionId) {
                if (!relationships.hasOwnProperty(questionId)) {
                    relationships[questionId] = {
                        carriedOverQuestionIds: [],
                        childQuestionIds: []
                    };
                }

                if (!relationships.hasOwnProperty(carriedOverQuestionId)) {
                    relationships[carriedOverQuestionId] = {
                        carriedOverQuestionIds: [],
                        childQuestionIds: []
                    };
                }
            }

            function updateRelationshipData(questionId, carriedOverQuestionId) {
                if (relationships[questionId].carriedOverQuestionIds.indexOf(carriedOverQuestionId) < 0) {
                    relationships[questionId].carriedOverQuestionIds.push(carriedOverQuestionId);
                }

                if (relationships[carriedOverQuestionId].childQuestionIds.indexOf(questionId) < 0) {
                    relationships[carriedOverQuestionId].childQuestionIds.push(questionId);
                }
            }

        }
    }
})();