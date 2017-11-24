(function () {
    angular
        .module('svt')
        .directive('fromLibrary', FromLibrary);

    function FromLibrary() {
        var directive = {
            restrict: 'E',
            scope: {
                selectedPageIds: '=',
                selectedQuestionIds: '=',
                libraryId: '=',
                isImportedPage: '='
            },
            templateUrl: 'survey/surveyLibrary/fromLibrary/from-library.html',
            controller: 'fromLibraryCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();