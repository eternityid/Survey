(function () {
    'use strict';

    angular
        .module('svt')
        .directive('librarySurveyList', librarySurveyList);

    function librarySurveyList() {
        var directive = {
            restrict: 'E',
            scope: {
                searchTerm: '='
            },
            templateUrl: 'survey/surveyLibraryManagement/librarySurveyList/library-survey-list.html',
            controller: 'librarySurveyListCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();