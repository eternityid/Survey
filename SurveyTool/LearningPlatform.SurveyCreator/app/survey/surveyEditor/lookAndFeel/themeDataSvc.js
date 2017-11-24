(function() {
    angular
        .module('svt')
        .factory('themeDataSvc', themeDataSvc);

    themeDataSvc.$inject = ['$resource', 'host'];

    function themeDataSvc($resource, host) {
        var dataService = {
            getSystemUserThemes: getSystemUserThemes,
            getTheme: getTheme,
            getAvailableThemesForSurvey: getAvailableThemesForSurvey
        };

        return dataService;

        function getSystemUserThemes() {
            return $resource(host + '/themes/types/system-user', {}, { 'getSystemUserThemes': { method: 'GET', isArray: true } }).getSystemUserThemes({});
        }

        function getTheme(themeId) {
            return $resource(host + '/themes/{themeId}', { themeId: '@themeId' }, { 'getTheme': { method: 'GET', isArray: false } }).getTheme({ themeId: themeId });
        }

        function getAvailableThemesForSurvey(surveyId) {
            return $resource(host + '/surveys/:surveyId/themes', { surveyId: '@surveyId' }, { 'getThemes': { method: 'GET', isArray: true } }).getThemes({ surveyId: surveyId });
        }
    }
})();