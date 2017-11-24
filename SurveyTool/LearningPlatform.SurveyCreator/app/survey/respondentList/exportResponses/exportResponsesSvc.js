(function() {
    angular.module('svt').factory('exportResponsesSvc', ExportResponsesSvc);
    ExportResponsesSvc.$inject = ['stringUtilSvc'];

    function ExportResponsesSvc(stringUtilSvc) {
        var service = {
            getTitleModes: getTitleModes,
            getIncludedResponsesModes: getIncludedResponsesModes,
            getSeparatorModes: getSeparatorModes,
            buildExportSettingData: buildExportSettingData,
            buildFile: buildFile
        };
        return service;

        function getTitleModes() {
            return [
                {
                    value: 0,
                    text: 'Use question and option title'
                }, {
                    value: 1,
                    text: 'Use question and option alias'
                }
            ];
        }

        function getIncludedResponsesModes() {
            return [
                {
                    value: 0,
                    text: 'All responses'
                }, {
                    value: 1,
                    text: 'Only completed responses'
                }, {
                    value: 2,
                    text: 'Completed and incomplete responses'
                }
            ];
        }

        function getSeparatorModes() {
            return [
                {
                    value: 0,
                    text: 'Comma separator'
                }, {
                    value: 1,
                    text: 'Tab separator'
                }
            ];
        }

        function buildExportSettingData(modelData) {
            return {
                surveyId: modelData.surveyId,
                exportResponsesReadingMode: modelData.titleMode,
                exportResponsesInclude: modelData.includedResponsesMode,
                exportResponsesSeparator: modelData.separatorMode,
                multipleSelectionAnswersAsSeparateColumns: modelData.multipleSelectionAnswersAsSeparateColumns
            };
        }

        function buildFile(data, exportResponsesSeparator, surveyName) {
            var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
            var fileName = buildFileName();

            //note saveAs() belong to FileSaver.js
            saveAs(blob, fileName);

            function buildFileName() {
                var fileName = stringUtilSvc.removeInvalidFileNameCharacters(surveyName);
                fileName = fileName ? fileName + '_responses' : 'responses';
                var tabSeperator = 1;

                return exportResponsesSeparator === tabSeperator ?
                    fileName + '.txt' : fileName + '.csv';
            }
        }

    }
})();