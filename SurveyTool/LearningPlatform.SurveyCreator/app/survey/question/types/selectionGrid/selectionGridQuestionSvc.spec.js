(function() {
    describe('Testing selectionGridQuestionSvc service', function() {
        var svc, guidUtilSvc, languageStringUtilSvc, selectionOptionListSvc, questionConst;

        beforeEach(function() {
            module('svt');
            module(function ($provide, $injector) {
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);
                languageStringUtilSvc = jasmine.createSpyObj('languageStringUtilSvc', ['buildLanguageString']);
                selectionOptionListSvc = jasmine.createSpyObj('selectionOptionListSvc', ['buildDefaultOptions']);
                questionConst = $injector.get('questionConst');

                $provide.value('guidUtilSvc', guidUtilSvc);
                $provide.value('languageStringUtilSvc', languageStringUtilSvc);
                $provide.value('selectionOptionListSvc', selectionOptionListSvc);
                $provide.value('questionConst', questionConst);
            });

            inject(function($injector) {
                svc = $injector.get('selectionGridQuestionSvc');
            });
        });

        describe('Testing buildDefaultSubQuestionDefinition function', function () {
            var question = { surveyId: 1 },
                isSingleSelectionGridQuestion,
                defaultQuestion;

            it('should return single grid question', function () {
                isSingleSelectionGridQuestion = true;

                defaultQuestion = svc.buildDefaultSubQuestionDefinition(question, isSingleSelectionGridQuestion);

                expect(defaultQuestion.$type).toEqual('SingleSelectionQuestionDefinition');
            });

            it('should return multiple grid question', function () {
                isSingleSelectionGridQuestion = false;

                defaultQuestion = svc.buildDefaultSubQuestionDefinition(question, isSingleSelectionGridQuestion);

                expect(defaultQuestion.$type).toEqual('MultipleSelectionQuestionDefinition');
            });
        });
    });
})();