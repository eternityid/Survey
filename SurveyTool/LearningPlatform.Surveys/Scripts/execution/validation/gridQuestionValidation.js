var GridQuestionValidation = (function () {
    return {
        isLastTopicAnswered: isLastTopicAnswered
    };
    function isLastTopicAnswered(question) {
        var isLastTopicAnswered;
        var answers = GeneralQuestion.getQuestionAnswer(question);
        switch (question.questionType) {
            case QUESTION_TYPES.shortTextList:
            case QUESTION_TYPES.longTextList:
                isLastTopicAnswered = !StringUtil.isEmpty(answers[answers.length - 1].value);
                break;
            case QUESTION_TYPES.ratingGrid:
                var lastAnswerValue = answers[answers.length - 1].value;
                isLastTopicAnswered = !StringUtil.isEmpty(lastAnswerValue) && lastAnswerValue !== '0';
                break;
            default:
                break;
        }
        return isLastTopicAnswered;
    }
})();