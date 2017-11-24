(function () {
    describe('Testing surveyEditorSvc service', function () {
        var svc,
            spinnerUtilSvc,
            surveySvc,
            arrayUtilSvc,
            numberUtilSvc,
            stringUtilSvc,
            authSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                surveySvc = jasmine.createSpyObj('surveySvc', ['getStatusDisplay']);

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['isArrayHasElement']);

                numberUtilSvc = jasmine.createSpyObj('numberUtilSvc', ['convertIntegerToAlphabet']);

                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['getPlainText', 'truncateByCharAmount']);
                authSvc = jasmine.createSpyObj('authSvc', ['getLoginData']);
                authSvc.getLoginData.and.returnValue({});

                $provide.value('spinnerUtilSvc', spinnerUtilSvc);
                $provide.value('surveySvc', surveySvc);
                $provide.value('arrayUtilSvc', arrayUtilSvc);
                $provide.value('numberUtilSvc', numberUtilSvc);
                $provide.value('stringUtilSvc', stringUtilSvc);
                $provide.value('authSvc', authSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('surveyEditorSvc');
            });
        });

        describe('Testing setupClientSurveyFromApiSurvey function', function () {
            it('should setup survey data', function () {
                var survey = {
                    topFolder: {
                        childNodes: [
                            {
                                skipCommands: []
                            }
                        ]
                    }
                };
                var surveyData = svc.getData();

                svc.setupClientSurveyFromApiSurvey(survey);

                expect(surveyData.survey).toEqual(survey);
            });
        });

        describe('Testing getSurveyEditMode function', function () {
            it('should return surveyEditMode ', function () {
                var result = null;

                result = svc.getSurveyEditMode();

                expect(result).not.toEqual(null);
            });
        });

        describe('Testing getSvtPlaceholderItemsByQuestionId function', function () {
            var questionId = 1, result;

            it('should return empty list when survey empty or have only information questions', function () {
                var survey = {
                    topFolder: {
                        childNodes: [
                            {
                                skipCommands: []
                            }
                        ]
                    }
                };
                svc.setupClientSurveyFromApiSurvey(survey);

                result = svc.getSvtPlaceholderItemsByQuestionId(questionId);

                expect(result).toEqual([]);
            });

            it('should return empty list when have questions for svtplaceholder', function () {
                var survey = {
                    topFolder: {
                        childNodes: [
                            {
                                $type: 'PageDefinition',
                                skipCommands: [],
                                questionDefinitions: [
                                    {
                                        $type: 'dummy',
                                        id: 'dummy',
                                        title: {
                                            items: [
                                                {text: 'dummy'}
                                            ]
                                        },
                                        alias: 'dummy'
                                    }
                                ]
                            }
                        ]
                    }
                };
                svc.setupClientSurveyFromApiSurvey(survey);
                arrayUtilSvc.isArrayHasElement.and.returnValue(true);

                result = svc.getSvtPlaceholderItemsByQuestionId(questionId);

                expect(result.length).toBeGreaterThan(0);
            });
        });

    });
})();