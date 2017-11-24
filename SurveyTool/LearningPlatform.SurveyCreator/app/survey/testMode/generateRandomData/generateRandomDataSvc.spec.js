(function () {
    'use strict';
    describe('Testing generateRandomDataSvc service', function () {
        beforeEach(function () {
            module('svt');
        });

        describe('Testing getNumberOfTestResponsesOptions function', function () {
            it('should return number of test responses options', inject(function (generateRandomDataSvc) {
                var result = generateRandomDataSvc.getNumberOfTestResponsesOptions();

                expect(result).toBeDefined();
            }));
        });

        describe('Testing validate function', function () {
            it('should show error message when validate fail', inject(function (generateRandomDataSvc) {
                spyOn(toastr, 'error');

                var numberOfTestResponses = null;
                generateRandomDataSvc.validate(numberOfTestResponses);

                expect(toastr.error).toHaveBeenCalled();
            }));
        });

    });
})();