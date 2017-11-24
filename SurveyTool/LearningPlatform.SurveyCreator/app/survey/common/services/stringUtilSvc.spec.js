(function() {
    'use strict';
    describe('Testing stringUtilSvc service', function() {
        beforeEach(function() {
            module('svt');
        });

        describe('Testing truncateByWordAmount function', function () {
            var sourceValue, numberOfWords, appendValue;

            it('should return null with null value', inject(function(stringUtilSvc) {
                sourceValue = null;

                var result = stringUtilSvc.truncateByWordAmount(sourceValue, numberOfWords, appendValue);

                expect(result).toBeNull();
            }));

            it('should return truncated string with valid data', inject(function(stringUtilSvc) {
                sourceValue = 'dummy dummy  dummy';
                numberOfWords = 2;
                appendValue = '...';

                var result = stringUtilSvc.truncateByWordAmount(sourceValue, numberOfWords, appendValue);

                expect(result).toEqual('dummy dummy...');
            }));

            it('should return source string with unchanged and valid data', inject(function (stringUtilSvc) {
                sourceValue = 'dummy dummy';
                numberOfWords = 2;
                appendValue = '...';

                var result = stringUtilSvc.truncateByWordAmount(sourceValue, numberOfWords, appendValue);

                expect(result).toEqual('dummy dummy');
            }));
        });

        describe('Testing truncateByCharAmount function', function () {
            var sourceValue, numberOfChars, appendValue;

            it('should return empty string with null data', inject(function (stringUtilSvc) {
                sourceValue = null;

                var result = stringUtilSvc.truncateByCharAmount(sourceValue, numberOfChars, appendValue);

                expect(result).toEqual('');
            }));

            it('should truncate string by character amount', inject(function(stringUtilSvc) {
                sourceValue = 'dummy dummy dummy';
                numberOfChars = 5;
                appendValue = '...';

                var result = stringUtilSvc.truncateByCharAmount(sourceValue, numberOfChars, appendValue);

                expect(result.length).toEqual(8);
            }));

            it('should return empty string', inject(function(stringUtilSvc) {
                sourceValue = 'dummy';
                numberOfChars = 0;
                appendValue = '...';

                var result = stringUtilSvc.truncateByCharAmount(sourceValue, numberOfChars, appendValue);

                expect(result).toEqual('...');
            }));
        });

        describe('Testing isEmpty function', function() {
            it('should return false with not empty string', inject(function(stringUtilSvc) {
                var value = 'dummy';

                var result = stringUtilSvc.isEmpty(value);

                expect(result).toBeFalsy();
            }));
        });
    });
})();