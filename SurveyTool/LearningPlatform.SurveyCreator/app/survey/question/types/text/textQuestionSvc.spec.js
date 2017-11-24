(function () {
    'use strict';
    describe('Testing textQuestionSvc Service', function () {
        var svc,
           stringUtilSvc,
           numberUtilSvc,
           serverValidationSvc,
           questionConst;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty']);
                numberUtilSvc = jasmine.createSpyObj('numberUtilSvc', ['isInteger']);
                serverValidationSvc = jasmine.createSpyObj('serverValidationSvc', ['getServerValidationTypes']);
                questionConst = jasmine.createSpyObj('questionConst', ['questionTypes', 'shortText']);

                $provide.value('stringUtilSvc', stringUtilSvc);
                $provide.value('numberUtilSvc', numberUtilSvc);
                $provide.value('serverValidationSvc', serverValidationSvc);
                $provide.value('questionConst', questionConst);
            });
            inject(function ($injector) {
                svc = $injector.get('textQuestionSvc');
            });
        });

        describe('Testing validateCharacters function', function () {
            var result,
                minCharacters,
                maxCharacters;

            it('should check minCharacters', function () {
                stringUtilSvc.isEmpty.and.returnValue(true);

                result = svc.validateCharacters(minCharacters, maxCharacters);

                expect(result.valid).toEqual(true);
            });

            it('should validation Minimum characters should be lower than Maximum characters', function () {
                var minCharacters = 10,
                    maxCharacters = 5;

                stringUtilSvc.isEmpty.and.returnValue(false);

                result = svc.validateCharacters(minCharacters, maxCharacters);

                expect(result.valid).toEqual(false);
                expect(result.message.indexOf('Minimum characters ')).toBeGreaterThan(-1);
            });
        });

        describe('Testing validateWords function', function () {
            var minWords,
                maxWords,
                result;

            it('Should check minWords', function () {
                stringUtilSvc.isEmpty.and.returnValue(true);
                result = svc.validateWords(minWords, maxWords);
                expect(result.valid).toEqual(true);
            });

            it('Should not check minWords', function () {
                stringUtilSvc.isEmpty.and.returnValue(false);

                result = svc.validateWords(minWords, maxWords);

                expect(result.valid).toEqual(false);
            });
        });

        describe('Testing validateRows function', function () {
            var result,
                rows;

            it('Should check Rows amount is invalid', function () {
                stringUtilSvc.isEmpty.and.returnValue(true);
                numberUtilSvc.isInteger.and.returnValue(false);

                result = svc.validateRows(rows);

                expect(result.valid).toEqual(false);
            });
            it('Should not check Rows amount is invalid', function () {
                stringUtilSvc.isEmpty.and.returnValue(false);
                numberUtilSvc.isInteger.and.returnValue(true);

                result = svc.validateRows(rows);

                expect(result.valid).toEqual(true);
            });
        });

    });
})();