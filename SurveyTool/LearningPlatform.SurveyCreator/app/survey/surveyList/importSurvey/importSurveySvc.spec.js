(function () {
    'use strict';
    describe('Testing importSurveySvc service', function () {
        beforeEach(function () {
            module('svt');
        });

        describe('Testing getPlaceHolders function', function () {
            it('should return default placeHolders', inject(function (importSurveySvc) {
                var result = importSurveySvc.getPlaceHolders();

                expect(result).not.toEqual(null);
            }));
        });

        describe('Testing validate function', function () {
            var placeHolders = {
                surveyTitle: {}
            };

            it('should return the error message when input invalid survey title', inject(function (importSurveySvc) {
                var surveyViewModel = {
                    title: null
                };
                var result = importSurveySvc.validate(surveyViewModel, placeHolders);

                expect(result).toEqual(false);
            }));

            it('should return the error message when dont input file', inject(function (importSurveySvc) {
                var surveyViewModel = {
                    title: 'dummy',
                    file: null
                };
                var result = importSurveySvc.validate(surveyViewModel, placeHolders);

                expect(result).toEqual(false);
            }));

            it('should return the success message when input valid data', inject(function (importSurveySvc) {
                var surveyViewModel = {
                    title: 'dummy',
                    file: {
                        uploadedFileName: 'dummy'
                    }
                };
                var result = importSurveySvc.validate(surveyViewModel, placeHolders);

                expect(result).toEqual(true);
            }));
        });

    });
})();