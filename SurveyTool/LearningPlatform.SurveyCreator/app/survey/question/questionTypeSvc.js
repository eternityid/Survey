(function () {
    angular.module('svt').factory('questionTypeSvc', questionTypeSvc);
    questionTypeSvc.$inject = ['settingConst', 'questionConst', 'arrayUtilSvc'];

    function questionTypeSvc(settingConst, questionConst, arrayUtilSvc) {
        var questionTypes = settingConst.questionTypes;
        var QUESTION_TYPES = questionConst.questionTypes; //Should use this way instead of settingConst.questionTypes if possible
        var service = {
            getNameQuestionType: getNameQuestionType,
            isQuestionTypeHasOptions: isQuestionTypeHasOptions,
            isQuestionTypeNPSLikertRating: isQuestionTypeNPSLikertRating,
            canCarryOverFrom: canCarryOverFrom,
            canUseOptionsMaskFrom: canUseOptionsMaskFrom,
            canUseExpressionItemFrom: canUseExpressionItemFrom
        };
        return service;

        function getNameQuestionType(type) {
            for (var index in questionTypes) {
                if (questionTypes[index].value === type) {
                    return questionTypes[index].name;
                }
            }
            return null;
        }

        function isQuestionTypeHasOptions(questionType) {
            //TODO it is not so clear with grid question and expression item
            return arrayUtilSvc.hasValueIn([questionTypes.SingleSelectionQuestionDefinition.value,
                    questionTypes.MultipleSelectionQuestionDefinition.value,
                    questionTypes.NetPromoterScoreQuestionDefinition.value,
                    questionTypes.ScaleQuestionDefinition.value,
                    questionTypes.GridQuestionDefinition.value,
                    questionTypes.SingleSelectionGridQuestionDefinition.value,
                    questionTypes.MultipleSelectionGridQuestionDefinition.value,
                    questionTypes.RatingQuestionDefinition.value,
                    questionTypes.SingleSelectionPictureQuestionDefinition.value,
                    questionTypes.MultipleSelectionPictureQuestionDefinition.value,
                    questionTypes.ShortTextListQuestionDefinition.value], questionType);
        }

        function isQuestionTypeNPSLikertRating(type) {
            return [
                QUESTION_TYPES.netPromoterScore,
                QUESTION_TYPES.scale,
                QUESTION_TYPES.rating
            ].indexOf(type) >= 0;
        }

        function canCarryOverFrom(type) {
            return [QUESTION_TYPES.singleSelection,
                QUESTION_TYPES.multipleSelection].indexOf(type) >= 0;
        }

        function canUseOptionsMaskFrom(type) {
            return [QUESTION_TYPES.singleSelection,
                QUESTION_TYPES.multipleSelection].indexOf(type) >= 0;
        }

        function canUseExpressionItemFrom(type) {
            return [QUESTION_TYPES.numeric,
                QUESTION_TYPES.shortText,
                QUESTION_TYPES.longText,
                QUESTION_TYPES.singleSelection,
                QUESTION_TYPES.multipleSelection,
                QUESTION_TYPES.rating,
                QUESTION_TYPES.scale,
                QUESTION_TYPES.netPromoterScore,
                QUESTION_TYPES.pictureSingleSelection,
                QUESTION_TYPES.pictureMultipleSelection].indexOf(type) >= 0;

        }
    }
})();