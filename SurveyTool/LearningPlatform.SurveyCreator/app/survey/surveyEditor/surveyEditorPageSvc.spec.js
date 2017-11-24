(function () {
    describe('Testing surveyEditorPageSvc service', function () {
        var svc,
            surveyEditorSvc,
            arrayUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['setSurveyEditMode',
                    'getData',
                    'refreshSummaryDataForSurvey',
                    'setupQuestionPositionInSurvey',
                    'getPages']);

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['isArrayHasElement']);

                $provide.value('surveyEditorSvc', surveyEditorSvc);
                $provide.value('arrayUtilSvc', arrayUtilSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('surveyEditorPageSvc');
            });
        });

        describe('Testing getPageById function', function () {
            var result;

            it('Should checked pageId properties function', function () {
                var pageId = 1,
                    pages = [{ id: 1 }];

                surveyEditorSvc.getPages.and.returnValue([{ id: 1 }]);
                result = svc.getPageById(pageId);

                expect(result.id).toEqual(1);
            });

            it('Should checked pageId properties function', function () {
                var pageId = 1,
                    pages = [{}];

                surveyEditorSvc.getPages.and.returnValue([{ id: 5 }]);
                result = svc.getPageById(pageId);

                expect(result).toEqual(null);
            });

        });

        describe('Testing getQuestionsByPageId function', function () {
            var result;

            it('Should checked pageId properties function', function () {
                var pageId = 1,
                    pages = [{}];

                surveyEditorSvc.getPages.and.returnValue([{ id: 5 }]);
                result = svc.getQuestionsByPageId(pageId);

                expect(result).toEqual([]);
            });
        });

        describe('Testing getQuestionsBeforePageId function', function () {
            var result;

            it('Should checked pageId properties function', function () {
                var pageId = 1;

                surveyEditorSvc.getPages.and.returnValue([{ id: 1 }]);
                result = svc.getQuestionsBeforePageId(pageId);

                expect(result).toEqual([]);
            });

        });

        describe('Testing appendQuestionIntoPage function', function () {
            var result;

            it('Should checked pageId properties function', function () {
                var pageId = 1;

                surveyEditorSvc.getPages.and.returnValue([{ id: 1 }]);
                result = svc.appendQuestionIntoPage(pageId);

                expect(result).not.toEqual(null);
            });
        });
    });
})();