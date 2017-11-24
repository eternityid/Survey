(function () {
    'use strict';

    angular.module('svt').service('rsOpenTextQuestionSvc', rsOpenTextQuestionSvc);

    function rsOpenTextQuestionSvc() {
        return {
            buildTable: buildTable
        };

        function buildTable(destinationTable, sourceTable) {
            destinationTable.length = 0;
            for (var i = 0; i < sourceTable.length; i++) {
                if (sourceTable[i].trim()) {
                    destinationTable.push({ key: i, text: sourceTable[i] });
                }
            }
        }
    }
})();