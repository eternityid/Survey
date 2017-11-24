(function () {
    'use trict';

    angular.module('svt').controller('rsNumericQuestionCtrl', rsNumericQuestionCtrl);

    rsNumericQuestionCtrl.$inject = ['$scope', 'rsNumericQuestionSvc', 'numberUtilSvc'];

    function rsNumericQuestionCtrl($scope, rsNumericQuestionSvc, numberUtilSvc) {
        var vm = this;
        vm.chart = {};
        vm.avgSelections = null;
        vm.minSelections = null;
        vm.maxSelections = null;
        vm.sumSelections = null;
        vm.init = init;

        init();

        function init() {
            vm.avgSelections = numberUtilSvc.getNumberValueOrNA($scope.aggregatedQuestion.avg);
            vm.minSelections = numberUtilSvc.getNumberValueOrNA($scope.aggregatedQuestion.min);
            vm.maxSelections = numberUtilSvc.getNumberValueOrNA($scope.aggregatedQuestion.max);
            vm.sumSelections = numberUtilSvc.getNumberValueOrNA($scope.aggregatedQuestion.sum);
            vm.chart = rsNumericQuestionSvc.renderChart($scope.aggregatedQuestion);
        }
    }
})();