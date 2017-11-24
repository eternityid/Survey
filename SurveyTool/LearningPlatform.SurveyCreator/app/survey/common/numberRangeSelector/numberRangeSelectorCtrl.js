(function () {
    angular.module('svt').controller('numberRangeSelectorCtrl', numberRangeSelectorCtrl);

    numberRangeSelectorCtrl.$inject = ['$scope'];

    function numberRangeSelectorCtrl($scope) {
        var vm = this;
        $scope.nSelectorModel.conditionOperator = $scope.nSelectorModel.conditionOperator || '';
        $scope.nSelectorModel.numberFrom = $scope.nSelectorModel.numberFrom || '';
        $scope.nSelectorModel.numberTo = $scope.nSelectorModel.numberTo || '';
        vm.numberSentOperatorTypes = [
                { code: '', name: 'All' },
                { code: 'LESSTHAN', name: 'Less Than' },
                { code: 'EQUAL', name: 'Equal' },
                { code: 'GREATERTHAN', name: 'Greater Than' },
                { code: 'BETWEEN', name: 'Between' }
        ];
        vm.selectConditionChange = selectConditionChange;

        function selectConditionChange() {
            if ($scope.nSelectorModel.conditionOperator === '')
                $scope.nSelectorModel.numberFrom = '';
            if ($scope.nSelectorModel.conditionOperator !== 'BETWEEN')
                $scope.nSelectorModel.numberTo = '';
        }
    }
})();