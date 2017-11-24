(function () {
    'use strict';

    angular
        .module('svt')
        .directive('svtSurveyDashboard', SvtSurveyDashboard);

    function SvtSurveyDashboard() {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/dashboard/survey-dashboard.html',
            controller: 'surveyDashboardCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();