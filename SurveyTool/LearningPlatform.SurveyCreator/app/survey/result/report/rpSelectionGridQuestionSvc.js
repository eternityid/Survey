(function() {
    'use strict';

    angular.module('svt').service('rpSelectionGridQuestionSvc', rpSelectionGridQuestionSvc);

    function rpSelectionGridQuestionSvc() {
        return {
            renderTable: renderTable
        };

        function renderTable(aggregatedQuestion) {
            return {
                rows: renderRows(),
                numberOfRespondents: {
                    title: "Total Respondents",
                    value: aggregatedQuestion.numberOfRespondents
                },
                numberOfResponses: {
                    title: "Total Responses",
                    value: aggregatedQuestion.numberOfResponses
                }
            };

            function renderRows() {
                var rows = [];
                var aggregatedOptionQuestions = aggregatedQuestion.topics;

                for (var i = 0; i < aggregatedOptionQuestions.length; i++){
                    rows.push({
                        questionText: aggregatedOptionQuestions[i].questionText,
                        numberOfRespondents: {
                            title: "Total Respondents",
                            value: aggregatedOptionQuestions[i].numberOfRespondents
                        },
                        numberOfResponses: {
                            title: "Total Responses",
                            value: aggregatedOptionQuestions[i].numberOfResponses
                        },
                        subRows: renderSubRows(aggregatedOptionQuestions[i].answers || [])
                    });
                }

                return rows;

                function renderSubRows(aggregatedOptions) {
                    var subRows = [];

                    for (var j = 0; j < aggregatedOptions.length; j++) {
                        subRows.push({
                            optionText: aggregatedOptions[j].optionText,
                            count: aggregatedOptions[j].count,
                            percentage: aggregatedOptions[j].percentage
                        });
                    }

                    return subRows;
                }
            }
        }
    }
})();