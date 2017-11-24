(function () {
    angular
        .module('svt')
        .controller('selectTwoCtrl', selectTwoCtrl);

    selectTwoCtrl.$inject = [
        '$scope'
    ];

    function selectTwoCtrl($scope) {
        var vm = this;
        vm.searchText = '';
        vm.onSelectedItem = onSelectedItem;

        init();

        function init() {
            vm.isPlaceHolder = !$scope.selectedValue;
            vm.selectedItemText = vm.isPlaceHolder ? $scope.placeHolder : getSelectedText($scope.selectedValue);

            $scope.$on('$destroy', function () {
                console.log('select two has been destroyed');
            });

            $scope.$watch('selectedValue', function (newValue, oldValue) {
                if (!newValue) {
                    vm.selectedItemText = $scope.placeHolder;
                    vm.isPlaceHolder = true;
                } else {
                    vm.isPlaceHolder = false;
                }
            });
        }

        function onSelectedItem(item) {
            vm.selectedItemText = item[$scope.columnName];
            $scope.onSelectedItem.apply(this, [item]);
        }

        function getSelectedText(selectedValue) {
            for (var i = 0; i < $scope.items.length; i++) {
                var item = $scope.items[i];
                if (item[$scope.columnValue] == selectedValue) return item[$scope.columnName];
            }
            return null;
        }
    }
})();