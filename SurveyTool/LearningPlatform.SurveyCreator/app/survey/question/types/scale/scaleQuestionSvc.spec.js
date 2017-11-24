(function () {
    'use strict';
    describe('Testing scaleQuestionSvc service', function () {
        var svc,
          questionSvc,
          stringUtilSvc,
          numberUtilSvc,
          arrayUtilSvc,
          languageStringUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                questionSvc = jasmine.createSpyObj('questionSvc', ['getSelectedSurveyId']);
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty']);
                numberUtilSvc = jasmine.createSpyObj('numberUtilSvc', ['isInteger']);
                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['isArrayHasElement']);
                languageStringUtilSvc = jasmine.createSpyObj('languageStringUtilSvc', ['buildLanguageString']);

                $provide.value('questionSvc', questionSvc);
                $provide.value('stringUtilSvc', stringUtilSvc);
                $provide.value('numberUtilSvc', numberUtilSvc);
                $provide.value('arrayUtilSvc', arrayUtilSvc);
                $provide.value('languageStringUtilSvc', languageStringUtilSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('scaleQuestionSvc');
            });
        });

        describe('Testing Validation function', function () {
            var result;

            it('should checked properties Validation function when min is not a number', function () {
                var min, max;

                result = svc.validate(min, max);

                expect(result.valid).toEqual(false);
                expect(result.message.indexOf('Start is required.')).toBeGreaterThan(-1);
            });

            it('should checked properties Validation function when min is equal zero', function () {
                var min = 0, max = '';

                result = svc.validate(min, max);

                expect(result.valid).toEqual(false);
                expect(result.message.indexOf('Start is invalid.')).toBeGreaterThan(-1);
            });

            it('should checked properties Validation function when max is not a number', function () {
                var min = 1, max = null;

                stringUtilSvc.isEmpty.and.returnValue(true);
                result = svc.validate(min, max);

                expect(result.valid).toEqual(false);
            });

            it('should checked number min and max are not a number', function () {
                var min = 'asd',
                    max = 'asdf';

                stringUtilSvc.isEmpty.and.returnValue(true);
                result = svc.validate(min, max);

                expect(result.valid).toEqual(false);
                expect(result.message).not.toEqual(null);
            });

            it('should checked Start must be less than End.', function () {
                var min = 5,
                    max = 2;

                stringUtilSvc.isEmpty.and.returnValue(true);
                result = svc.validate(min, max);

                expect(result.valid).toEqual(false);
                expect(result.message).not.toEqual(null);
            });

            it('should checked number min/max valid and Maximum length no more than default max length', function () {
                var max = 31,
                    min = 10;

                stringUtilSvc.isEmpty.and.returnValue(true);
                result = svc.validate(min, max);

                expect(result.valid).toEqual(false);
                expect(result.message).not.toEqual(null);
            });
        });

        describe('Testing buildOptions function', function () {
            var result;

            it('Should checked properties buildOptions function when min is a number', function () {
                var min, max;

                result = svc.buildOptions(min, max);

                expect(result).toEqual([]);
            });
        });

        describe('Testing buildOptionsBasedOnExistedOptions function', function () {
            var result;

            it('Should checked properties buildOptionsBasedOnExistedOptions function when existedOptions is array', function () {
                var min, max, existedOptions = [];

                result = svc.buildOptionsBasedOnExistedOptions(min, max, existedOptions);

                expect(result).toEqual([]);
            });
        });
    });
})();