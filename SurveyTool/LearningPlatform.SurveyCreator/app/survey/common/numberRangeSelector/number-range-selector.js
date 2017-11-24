(function () {
    'use strict';

    angular
        .module('svt')
        .directive('numberRangeSelector', numberRangeSelector);

    function numberRangeSelector() {
        return {
            restrict: "E",
            scope: {
                elementId: '@',
                selectConditionLabel: '@',
                nSelectorModel: '=',
                nTextboxKeyPress: '&'
            },
            templateUrl: 'survey/common/numberRangeSelector/number-range-selector.html',
            controller: 'numberRangeSelectorCtrl',
            controllerAs: 'vm'
        };
    }
})();