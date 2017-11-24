(function () {
    'use strict';

    angular
        .module('svt')
        .directive('lookAndFeel', lookAndFeel);

    function lookAndFeel() {
        var directive = {
            restrict: 'E',
            scope: {
                handleAfterSave: '&'
            },
            templateUrl: 'survey/surveyEditor/lookAndFeel/look-and-feel.html',
            controller: 'lookAndFeelCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();
