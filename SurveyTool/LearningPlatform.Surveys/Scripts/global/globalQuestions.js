var GlobalQuestions = (function () {
    return {
        getQuestionByAlias: getQuestionByAlias
    };

    function getQuestionByAlias(alias) {
        return window.questions.find(function (question) {
            return question.alias === alias;
        });
    }
})();
