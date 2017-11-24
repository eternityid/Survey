(function() {

    angular.module('svt').controller('reportTableCtrl', reportTableCtrl);

    reportTableCtrl.$inject = ['$scope', 'settingConst', 'reportTableSvc'];

    function reportTableCtrl($scope, settingConst, reportTableSvc) {
            var vm = this;
            var questionType = Number($scope.questionType);
            var questionTypes = settingConst.questionTypes;
            var limitConst = 10;

            vm.table = null;
            vm.htmlToPlainText = '';
            vm.displayedAnswers = null;
            vm.questionTypes = questionTypes;
            vm.loadResponses = loadResponses;
            vm.init = init;

            init();

            function init() {
                switch (questionType) {
                    case questionTypes.OpenEndedShortTextQuestionDefinition.code:
                    case questionTypes.OpenEndedLongTextQuestionDefinition.code:
                        vm.table = reportTableSvc.renderOpenTextTable($scope.aggregatedQuestion);
                        loadResponses(limitConst);
                        break;
                    case questionTypes.NumericQuestionDefinition.code:
                        vm.table = reportTableSvc.renderNumberTextTable($scope.aggregatedQuestion);
                        break;
                    case questionTypes.SingleSelectionQuestionDefinition.code:
                    case questionTypes.MultipleSelectionQuestionDefinition.code:
                    case questionTypes.NetPromoterScoreQuestionDefinition.code:
                    case questionTypes.ScaleQuestionDefinition.code:
                    case questionTypes.RatingQuestionDefinition.code:
                        vm.table = reportTableSvc.renderSelectionOrLikertTable($scope.aggregatedQuestion);
                        break;
                    case questionTypes.SingleSelectionGridQuestionDefinition.code:
                    case questionTypes.MultipleSelectionGridQuestionDefinition.code:
                    case questionTypes.ScaleGridQuestionDefinition.code:
                    case questionTypes.RatingGridQuestionDefinition.code:
                        vm.table = reportTableSvc.renderGridTable($scope.aggregatedQuestion);
                        break;
                    default:
                }
            }

            function loadResponses(limit) {
                var allOpenAnswers = angular.copy(vm.table.answers);
                if (!allOpenAnswers || !angular.isArray(allOpenAnswers)) return;

                var startFrom = 0;
                vm.displayedAnswers = allOpenAnswers.slice(startFrom, limit);
            }
        }
})();