var InformationQuestion = (function () {
    return {
        showOkButton: showOkButton
    };

    function showOkButton(question) {
        if (question.type === '.information') {
            GeneralQuestion.activateOKButton(question);
        }
    }
})();