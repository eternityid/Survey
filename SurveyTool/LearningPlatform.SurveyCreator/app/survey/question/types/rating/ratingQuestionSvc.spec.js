(function () {
    'use strict';
    describe('Testing ratingQuestionSvc service', function () {
        var ratingQuestionSvc;
        beforeEach(function () {
            module('svt');

            inject(function ($injector) {
                ratingQuestionSvc = $injector.get('ratingQuestionSvc');
            });
        });

        describe('Testing getSteps function', function () {
            var result;

            it('Should checked function getSteps', function () {
                var index = 1;

                result = ratingQuestionSvc.getSteps();

                expect(result.displayName).not.toEqual(null);
            });
        });

        describe('Testing buildOptions function', function () {
            var result,
                surveyId, numberOfSteps;

            it('Should checked properties', function () {

                result = ratingQuestionSvc.buildOptions(surveyId, numberOfSteps);

                expect(result.alias).not.toEqual(null);
            });
        });

        describe('Testing buildOptionsBasedOnExistedOptions function', function () {
            var result;

            it('Should checked logic function', function () {
                var surveyId,
                    numberOfSteps = 1,
                    existedOptions = [length = 1];

                result = ratingQuestionSvc.buildOptionsBasedOnExistedOptions(surveyId, numberOfSteps, existedOptions);

                expect(result.existedOptions).toEqual();
            });

            it('Should checked logic function', function () {
                var surveyId,
                    numberOfSteps = 5,
                    existedOptions = [length = 1];

                result = ratingQuestionSvc.buildOptionsBasedOnExistedOptions(surveyId, numberOfSteps, existedOptions);

                expect(result.existedOptions).toEqual();
            });
        });

    });
})();