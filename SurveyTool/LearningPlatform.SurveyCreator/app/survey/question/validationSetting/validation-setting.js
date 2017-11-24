(function () {
    'use strict';

    angular
        .module('svt')
        .directive('validationSetting', validationSetting);

    function validationSetting() {
        var directive = {
            restrict: 'E',
            scope: {
                question: '='
            },
            templateUrl: 'survey/question/validationSetting/validation-setting.html',
            controller: 'validationSettingCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();