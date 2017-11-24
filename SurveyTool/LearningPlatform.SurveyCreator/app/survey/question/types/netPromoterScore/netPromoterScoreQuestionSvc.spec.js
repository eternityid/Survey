(function () {
    'use strict';
    describe('Testing netPromoterScoreQuestionSvc service', function () {
        var svc, languageStringUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                languageStringUtilSvc = jasmine.createSpyObj('languageStringUtilSvc', ['buildLanguageString']);
                languageStringUtilSvc.buildLanguageString.and.returnValue('');

                $provide.value('languageStringUtilSvc', languageStringUtilSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('netPromoterScoreQuestionSvc');
            });
        });

        describe('Testing buildDefaultOptions function', function () {

            it('Should length of optionList greater than 0', function () {
                var optionList = svc.buildDefaultOptions(1);
                expect(optionList.length).toBeGreaterThan(0);
            });
        });
    });
})();