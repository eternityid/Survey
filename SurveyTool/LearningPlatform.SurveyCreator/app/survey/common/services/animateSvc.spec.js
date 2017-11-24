(function () {
    'use strict';
    describe('Testing animateSvc service', function () {
        var svc,
            animateSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                svc = $injector.get('animateSvc');
            });
        });

        describe('Testing scrollToElement function', function () {
            var result,
                selector,
                additionalOffsetTop;
            it('Should checked selector when it is null', function () {
                selector = null;

                result = svc.scrollToElement(selector, additionalOffsetTop);

                expect(result).not.toEqual(null);
            });
        });
    });
})();