(function() {
    angular.module('svt').factory('exportSurveySvc', ExportSurveySvc);
    ExportSurveySvc.$inject = ['stringUtilSvc'];

    function ExportSurveySvc(stringUtilSvc) {
        var service = {
            buildFile: buildFile
        };
        return service;

        function buildFile(data, surveyName) {
            var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            var fileName = stringUtilSvc.removeInvalidFileNameCharacters(surveyName);
            fileName = fileName ? fileName + '.json' : 'survey.json';

            //saveAs() belong to FileSaver.js
            saveAs(blob, fileName);
        }
    }
})();