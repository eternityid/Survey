(function () {
    'use strict';
    describe('Testing htmlToPlainTextFilter filter', function () {
        beforeEach(function () {
            module('svt');
        });

        it("should return text without html tag", inject(function ($filter) {
            var value = '<p><a>hello world</a></p>';

            var result = $filter('htmlToPlainTextFilter')(value);

            expect(result).toEqual('hello world');
        }));
    });
})();