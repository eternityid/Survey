(function() {
    angular.module('svt').service('reportTableSvc', reportTableSvc);
    reportTableSvc.$inject = ['numberUtilSvc'];

    function reportTableSvc(numberUtilSvc) {
        var service = {
            renderOpenTextTable: renderOpenTextTable,
            renderNumberTextTable: renderNumberTextTable,
            renderSelectionOrLikertTable: renderSelectionOrLikertTable,
            renderGridTable: renderGridTable
        };
        return service;

        function renderOpenTextTable(aggregatedQuestion) {
            var table = {};
            table.answers = aggregatedQuestion.answers;
            table.totalRespondents = aggregatedQuestion.numberOfRespondents;
            table.totalResponses = aggregatedQuestion.numberOfResponses;
            return table;
        }

        function renderNumberTextTable(aggregatedQuestion) {
            var table = {};
            table.avgSelections = numberUtilSvc.getNumberValueOrNA(aggregatedQuestion.avg);
            table.minSelections = numberUtilSvc.getNumberValueOrNA(aggregatedQuestion.min);
            table.maxSelections = numberUtilSvc.getNumberValueOrNA(aggregatedQuestion.max);
            table.sumSelections = numberUtilSvc.getNumberValueOrNA(aggregatedQuestion.sum);
            return table;
        }

        function renderSelectionOrLikertTable(aggregatedQuestion) {
            var table = {};
            table.columns = ["Option", "Response", "Percentage"];
            table.rows = angular.isArray(aggregatedQuestion.answers) && aggregatedQuestion.answers.map(function (option) {
                return {
                    optionText: option.optionText,
                    count: option.count,
                    percentage: option.percentage
                };
            });
            table.totalRespondents = aggregatedQuestion.numberOfRespondents;
            table.totalResponses = aggregatedQuestion.numberOfResponses;
            return table;
        }

        function renderGridTable(aggregatedQuestion) {
            var table = {};
            table.rows = aggregatedQuestion.topics && aggregatedQuestion.topics.map(function (question) {
                return {
                    questionText: question.questionText,
                    numberOfRespondents: {
                        title: "Total Respondents",
                        value: question.numberOfRespondents
                    },
                    numberOfResponses: {
                        title: "Total Responses",
                        value: question.numberOfResponses
                    },
                    subRows: question.answers.map(function (option) {
                        return {
                            optionText: option.optionText,
                            count: option.count,
                            percentage: option.percentage
                        };
                    })
                };
            });

            table.numberOfRespondents = {
                title: "Total Respondents",
                value: aggregatedQuestion.numberOfRespondents
            };
            table.numberOfResponses = {
                title: "Total Responses",
                value: aggregatedQuestion.numberOfResponses
            };

            return table;
        }
    }
})();