(function () {
    'use strict';
    describe('Testing skipCommandEditorSvc service', function () {
        var svc,
            settingConst,
            expressionBuilderConst,
            surveyEditorSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                settingConst = jasmine.createSpyObj('settingConst', ['questionTypes', '']);
                expressionBuilderConst = jasmine.createSpyObj('expressionBuilderConst', ['operators', 'logicalOperators']);
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getPages']);

                $provide.value('settingConst', settingConst);
                $provide.value('expressionBuilderConst', expressionBuilderConst);
                $provide.value('surveyEditorSvc', surveyEditorSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('skipCommandEditorSvc');
            });
        });

        describe('Testing getQuestionDestinations function', function () {
            var result;

            it('Should checked properties function', function () {
                var questionDestinations = 1,
                    pageId,
                    page = [2];

                surveyEditorSvc.getPages.and.returnValue([{}]);
                result = svc.getQuestionDestinations(pageId);

                expect(result).toEqual([]);
            });

            it('Should checked questiondestination function when it has not value', function () {
                var pageId = [1],
                    page = [{ QuestionDefinitions: [3] }],
                    pageIdsInSurvey = [0, 2, 1];

                surveyEditorSvc.getPages.and.returnValue([{}]);
                result = svc.getQuestionDestinations(pageId);

                expect(result).not.toEqual(null);
            });
        });

        describe('Testing deepCompareSkipCommands function', function () {
            var result;

            it('Should checked properties deepCompare function', function () {
                var originalSkipCommand = 1,
                    newSkipCommand = 1;

                result = svc.deepCompareSkipCommands(originalSkipCommand, newSkipCommand);

                expect(result).toEqual(true);
            });

            it('Should checked properties deepCompare function', function () {
                var originalSkipCommand = 2,
                    newSkipCommand = 1;

                result = svc.deepCompareSkipCommands(originalSkipCommand, newSkipCommand);

                expect(result).toEqual(false);
            });

            it('Should checked properties deepCompare function', function () {
                var originalSkipCommand = { constructor: 2 },
                    newSkipCommand = { constructor: 3 };

                result = svc.deepCompareSkipCommands(originalSkipCommand, newSkipCommand);

                expect(result).toEqual(false);
            });
        });

        describe('Testing validateSkipCommand function', function () {
            var result,
                skipAction = { SkipToQuestionId: null };

            it('Should checked message validation when it has value for SkipToQuestionId', function () {
                result = svc.validateSkipCommand(skipAction);

                expect(result).toEqual(false);
            });

            it('Should checked message validation when it has value for SkipToQuestionId', function () {
                var skipAction = { SkipToQuestionId: [] };

                result = svc.validateSkipCommand(skipAction);

                expect(result).toEqual(false);
            });
        });

        describe('Testing buildSkipCommand function', function () {
            var result,
                skipCommand = { QuestionDestinations: [], pageDefinitionId: 1 },
                pageId = 1;

            it('Should checked properties buildSkipCommand function', function () {
                surveyEditorSvc.getPages.and.returnValue([{}]);

                result = svc.buildSkipCommand(skipCommand, pageId);

                expect(result.QuestionDestinations).toEqual([]);
            });
        });

        describe('Testing renderOperatorStringForDisplay function', function () {
            var result;

            it('Should checked properties function', function () {
                var operator = 1,
                    OPERATORS = [{ value: 1 }];

                result = svc.renderOperatorStringForDisplay(operator);

                expect(result).not.toEqual(null);
            });
        });

        describe('Testing renderLogicalOperatorStringForDisplay function', function () {
            var result;

            it('Should checked properties function', function () {
                var logicalOperator = 1,
                    LOGILCAL_OPERATORS = [{ value: 1 }];

                result = svc.renderLogicalOperatorStringForDisplay(logicalOperator);

                expect(result).not.toEqual(null);
            });
        });

    });
})();