var GeneralQuestionMobile = (function () {
    var QUESTION_TYPES = GLOBAL_CONSTANTS.QUESTION_TYPES;
    var SELECTOR = GLOBAL_CONSTANTS.SELECTOR;
    var CSS = GLOBAL_CONSTANTS.CSS;

    return {
        deactiveQuestion: deactiveQuestion
    };

    function deactiveQuestion(questionId) {
        $('.ok-button').removeClass('show');
        var question = getQuestion();
        if (question) {
            GeneralQuestion.setDeactiveClassForQuestionSettings(question);
            question.questionElement.find('input:focus').blur();
        }
        return;

        //TODO: We should convert IndexModule.questions to a dictionary to get a specified question faster than using FOR loop for IndexModule.questions Array.
        function getQuestion() {
            for (var i = 0; i < IndexModule.questions.length; i++) {
                if (IndexModule.questions[i].id === questionId) return IndexModule.questions[i];
            }
            return null;
        }
    }

})();
