(function () {
    angular
        .module('svt')
        .controller('svtDatetimeCtrl', svtDatetimeCtrl);

    svtDatetimeCtrl.$inject = ['$scope', 'guidUtilSvc', 'domUtilSvc'];

    function svtDatetimeCtrl($scope, guidUtilSvc, domUtilSvc) {
        var vm = this;

        var datePickerConfig = { autoclose: true, todayHighlight: true };

        vm.comparisionOperatorType = {
            all: { value: '', name: 'All' },
            lessThan: { value: 'LessThan', name: 'Before' },
            equal: { value: 'Equal', name: 'Equal' },
            greaterThan: { value: 'GreaterThan', name: 'After' },
            between: { value: 'Between', name: 'Between' }
        };

        vm.comparisionOperators = [
            vm.comparisionOperatorType.all,
            vm.comparisionOperatorType.lessThan,
            vm.comparisionOperatorType.equal,
            vm.comparisionOperatorType.greaterThan,
            vm.comparisionOperatorType.between
        ];

        vm.comparisionOperatorElmentId = guidUtilSvc.createGuid();
        vm.datetimeFromElementId = guidUtilSvc.createGuid();
        vm.datetimeToElementId = guidUtilSvc.createGuid();

        vm.onSelectComparisionOperator = onSelectComparisionOperator;

        init();

        function init() {
            setTimeout(function () {
                var datetimeFromElement = angular.element(document.querySelector('#' + vm.datetimeFromElementId));
                var datetimeToElement = angular.element(document.querySelector('#' + vm.datetimeToElementId));

                datetimeFromElement.datepicker(datePickerConfig);
                datetimeToElement.datepicker(datePickerConfig);

                domUtilSvc.filterKeyWhenTypingDate(datetimeFromElement);
                domUtilSvc.filterKeyWhenTypingDate(datetimeToElement);
            }, 1000);
        }

        function onSelectComparisionOperator() {
            if ($scope.data.conditionOperator === vm.comparisionOperatorType.all.value) {
                $scope.data.datetimeFrom = '';
                $scope.data.datetimeTo = '';
            }
            if ($scope.data.conditionOperator !== vm.comparisionOperatorType.between.value) {
                $scope.data.datetimeTo = '';
            }
        }
    }
})();