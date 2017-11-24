(function() {
    angular.module('svt').service('surveyEditorMessageSvc', surveyEditorMessageSvc);
    surveyEditorMessageSvc.$inject = ['arrayUtilSvc'];

    function surveyEditorMessageSvc(arrayUtilSvc) {
        var service = {
            buildReferenceQuestionPageMessageContent: buildReferenceQuestionPageMessageContent
        };
        return service;

        function buildReferenceQuestionPageMessageContent(
            carryOverQuestionPositions, displayLogicQuestionPositions, optionMaskQuestionPosition, skipActionPageTitles) {
            var messageParts = [];

            if (arrayUtilSvc.isArrayHasElement(carryOverQuestionPositions)) {
                messageParts.push('&nbsp;&nbsp;&nbsp;- carry over on questions <i>' + carryOverQuestionPositions.join(', ') + '</i>');
            }
            if (arrayUtilSvc.isArrayHasElement(displayLogicQuestionPositions)) {
                messageParts.push('&nbsp;&nbsp;&nbsp;- display logic on questions <i>' + displayLogicQuestionPositions.join(', ') + '</i>');
            }
            if (arrayUtilSvc.isArrayHasElement(optionMaskQuestionPosition)) {
                messageParts.push('&nbsp;&nbsp;&nbsp;- option mask on questions <i>' + optionMaskQuestionPosition.join(', ') + '</i>');
            }
            if (arrayUtilSvc.isArrayHasElement(skipActionPageTitles)) {
                messageParts.push('&nbsp;&nbsp;&nbsp;- skip action on pages <i>' + skipActionPageTitles.join(', ') + '</i>');
            }

            if (messageParts.length === 0) return '';
            return messageParts.join('<br/>');
        }
    }
})();