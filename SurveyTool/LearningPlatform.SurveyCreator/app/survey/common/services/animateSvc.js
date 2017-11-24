(function() {
    angular.module('svt').service('animateSvc', animateSvc);
    animateSvc.$inject = [];


    function animateSvc() {

        var service = {
            scrollToElement: scrollToElement
        };

        return service;

        function scrollToElement(selector, additionalOffsetTop) {
            if (!selector) return;
            if (!additionalOffsetTop) additionalOffsetTop = -100;
            var selectorElements = angular.element(selector);
            if (selectorElements.length > 0) {
                var elementTop = angular.element(selectorElements[0]).offset().top;
                var scrollToTopValue = elementTop + additionalOffsetTop > 0 ? elementTop + additionalOffsetTop : elementTop;
                angular.element('body').animate({ scrollTop: scrollToTopValue });
            }
        }
    }
})();