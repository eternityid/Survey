(function () {
    'use strict';

    angular
        .module('svt')
        .factory('surveyDataSvc', surveyDataSvc);

    surveyDataSvc.$inject = ['$resource', 'host'];

    function surveyDataSvc($resource, host) {
        var dataService = {
            deleteSurvey: deleteSurvey,
            restoreSurvey: restoreSurvey,
            search: search,
            getFile: getFile,
            getSurveyList: getSurveyList,
            getSurveyInfo: getSurveyInfo,
            getSurveyBrief: getSurveyBrief,
            importSurvey: importSurvey,
            exportSurvey: exportSurvey,
            duplicateSurvey: duplicateSurvey,
            updateSurveySettings: updateSurveySettings,
            publishSurvey: publishSurvey,
            updateSurveyStatus: updateSurveyStatus,
            addSurvey: addSurvey
        };

        return dataService;

        function search(searchForm) {
            var searchModel = angular.copy(searchForm.searchModel);
            searchModel.start = searchForm.paging.start;
            searchModel.limit = searchForm.paging.limit;
            return $resource(host + '/surveys/search', { searchModel: '@searchModel' }, { 'search': { method: 'POST' } })
                .search({}, JSON.stringify(searchModel));
        }

        function deleteSurvey(surveyId) {
            return $resource(host + '/surveys/:surveyId/delete', { surveyId: '@surveyId' }, { 'deleteSurvey': { method: 'PUT' } }).deleteSurvey({ surveyId: surveyId });
        }

        function restoreSurvey(surveyId) {
            return $resource(host + '/surveys/:surveyId/restore', { surveyId: '@surveyId' }, { 'restoreSurvey': { method: 'PUT' } }).restoreSurvey({ surveyId: surveyId });
        }

        function getSurveyList() {
            return $resource(host + '/surveys', { surveyId: '@surveyId' }, { 'getSurveyList': { method: 'GET', isArray: true } }).getSurveyList({});
        }

        function getFile(surveyId, fileName) {
            return $resource(host + '/surveys/:surveyId/file', { surveyId: '@surveyId' }, { 'getFile': { method: 'GET' } }).getFile({
                surveyId: surveyId,
                fileName: fileName
            });
        }

        function getSurveyInfo(surveyId) {
            return $resource(host + '/surveys/:surveyId/surveyinfo', { surveyId: '@surveyId' }, { 'GetSurveyInfo': { method: 'GET' } })
                       .GetSurveyInfo({ surveyId: surveyId });
        }

        function getSurveyBrief(surveyId) {
            return $resource(host + '/surveys/:surveyId/brief', { surveyId: '@surveyId' }, { 'GetSurveyInfo': { method: 'GET' } })
                       .GetSurveyInfo({ surveyId: surveyId });
        }

        function importSurvey(surveyViewModel) {
            var uploadForm = new FormData();
            uploadForm.append('surveyDefinitionFileName', surveyViewModel.file.uploadedFileName);
            uploadForm.append('surveyName', surveyViewModel.title);
            return $resource(host + '/surveys/import', {}, { 'upload': { method: 'POST', transformRequest: angular.identity, headers: { 'Content-Type': undefined } } })
                        .upload({}, uploadForm);
        }

        function exportSurvey(surveyId) {
            return $resource(host + '/surveys/:surveyId/export', { surveyId: '@surveyId' }, { 'export': { method: 'POST', transformResponse: transformResponse } })
                        .export({ surveyId: surveyId });

            function transformResponse(data, headerGetters) {
                return {
                    data: data,
                    header: headerGetters()
                };
            }
        }

        function duplicateSurvey(sourceSurveyId, newSurveyTitle, libraryId) {
            var payload = {
                sourceSurveyId: sourceSurveyId,
                newSurveyTitle: newSurveyTitle
            };
            if (libraryId) {
                payload.libraryId = libraryId;
            }
            return $resource(host + '/surveys/duplicate', {}, { 'duplicate': { method: 'POST' } })
                        .duplicate({}, JSON.stringify(payload));
        }


        function updateSurveySettings(surveyId, surveySettings) {
            return $resource(host + '/surveys/:surveyId/settings', { surveyId: '@surveyId' },
                { 'updateSettings': { method: 'PUT', headers: { 'If-Match': surveySettings.version } } })
                .updateSettings({ surveyId: surveyId }, JSON.stringify(surveySettings));
        }

        function publishSurvey(surveyId) {
            return $resource(host + '/surveys/:surveyId/publish', { surveyId: '@surveyId' }, { 'PublishSurvey': { method: 'POST' } })
                    .PublishSurvey({ surveyId: surveyId });
        }

        function updateSurveyStatus(surveyId, status) {
            var data = {
                status: status
            };
            return $resource(host + '/surveys/:surveyId/status', { surveyId: '@surveyId' }, { 'UpdateSurveyStatus': { method: 'PUT' } })
                    .UpdateSurveyStatus({ surveyId: surveyId }, JSON.stringify(data));
        }

        function addSurvey(surveyName) {
            return $resource(host + '/surveys', {},
                { 'addSurvey': { method: 'POST' } })
                .addSurvey({}, JSON.stringify({ surveyName: surveyName }));
        }
    }
})();