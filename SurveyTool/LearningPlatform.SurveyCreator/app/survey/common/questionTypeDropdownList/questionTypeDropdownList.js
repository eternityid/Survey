(function () {
    'use strict';

    angular.module('svt').directive('questionTypeDropdownList', questionTypeDropdownList);

    function questionTypeDropdownList() {
        var directive = {
            restrict: 'E',
            scope: {
                ngModal: '=?',
                onItemChanged: '&',
                isDisabled: '=?'
            },
            templateUrl: 'survey/common/questionTypeDropdownList/questionTypeDropdownList.html',
            controller: 'questionTypeDropdownListCtrl',
            controllerAs: 'vm'
        };
        return directive;
    }

})();