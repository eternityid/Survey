(function () {
    'use strict';
    angular
        .module('svt')
        .service('selectionGridQuestionSvc', selectionGridQuestionSvc);

    selectionGridQuestionSvc.$inject = [
        'guidUtilSvc', 'languageStringUtilSvc', 'selectionOptionListSvc', 'questionConst'
    ];

    function selectionGridQuestionSvc(
        guidUtilSvc, languageStringUtilSvc, selectionOptionListSvc, questionConst) {
        var QUESTION_TYPES = questionConst.questionTypes;

        var service = {
            buildDefaultSubQuestionDefinition: buildDefaultSubQuestionDefinition
        };

        return service;

        function buildDefaultSubQuestionDefinition(question, isSingleSelectionGridQuestion) {
            var questionType = isSingleSelectionGridQuestion ? QUESTION_TYPES.singleSelection : QUESTION_TYPES.multipleSelection;
            var isTopic = false;

            return {
                $type: questionType,
                alias: guidUtilSvc.createGuid(),
                optionList: {
                    $type: 'OptionList',
                    surveyId: question.surveyId,
                    options: selectionOptionListSvc.buildDefaultOptions(question.surveyId, isTopic),
                    optionGroups: []
                },
                optionsMask: {
                    $type: "OptionsMask",
                    customOptionsMask: null,
                    isCustomOptionsMask: false,//TODO remove this property, use OptionsMaskType instead
                    isUseOptionMask: false,
                    optionsMaskType: null,
                    questionId: null
                },
                pageDefinitionId: null,//TODO remove it
                surveyId: question.surveyId,
                title: languageStringUtilSvc.buildLanguageString(question.surveyId),
                guid: guidUtilSvc.createGuid()
            };
        }
    }
})();