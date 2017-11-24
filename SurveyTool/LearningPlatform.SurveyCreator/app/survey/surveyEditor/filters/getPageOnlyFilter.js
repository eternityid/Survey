(function() {
    'use strict';
    angular.module('svt').filter('getPageOnlyFilter', GetPageOnlyFilter);
    GetPageOnlyFilter.$inject = ['surveyEditorSvc'];

    function GetPageOnlyFilter(surveyEditorSvc) {
        return function(data) {
            if (angular.isArray(data)) {
                return data.filter(surveyEditorSvc.pageFilterFn);
            }
            return data;
        };
    }
})();