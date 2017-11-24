(function () {
    'use strict';

    angular
        .module('svt')
        .factory('lookAndFeelDataSvc', lookAndFeelDataSvc);

    lookAndFeelDataSvc.$inject = ['$resource', 'host', 'baseHost'];

    function lookAndFeelDataSvc($resource, host, baseHost) {
        var dataService = {
            saveLookAndFeel: saveLookAndFeel,
            previewLookAndFeel: previewLookAndFeel,
            previewLookAndFeelByPage: previewLookAndFeelByPage
        };

        return dataService;

        function saveLookAndFeel(surveyId, params) {
            //var etag = '\"' + params.rowVersion.$value + '\"';
            return $resource(host + '/surveys/:surveyId/lookandfeel', { surveyId: '@surveyId' },
                { 'saveLookAndFeel': { method: 'PUT' } })
                .saveLookAndFeel({ surveyId: surveyId }, JSON.stringify(params));
        }

        function previewLookAndFeel(lookAndFeelBindingModel) {
            return $resource(baseHost + '/survey/:surveyId/preview-look-and-feel/language/en', { surveyId: '@surveyId' }, { 'preview': { method: 'POST', transformResponse: transformResponse } })
                .preview({ surveyId: lookAndFeelBindingModel.surveyId }, JSON.stringify(lookAndFeelBindingModel));

            function transformResponse(data) {
                return data === 'null' ? { data: null } : { data: data };
            }
        }

        function previewLookAndFeelByPage(lookAndFeelBindingModel) {
            return $resource(baseHost + '/survey/:surveyId/preview-look-and-feel-by-page/language/en', { surveyId: '@surveyId' }, { 'preview': { method: 'POST', transformResponse: transformResponse } })
                .preview({ surveyId: lookAndFeelBindingModel.surveyId }, JSON.stringify(lookAndFeelBindingModel));

            function transformResponse(data) {
                return data === 'null' ? { data: null } : { data: data };
            }
        }
    }
})();