(function () {
    'use strict';

    angular
        .module('svt')
        .directive('svtDatetime', svtDatetime);

    function svtDatetime() {
        var directive = {
            restrict: "E",
            scope: {
                label: '@',
                data: '=',
                onKeyPress: '&'
            },
            templateUrl: 'survey/common/svtDatetime/svt-datetime.html',
            controller: 'svtDatetimeCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();

