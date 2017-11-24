(function () {
    'use strict';

    angular
        .module('svt')
        .directive('surveyErrorList', surveyErrorList);

    function surveyErrorList() {
        var directive = {
            restrict: 'E',
            scope: {
            },
            templateUrl: 'survey/surveyErrorList/survey-error-list.html',
            controller: 'surveyErrorListCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();