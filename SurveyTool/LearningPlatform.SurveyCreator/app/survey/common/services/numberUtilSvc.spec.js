(function() {
    describe('Testing numberUtilSvc service', function() {
        beforeEach(function() {
            module('svt');
        });

        describe('Testing isInteger function', function () {
            var value;

            it('should return true with integer string', inject(function (numberUtilSvc) {
                value = '123';

                var result = numberUtilSvc.isInteger(value);

                expect(result).toEqual(true);
            }));
        });
    });
})();