(function () {
    'use strict';

    angular
        .module('svt')
        .directive('libraryQuestionList', libraryQuestionList);

    function libraryQuestionList() {
        var directive = {
            restrict: 'E',
            scope: {
                searchTerm: '='
            },
            templateUrl: 'survey/surveyLibraryManagement/libraryQuestionList/library-question-list.html',
            controller: 'libraryQuestionListCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();