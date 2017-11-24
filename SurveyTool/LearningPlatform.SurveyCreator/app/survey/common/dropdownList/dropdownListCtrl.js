(function () {
    angular.module('svt').controller('dropdownListCtrl', dropdownListCtrl);

    dropdownListCtrl.$inject = ['$scope', '$timeout', 'stringUtilSvc'];

    function dropdownListCtrl($scope, $timeout, stringUtilSvc) {
        var vm = this;

        vm.defaultText = $scope.defaultText || 'Select Item';
        vm.onItemChanged = onItemChanged;
        vm.getItemTitle = getItemTitle;

        init();

        function init() {
            if ($scope.selectedValue === null || $scope.selectedValue === undefined) return;
            resetSelectedItem($scope.selectedValue);

            $scope.$watch('selectedValue', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    resetSelectedItem(newValue);
                }
            });
        }

        function resetSelectedItem(value) {
            $scope.items.forEach(function (item) {
                if (item[$scope.columnValue] === value) {
                    $scope.selectedItem = item;
                    vm.selectedItemText = item[$scope.columnName] || $scope.defaultText;
                }
            });
        }

        function onItemChanged(item) {
            $scope.selectedItem = item;
            $scope.selectedValue = item[$scope.columnValue];
            vm.selectedItemText = item[$scope.columnName];

            $timeout(function () {
                $scope.onItemChanged(item);
            }, 0);
        }

        function getItemTitle(item) {
            var itemName = stringUtilSvc.getPlainText(item[$scope.columnName]);
            if (!$scope.aliasColumnName) return itemName;
            var aliasValue = stringUtilSvc.getPlainText(item[$scope.aliasColumnName]);

            return (itemName.replace(/ /g, '').toLowerCase() === aliasValue.replace(/ /g, '').toLowerCase()) ?
                itemName :
                itemName + ' (' + aliasValue + ')';
        }
    }
})();