(function () {
    angular.module('svt').service('surveyLibraryManagementSvc', surveyLibraryManagementSvc);
    surveyLibraryManagementSvc.$inject = ['stringUtilSvc'];

    function surveyLibraryManagementSvc(stringUtilSvc) {
        var service = {
            validateLibraryPage: validateLibraryPage,
            validateLibraryQuestion: validateLibraryQuestion
        };
        return service;

        function validateLibraryPage(title) {
            var result = { valid: true };
            if (stringUtilSvc.isEmptyFromHtml(title)) {
                result.valid = false;
                result.message = 'Page title is empty';
            }

            return result;
        }

        function validateLibraryQuestion(title) {
            var result = { valid: true };
            if (stringUtilSvc.isEmptyFromHtml(title)) {
                result.valid = false;
                result.message = 'Question title is empty';
            }

            return result;
        }
    }
})();