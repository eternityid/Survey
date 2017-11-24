(function () {
    describe('Testing surveyEditorQuestionSvc service', function () {
        var svc,
            surveyEditorSvc,
            surveyEditorPageSvc,
            arrayUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['setSurveyEditMode',
                    'setQuestionEditorId',
                    'refreshSummaryDataForSurvey',
                    'setupQuestionPositionInSurvey',
                    'getPages']);

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', ['getQuestionsByPageId']);

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['isArrayHasElement']);

                $provide.value('surveyEditorSvc', surveyEditorSvc);
                $provide.value('surveyEditorPageSvc', surveyEditorPageSvc);
                $provide.value('arrayUtilSvc', arrayUtilSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('surveyEditorQuestionSvc');
            });
        });
        describe('Testing getOptionIdsOfQuestion function', function () {
            it('should return option id', function () {
                var questionHaveOptions = {
                    optionList: {
                        options: []
                    }
                };
                var result;

                result = svc.getOptionIdsOfQuestion(questionHaveOptions);

                expect(result).toEqual([]);
            });
        });

        describe('Testing handleDoneCreateQuestion function', function () {
            it('should call setSurveyEditMode function', function () {
                var result = svc.handleDoneCreateQuestion();
            });
        });
    });
    })();