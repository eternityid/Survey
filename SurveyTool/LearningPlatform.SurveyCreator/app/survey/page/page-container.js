(function () {
    'use strict';

    angular
        .module('svt').directive('pageContainer', page);

    function page() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'survey/page/page-container.html',
            scope: {
                id: '=', //TODO unused property
                pageDescription: '=',
                pageObj: '=',
                index: '=',
                pageTitle: '=',
                isCollapsedAllPage: '&'
            },
            controller: 'pageCtrl',
            controllerAs: 'pageCtrl'
        };

        return directive;
    }
})();