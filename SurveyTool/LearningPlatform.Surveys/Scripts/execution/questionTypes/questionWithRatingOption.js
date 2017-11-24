var QuestionWithRatingOption = (function () {
    return {
        addInactiveRatingsClassToQuestion: addInactiveRatingsClassToQuestion,
        deleteInactiveRatingsClassToQuestion: deleteInactiveRatingsClassToQuestion
    };

    function addInactiveRatingsClassToQuestion (questionElement) {
        var inputElement = $('div.inputArea', questionElement);
        if (inputElement) {
            inputElement.addClass('inactive-ratings');
        }
    }

    function deleteInactiveRatingsClassToQuestion (questionElement) {
        var inputElement = $('div.inputArea', questionElement);
        if (inputElement) {
            inputElement.removeClass('inactive-ratings');
        }
    }

})();