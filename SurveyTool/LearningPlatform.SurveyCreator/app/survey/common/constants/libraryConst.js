(function () {
    angular.module('svt')
        .constant('libraryConst', {
            libraryItemTypes: {
                survey: 'survey',
                page: 'page',
                question: 'question'
            },
            libraryTypes: {
                system: 0,
                user: 1
            }
        });
})();