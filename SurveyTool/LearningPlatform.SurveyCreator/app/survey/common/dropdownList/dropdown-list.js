(function () {
    'use strict';

    angular.module('svt').directive('dropdownList', dropdownList);

    function dropdownList() {
        var directive = {
            restrict: 'E',
            scope: {
                selectedItem: '=?',
                selectedValue: '=?',
                items: '=',
                columnValue: '@',
                columnName: '@',
                aliasColumnName: '@?',
                onItemChanged: '&',
                dropdownListDisabled: '=?',
                onClick: '&',

                defaultText: '@',
                defaultClass: '@'
            },
            templateUrl: 'survey/common/dropdownList/dropdown-list.html',
            controller: 'dropdownListCtrl',
            controllerAs: 'vm'
        };
        return directive;
    }

})();