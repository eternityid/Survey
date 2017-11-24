var ProgressBarUtilMobile = (function () {
    return {
        setProgressBarValue: setProgressBarValue,
        updateProgressBarInitPageValue: updateProgressBarInitPageValue
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
        var currentProgressBarWidth = IndexModule.currentProgressBarWidth;

        if (window.progressBarInitValue) {
            currentProgressBarWidth = window.progressBarInitValue[GeneralPageMobile.getHiddenValue('$pageId', document)] || 0;
        }

        var result = 1.0 * currentProgressBarWidth + 1.0 * percentagePerQuestion * IndexModule.selectedQuestion.id;
        return parseInt(result);
    }

    function updateProgressBarInitPageValue() {
        var pageId = GeneralPageMobile.getHiddenValue('$pageId', document);

        if (window.progressBarInitValue[pageId] !== undefined) return;
        window.progressBarInitValue[pageId] = $('.progress-bar').length > 0 && Number($('.progress-bar')[0].style.width.replace('%', '')) || 0;
    }
})();