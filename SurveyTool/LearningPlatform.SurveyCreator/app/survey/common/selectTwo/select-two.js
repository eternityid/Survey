(function () {
    'use strict';

    angular
        .module('svt')
        .directive('selectTwo', selectTwo);

    function selectTwo() {
        var directive = {
            restrict: 'E',
            scope: {
                items: '=?',
                selectedValue: '=',
                onSelectedItem: '=',
                columnValue: '@',
                columnName: '@',
                placeHolder: '@',
                formatText: '@'
            },
            templateUrl: 'survey/common/selectTwo/select-two.html',
            controller: 'selectTwoCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();