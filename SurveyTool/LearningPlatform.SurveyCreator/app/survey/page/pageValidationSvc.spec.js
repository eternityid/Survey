(function () {
    'use strict';
    describe('Testing pageValidationSvc service', function () {
        var svc, pageSvc, pageDataSvc, surveyEditorSvc, surveyEditorPageSvc, surveyEditorValidationSvc, questionCarryOverSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                pageSvc = jasmine.createSpyObj('pageSvc', ['getCurrentPages']);
                pageDataSvc = jasmine.createSpyObj('pageDataSvc', ['addPage']);
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'getQuestionsWithOptions', 'getAllNoneInformationQuestionPositionsInSurvey', 'getPages'
                ]);

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', ['isThankYouPage']);
                surveyEditorPageSvc.isThankYouPage.and.callFake(function (page) {
                    return page && page.isThankYouPage;
                });

                surveyEditorValidationSvc = jasmine.createSpyObj('surveyEditorValidationSvc', [
                    'getQuestionPositionsHaveQuestionMarkUseQuestion', 'getPageTitlesHaveSkipCommandUseQuestion',
                    'getQuestionPositionsHaveQuestionMarkUsePage', 'getPageTitlesHaveSkipCommandUsePage',
                    'getQuestionPositionsHaveOptionMarkUseQuestions'
                ]);

                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', [
                    'getPositionsByCarryOverRelationship',
                    'getChildQuestionPositions'
                ]);

                $provide.value('pageSvc', pageSvc);
                $provide.value('pageDataSvc', pageDataSvc);
                $provide.value('surveyEditorSvc', surveyEditorSvc);
                $provide.value('surveyEditorPageSvc', surveyEditorPageSvc);
                $provide.value('surveyEditorValidationSvc', surveyEditorValidationSvc);
                $provide.value('questionCarryOverSvc', questionCarryOverSvc);
            });
            inject(function($injector) {
                svc = $injector.get('pageValidationSvc');
            });
        });

        describe('Testing validateMovingQuestions function', function () {
            var event, noneInformationQuestionPositionsInSurvey = [1, 2, 3, 5];
            beforeEach(function () {
                event = {
                    dest: {
                        sortableScope: {
                            $parent: {
                                pageCtrl: {
                                    currentPage: {
                                        id: 1
                                    }
                                }
                            }
                        },
                        index: 1
                    },
                    source: {
                        itemScope: {
                            question: {
                                id: 2,
                                pageDefinitionId: 2
                            }
                        },
                        sortableScope: {
                            $parent: {
                                pageCtrl: {
                                    currentPage: {}
                                }
                            }
                        },
                        index: 2
                    }
                };
                surveyEditorSvc.getAllNoneInformationQuestionPositionsInSurvey.and.returnValue([1, 2, 3, 5]);
                pageSvc.getCurrentPages.and.returnValue([
                    { id: 1, questionDefinitions: [{ id: 1 }] },
                    { id: 2, questionDefinitions: [{ id: 2, questionMaskExpression: { expressionItems: [{}] } }] },
                    { id: 3, isThankYouPage: true }
                ]);
                surveyEditorSvc.getPages.and.returnValue([{ id: 1 }, { id: 2 }, { id: 3 }]);
            });

            it('should not permit to move thank you page', function() {
                event.dest.sortableScope.$parent.pageCtrl.currentPage = { isThankYouPage: true };
                spyOn(toastr, 'warning');

                svc.validateMovingQuestions(event, noneInformationQuestionPositionsInSurvey);

                expect(toastr.warning).toHaveBeenCalled();
            });

            it('should validate when question uses question mask', function () {
                event.source.itemScope.question.questionMaskExpression = { expressionItems: [{ questionId: 1 }, { questionId: 2 }] };

                svc.validateMovingQuestions(event, noneInformationQuestionPositionsInSurvey);

                expect(surveyEditorSvc.getAllNoneInformationQuestionPositionsInSurvey).toHaveBeenCalled();
            });

            it('should validate when having any question uses the question as part of question mask', function () {
                event.source.itemScope.question.questionMaskExpression = null;

                svc.validateMovingQuestions(event, noneInformationQuestionPositionsInSurvey);

                expect(pageSvc.getCurrentPages).toHaveBeenCalled();
            });

            it('should validate question with skip action', function () {

                svc.validateMovingQuestions(event, noneInformationQuestionPositionsInSurvey);
            });
        });

        describe('Testing getChildQuestionPositionsWhenDeleting function', function () {
            var deletingQuestionCodes = [], positions;

            it('should return empty array with invalid question codes', function() {
                positions = svc.getChildQuestionPositionsWhenDeleting(deletingQuestionCodes);

                expect(positions.length).toEqual(0);
            });

            it('should return all child questions', function() {
                deletingQuestionCodes = [1, 2];
                surveyEditorSvc.getQuestionsWithOptions.and.returnValue([
                    {
                        title: { items: [{}] },
                        optionList: { options: [] }
                    },
                    {
                        title: { items: [{}] },
                        optionList: { options: [] },
                        subQuestionDefinition: {
                            optionList: {
                                options: [
                                    {
                                        optionsMask: {}
                                    }, {
                                        optionsMask: { questionId: 1 }
                                    }, {
                                        optionsMask: { questionId: -1 }
                                    }
                                ]
                            }
                        }
                    }
                ]);

                positions = svc.getChildQuestionPositionsWhenDeleting(deletingQuestionCodes);

                expect(positions.length).toBeGreaterThan(0);
            });
        });

        describe('Testing validateWhenRemovingQuestion function', function () {
            var question = {},
                result;

            it('should not build carry over, question mark and skip logic messages', function() {
                spyOn(svc, 'getChildQuestionPositionsWhenDeleting').and.returnValue([]);
                surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseQuestion.and.returnValue([]);
                surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseQuestion.and.returnValue([]);

                result = svc.validateWhenRemovingQuestion(question);

                expect(result.confirmMessage.indexOf('<br/>')).toEqual(-1);
            });

            it('should build carry over, question mark and skip logic messages', function() {
                spyOn(svc, 'getChildQuestionPositionsWhenDeleting').and.returnValue([3]);
                surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUseQuestion.and.returnValue([4]);
                surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUseQuestion.and.returnValue([5]);
                questionCarryOverSvc.getPositionsByCarryOverRelationship(2);
                result = svc.validateWhenRemovingQuestion(question);

                expect(result.confirmMessage.split('<br/>').length).toEqual(6);
            });
        });

        describe('Testing validateWhenRemovingPage function', function () {
            var page = { questionDefinitions: [{}], title: { items: [{ text: 'dummy' }] } },
                result;

            it('should not build carry over, question mark and skip logic messages', function() {
                spyOn(svc, 'getChildQuestionPositionsWhenDeleting').and.returnValue([]);
                surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUsePage.and.returnValue([]);
                surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUsePage.and.returnValue([]);

                result = svc.validateWhenRemovingPage(page);

                expect(result.confirmMessage.indexOf('<br/>')).toEqual(-1);
            });

            it('should build carry over, question mark and skip logic messages', function() {
                spyOn(svc, 'getChildQuestionPositionsWhenDeleting').and.returnValue([1]);
                surveyEditorValidationSvc.getQuestionPositionsHaveQuestionMarkUsePage.and.returnValue([2]);
                surveyEditorValidationSvc.getPageTitlesHaveSkipCommandUsePage.and.returnValue([3]);

                result = svc.validateWhenRemovingPage(page);

                expect(result.confirmMessage.split('<br/>').length).toEqual(7);
            });
        });
    });
})();