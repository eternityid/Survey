(function () {
    'use strict';

    angular
        .module('svt')
        .directive('libraryPageList', libraryPageList);

    function libraryPageList() {
        var directive = {
            restrict: 'E',
            scope: {
                searchTerm: '='
            },
            templateUrl: 'survey/surveyLibraryManagement/libraryPageList/library-page-list.html',
            controller: 'libraryPageListCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();