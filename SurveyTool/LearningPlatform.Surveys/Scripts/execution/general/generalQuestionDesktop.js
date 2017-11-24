var GeneralQuestionDesktop = (function () {
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CSS = GLOBAL_CONSTANTS.CSS;

    return {
        deactiveQuestion: deactiveQuestion,
        deactiveOptions: deactiveOptions
    };

    function deactiveQuestion(questionId) {
        $('.ok-button').removeClass('show');
        var question = getQuestion();
        if (!question) return;

        GeneralQuestion.setDeactiveClassForQuestionSettings(question);
        var isRatingOrRatingGridQuestion = question.questionType === QUESTION_TYPES.rating || question.questionType === QUESTION_TYPES.ratingGrid;
        if (isRatingOrRatingGridQuestion) {
            QuestionWithRatingOption.addInactiveRatingsClassToQuestion(question.questionElement);
        }
        deactiveOptions(question);
        question.questionElement.find('input:focus').blur();

        //TODO: We should convert IndexModule.questions to a dictionary to get a specified question faster than using FOR loop for IndexModule.questions Array.
        function getQuestion() {
            for (var i = 0; i < IndexModule.questions.length; i++) {
                if (IndexModule.questions[i].id === questionId) return IndexModule.questions[i];
            }
            return null;
        }
    }

    function deactiveOptions(question) {
        if (!question.options || question.options.length < 1) return;
        if (question.type === SELECTOR.question.type.pictureSingleSelection || question.type === SELECTOR.question.type.pictureMultipleSelection) {
            PictureQuestionDesktop.deactivePictureOptions(question, IndexModule.selectedQuestion);
            return;
        }
        if (question.type === SELECTOR.question.type.likerScale && question.settings.isRenderOptionByButton) {
            question.questionElement.find('.liker-heading .heading').removeClass(CSS.option.active);
        }
        QuestionWithOptionDesktop.deactiveOptions(question);
    }
})();
