(function () {
    'use strict';

    angular
        .module('svt')
        .directive('lookAndFeelSettings', lookAndFeelSettings);

    function lookAndFeelSettings() {
        var directive = {
            restrict: 'E',
            scope: {
                page: '='
            },
            templateUrl: 'survey/surveyEditor/lookAndFeel/look-and-feel-settings.html',
            controller: 'lookAndFeelSettingsCtrl',
            controllerAs: 'vm',
            link: function (scope, element) {
                scope.canShowBackgroundSlider = false;
                element.on('click', function (event) {
                    angular.element('#collapseBackground', element).on('shown.bs.collapse', function () {
                        scope.$apply(function () {
                            scope.canShowBackgroundSlider = true;
                        });
                    });
                });
            }
        };

        return directive;
    }
})();
