(function() {
    describe('Testing surveyEditorMessageSvc service', function () {
        var svc, arrayUtilSvc;

        beforeEach(function() {
            module('svt');
            module(function ($provide) {
                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['isArrayHasElement']);
                arrayUtilSvc.isArrayHasElement.and.callFake(function (array) {
                    return array.length > 0;
                });

                $provide.value('arrayUtilSvc', arrayUtilSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('surveyEditorMessageSvc');
            });
        });

        describe('Testing buildReferenceQuestionPageMessageContent function', function() {
            var carryOverQuestionPositions,
                displayLogicQuestionPositions,
                optionMaskQuestionPosition,
                skipActionPageTitles,
                result;

            it('should combine existed messages to return', function () {
                carryOverQuestionPositions = [{ dummy: 'dummy' }];
                displayLogicQuestionPositions = [{ dummy: 'dummy 1' }];
                optionMaskQuestionPosition = [{ dummy: 'dummy 3' }];
                skipActionPageTitles = [{ dummy: 'dummy 2' }];

                result = svc.buildReferenceQuestionPageMessageContent(
                    carryOverQuestionPositions, displayLogicQuestionPositions, optionMaskQuestionPosition, skipActionPageTitles);

                expect(result).not.toEqual('');
                expect(result.split('<br/>').length).toBeGreaterThan(1);
            });

            it('should return empty result with no actual message', function () {
                carryOverQuestionPositions = [];
                displayLogicQuestionPositions = [];
                optionMaskQuestionPosition = [];
                skipActionPageTitles = [];

                result = svc.buildReferenceQuestionPageMessageContent(
                    carryOverQuestionPositions, displayLogicQuestionPositions, optionMaskQuestionPosition, skipActionPageTitles);

                expect(result).toEqual('');
            });
        });
    });
})();