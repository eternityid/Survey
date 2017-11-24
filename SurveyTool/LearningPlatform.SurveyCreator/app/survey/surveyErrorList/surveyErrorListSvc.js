(function () {
    angular.module('svt').service('surveyErrorListSvc', SurveyErrorListSvc);
    SurveyErrorListSvc.$inject = ['surveyErrorConst'];

    function SurveyErrorListSvc(surveyErrorConst) {
        var ERROR_TYPES = surveyErrorConst.errorTypes;

        var service = {
            getDisplayErrorMessage: getDisplayErrorMessage
        };
        return service;

        function getDisplayErrorMessage(error) {
            var message = null;
            switch (error.type) {
                case ERROR_TYPES.carryOver:
                    var subMessage = error.hasOwnProperty('isInSubQuestion') && error.isInSubQuestion ? ' (in sub question)' : '';
                    message = 'Page ' + error.pageTitle + ' - question ' + error.questionAlias +
                        ' - carry over at option position ' + error.optionPosition +
                        subMessage +
                        ' refers to ' + error.message;
                    break;
                case ERROR_TYPES.displayLogic:
                    message = 'Page ' + error.pageTitle + ' - question ' + error.questionAlias +
                        ' - display logic condition at position ' + error.expressionItem.position + ' refers to ' + error.message;
                    break;
                case ERROR_TYPES.optionsMask:
                    message = 'Page ' + error.pageTitle + ' - question ' + error.questionAlias + ' - option mask refers to ' + error.message;
                    break;
                case ERROR_TYPES.skipAction:
                    message = error.hasOwnProperty('expressionItem') ?
                        'Page ' + error.pageTitle + ' - skip action ' + error.skipIndex + ' - condition at position ' + error.expressionItem.position + ' refers to ' + error.message : 
                        'Page ' + error.pageTitle + ' - skip action ' + error.skipIndex + ' skips to ' + error.message;
                    break;
                default:
                    break;
            }
            return message;
        }
    }
})();