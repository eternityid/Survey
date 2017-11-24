(function () {
    angular.module('svt').directive('rsChartApplicableQuestions', rsChartApplicableQuestions);

    function rsChartApplicableQuestions() {
        var directive = {
            restrict: 'E',
            scope: {
                aggregatedQuestion: '=',
                chartQuestionGroup: '=',
                surveyId: '@',
                reportPageId: '=',
                columnWidth: '=',
                chartTitleSize: '='
            },
            templateUrl: 'survey/result/chartApplicableQuestions/rs-chart-applicable-questions.html',
            controller: 'rsChartApplicableQuestionsCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();