(function() {
    angular.module('svt').service('createReportSvc', createReportSvc);
    createReportSvc.$inject = ['stringUtilSvc'];

    function createReportSvc(stringUtilSvc) {
        var service = {
            getPlaceHolders: getPlaceHolders,
            validate: validate
        };
        return service;

        function getPlaceHolders() {
            return {
                reportName: {
                    value: 'Report name',
                    valid: true
                },
                surveyId: {
                    valid: true
                }
            };
        }

        function validate(editor, placeHolder) {
            placeHolder.reportName.valid = true;
            placeHolder.surveyId.valid = true;
            if (stringUtilSvc.isEmpty(editor.report.name)) {
                placeHolder.reportName.value = 'Report name is required';
                placeHolder.reportName.valid = false;
            }

            if (stringUtilSvc.isEmpty(editor.report.surveyId) && stringUtilSvc.isEmpty(editor.report.id)) {
                placeHolder.surveyId.valid = false;
            }
            return placeHolder.reportName.valid && placeHolder.surveyId.valid;
        }
    }
})();