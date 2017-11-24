(function () {
    'use strict';
    angular
        .module('svt')
        .directive('svtMatchWith', SvtMatchWith);

    function SvtMatchWith() {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var compareWithElement = '#' + attrs.svtMatchWith;
                elem.add(compareWithElement)
                    .on('keyup', function () {
                        scope.$apply(function () {
                            ctrl.$setValidity('svtmatchwith', elem.val() === $(compareWithElement).val());
                        });
                    });
            }
        };
    }
})();