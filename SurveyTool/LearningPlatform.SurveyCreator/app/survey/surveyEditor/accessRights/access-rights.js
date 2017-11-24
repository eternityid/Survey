(function () {
    'use strict';

    angular
        .module('svt')
        .directive('accessRights', accessRights);

    function accessRights() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                surveyName: '@'
            },
            templateUrl: 'survey/surveyEditor/accessRights/access-rights.html',
            controller: 'accessRightsCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();