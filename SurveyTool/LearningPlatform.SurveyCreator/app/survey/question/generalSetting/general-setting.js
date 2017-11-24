(function () {
    'use strict';

    angular
        .module('svt')
        .directive('generalSetting', generalSetting);

    function generalSetting() {
        var directive = {
            restrict: 'E',
            scope: {
                htmlContainerId: '@',
                questionType: '@',
                pageId: '@',
                position: '@',
                mode:'@',
                question: '='
            },
            templateUrl: 'survey/question/generalSetting/general-setting.html',
            controller: 'generalSettingCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();