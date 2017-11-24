(function () {
    'use strict';

    angular
        .module('svt')
        .directive('questionDisplaySettings', questionDisplaySettings);

    function questionDisplaySettings() {
        var directive = {
            restrict: 'E',
            scope: {
                questionsWithOptions: '=',
                question: '=',
                pageId: '@'
            },
            templateUrl: 'survey/question/displaySetting/question-display-setting.html',
            controller: 'questionDisplaySettingCtrl',
            controllerAs: 'vm'
        };
        return directive;
    }
})();