var ProgressBarUtilDesktop = (function () {
    return {
        setProgressBarValue: setProgressBarValue
    };

    function setProgressBarValue() {
        var progressBarPercentage = getPercentageByQuestionPosition();
        $('.progress-bar')
            .css('width', progressBarPercentage + '%')
            .html(progressBarPercentage + '%')
            .attr('title', progressBarPercentage + '%');
    }

    function getPercentageByQuestionPosition() {
        if (IndexModule.selectedQuestion.isLastQuestionInSurvey) return 100;
        var percentagePerQuestion = Number($('#questionPercent').val());
        var result = 1.0 * IndexModule.currentProgressBarWidth + 1.0 * percentagePerQuestion * IndexModule.selectedQuestion.id;
        return parseInt(result);
    }
})();