(function() {
    angular.module('svt').factory('testModeSvc', testModeSvc);

    testModeSvc.$inject = ['$window'];

    function testModeSvc($window) {
        var testModeString = 'testModeSettings';
        var testModeSettings = {
            isActive: false
        };

        var service = {
            toggleTestMode: toggleTestMode,
            getTestModeSettings: getTestModeSettings
        };
        return service;

        function toggleTestMode(surveyId) {
            testModeSettings.isActive = !testModeSettings.isActive;
            if (testModeSettings.isActive) {
                $window.sessionStorage.setItem(testModeString + '-' + surveyId, JSON.stringify(testModeSettings));
            } else {
                $window.sessionStorage.removeItem(testModeString + '-' + surveyId);
            }

        }

        function getTestModeSettings(surveyId) {
            var testModeSettingInSessionStorage = $window.sessionStorage.getItem(testModeString + '-' + surveyId);

            if (!testModeSettingInSessionStorage) {
                testModeSettings.isActive = false;
                testModeSettings.surveyId = surveyId;
            } else {
                var tempTokenSettings = JSON.parse(testModeSettingInSessionStorage);
                testModeSettings.isActive = tempTokenSettings.isActive;
                testModeSettings.surveyId = tempTokenSettings.surveyId;
            }

            return testModeSettings;
        }

    }
})();