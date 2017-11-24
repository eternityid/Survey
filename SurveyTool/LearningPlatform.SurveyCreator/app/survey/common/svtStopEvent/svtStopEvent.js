(function () {
    angular.module('svt')
        .directive('svtStopEvent', SvtStopEvent);

    function SvtStopEvent() {
        return {
            restrict: 'A',
            link: function (scope, element, svt) {
                element.bind('click', function (event) {
                    event.stopPropagation();
                    angular.element(document).trigger('click');
                });
            }
        };
    }
})();