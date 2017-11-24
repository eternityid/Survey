(function () {
    describe('Testing surveyEditorValidationSvc service', function () {
        var svc,
            surveyEditorSvc,
            surveyEditorPageSvc,
            surveyEditorQuestionSvc,
            scaleQuestionSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'getPages', 'getQuestions'
                ]);

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', [
                    'isThankYouPage', 'getPageById', 'getQuestionIdsInPage'
                ]);
                surveyEditorPageSvc.isThankYouPage.and.callFake(function (page) {
                    return page.nodeType === 'ThankYouPage';
                });

                surveyEditorQuestionSvc = jasmine.createSpyObj('surveyEditorQuestionSvc', [
                    'getOptionIdsOfQuestion'
                ]);

                scaleQuestionSvc = jasmine.createSpyObj('scaleQuestionSvc', [
                    'getScoreByOptionList'
                ]);

                $provide.value('surveyEditorSvc', surveyEditorSvc);
                $provide.value('surveyEditorQuestionSvc', surveyEditorQuestionSvc);
                $provide.value('scaleQuestionSvc', scaleQuestionSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('surveyEditorValidationSvc');
            });
        });

        describe('Testing getQuestionPositionsHaveQuestionMarkUseOptions function', function () {
            var question, options, positions = [];
            it('should return non empty position array', function () {
                question = { id: 1};
                options = [{ id: 1 }];
                surveyEditorSvc.getQuestions.and.returnValue([
                    {
                        questionMaskExpression: null
                    }, {
                        id: 2,
                        questionMaskExpression: { expressionItems: [{}, { optionId: 1 }] }
                    }
                ]);

                positions = svc.getQuestionPositionsHaveQuestionMarkUseOptions(question, options);

                expect(positions.length).toBeGreaterThan(0);
            });

            it('should return empty position array with invalid data', function () {
                question = {};
                options = [];

                positions = svc.getQuestionPositionsHaveQuestionMarkUseOptions(question, options);

                expect(positions.length).toEqual(0);
            });
        });

        describe('Testing getPageTitlesHaveSkipCommandUseOptions function', function () {
            var options, titles = [];

            it('should return page titles use option', function () {
                options = [{ optionId: 2 }];
                surveyEditorSvc.getPages.and.returnValue([
                    {
                        skipCommands: [],
                        title: { items: [{ text: 'p1' }] }
                    }, {
                        skipCommands: [
                            { expression: { expressionItems: [{}] } }, {
                                expression: { expressionItems: [{ optionId: 2 }] }
                            }
                        ],
                        title: { items: [{ text: 'p2' }] }
                    }
                ]);

                titles = svc.getPageTitlesHaveSkipCommandUseOptions(options);

                expect(titles.length).toBeGreaterThan(0);
            });

            it('should return empty page titles array with invalid data', function () {
                options = [];

                titles = svc.getPageTitlesHaveSkipCommandUseOptions(options);

                expect(titles.length).toEqual(0);
            });
        });

        describe('Testing getQuestionPositionsHaveQuestionMarkUseQuestion function', function () {
            var question, positions = [];

            it('should return question postions use checking question in display condition', function () {
                question = { id: 1 };
                surveyEditorSvc.getPages.and.returnValue([
                    {
                        questionDefinitions: [
                            {}, {
                                questionMaskExpression: {
                                    expressionItems: []
                                }
                            }, {
                                questionMaskExpression: {
                                    expressionItems: [{ questionId: 1 }]
                                }
                            }
                        ]
                    }
                ]);
                surveyEditorQuestionSvc.getOptionIdsOfQuestion.and.returnValue([]);

                positions = svc.getQuestionPositionsHaveQuestionMarkUseQuestion(question);

                expect(positions.length).toBeGreaterThan(0);
            });

            it('should return empty position array with invalid question', function () {
                question = null;

                positions = svc.getQuestionPositionsHaveQuestionMarkUseQuestion(question);

                expect(positions.length).toEqual(0);
            });
        });

        describe('Testing getPageTitlesHaveSkipCommandUseQuestion function', function () {
            var question, titles = [];

            it('should return page titles have skip command use checking question', function () {
                question = { id: 1 };
                surveyEditorSvc.getPages.and.returnValue([
                    {
                        skipCommands: [{ skipToQuestionId: 1 }],
                        title: { items: [{ text: 'p1' }] }
                    }, {
                        skipCommands: [
                            {
                                skipToQuestionId: 2
                            }, {
                                skipToQuestionId: 3,
                                expression: {
                                    expressionItems: [{ questionId: 1 }]
                                }
                            }
                        ],
                        title: { items: [{ text: 'p2' }] }
                    }, {
                        skipCommands: [
                            {
                                expression: {
                                    expressionItems: [{ questionId: 2 }]
                                }
                            }
                        ],
                        title: { items: [{ text: 'p3' }] }
                    }
                ]);

                titles = svc.getPageTitlesHaveSkipCommandUseQuestion(question);

                expect(titles.length).toEqual(2);
            });

            it('should return empty page titles array with invalid question', function () {
                question = null;

                titles = svc.getPageTitlesHaveSkipCommandUseQuestion(question);

                expect(titles.length).toEqual(0);
            });
        });

        describe('Testing getQuestionPositionsHaveQuestionMarkUsePage function', function () {
            var page = {
                id: 1,
                questionDefinitions: [
                    {
                        id: 1
                    }, {
                        id: 2,
                        optionList: {
                            options: [
                                {
                                    id: 10
                                }, { id: 20 }
                            ]
                        }
                    }
                ]
            };
            var positions = [];

            it('should return question postions have question mark uses the elements in page', function () {
                surveyEditorSvc.getPages.and.returnValue([
                    {
                        id: 10,
                        questionDefinitions: [
                            {}, {
                                questionMaskExpression: { expressionItems: [{ questionId: 10 }, { optionId: 20 }] }
                            }
                        ]
                    }
                ]);

                positions = svc.getQuestionPositionsHaveQuestionMarkUsePage(page);

                expect(positions.length).toBeGreaterThan(0);
            });

            it('should return empty position array when there is no question uses page elements', function () {
                surveyEditorSvc.getPages.and.returnValue([
                    {
                        questionDefinitions: [
                            {}, {
                                pageDefinitionId: 1,
                                questionMaskExpression: { expressionItems: [{ questionId: 2 }, { optionId: 1 }] }
                            }
                        ]
                    }
                ]);

                positions = svc.getQuestionPositionsHaveQuestionMarkUsePage(page);

                expect(positions.length).toEqual(0);
            });

            it('should return empty position array with invalid page', function () {
                page = null;

                positions = svc.getQuestionPositionsHaveQuestionMarkUsePage(page);

                expect(positions.length).toEqual(0);
            });
        });

        describe('Testing getPageTitlesHaveSkipCommandUsePage function', function () {
            var page, titles = [];

            it('should return page titles have skip command uses checking page', function () {
                page = {
                    id: 1,
                    questionDefinitions: [{ id: 10 }, { id: 20 }]
                };
                surveyEditorSvc.getPages.and.returnValue([
                    {
                        id: 1
                    }, {
                        skipCommands: [{ skipToQuestionId: 20 }]
                    }, {
                        skipCommands: [{ expression: { expressionItems: [] } }]
                    }, {
                        skipCommands: [
                            {
                                expression: {
                                    expressionItems: [{}, { questionId: 10 }]
                                }
                            }
                        ]
                    }
                ]);

                titles = svc.getPageTitlesHaveSkipCommandUsePage(page);

                expect(titles.length).toEqual(2);
            });

            it('should return empty page titles array with invalid page', function () {
                page = null;

                titles = svc.getPageTitlesHaveSkipCommandUsePage(page);

                expect(titles.length).toEqual(0);
            });
        });

        describe('Testing getQuestionPositionsHaveQuestionMarkUseOutOfRange function', function () {
            var questionHaveOptionRange = { id: 1, $type: 'RatingQuestionDefinition' };
            var positions = [];

            it('should return question postions that use out of range option', function () {
                questionHaveOptionRange.optionList = {
                    options: [{}, {}, {}]
                };
                surveyEditorSvc.getPages.and.returnValue([
                    {
                        questionDefinitions: [
                            {}, {
                                questionMaskExpression: {
                                    expressionItems: [
                                        {}, { questionId: 1, optionId: null }, { questionId: 1, optionId: 10 }
                                    ]
                                }
                            }, {
                                questionMaskExpression: {
                                    expressionItems: [
                                        { questionId: 1, value: '4' }
                                    ]
                                }
                            }
                        ]
                    }
                ]);

                positions = svc.getQuestionPositionsHaveQuestionMarkUseOutOfRange(questionHaveOptionRange);

                expect(positions.length).toEqual(1);
            });

            it('should return empty position array with invalid question', function () {
                questionHaveOptionRange = null;

                positions = svc.getQuestionPositionsHaveQuestionMarkUseOutOfRange(questionHaveOptionRange);

                expect(positions.length).toEqual(0);
            });
        });

        describe('Testing getPageTitlesHaveSkipCommandUseOutOfRange function', function () {
            var questionHaveOptionRange = { id: 1 };
            var titles = [];

            it('should return page titles that have skip command use out of range option', function () {
                scaleQuestionSvc.getScoreByOptionList.and.returnValue({ min: -2, max: 2 });
                surveyEditorSvc.getPages.and.returnValue([
                    {
                        skipCommands: [
                            {}, {
                                expression: {
                                    expressionItems: [
                                        { questionId: 1, value: '5' }
                                    ]
                                }
                            }
                        ],
                        title: { items: [{ text: 'p1' }] }
                    }, {
                        skipCommands: [{
                            expression: {
                                expressionItems: [
                                    {}
                                ]
                            }
                        }],
                        title: { items: [{ text: 'p2' }] }
                    }
                ]);

                titles = svc.getPageTitlesHaveSkipCommandUseOutOfRange(questionHaveOptionRange);

                expect(titles.length).toEqual(1);
            });

            it('should return empty page title array with invalid question', function () {
                questionHaveOptionRange = null;

                titles = svc.getPageTitlesHaveSkipCommandUseOutOfRange(questionHaveOptionRange);

                expect(titles.length).toEqual(0);
            });
        });

        describe('Testing validateMovingPage function', function () {
            var pages = [{ pageId: 0 }];

            it('should show error message when moving thank you page', inject(function (surveyEditorValidationSvc) {
                spyOn(toastr, 'warning');

                var result = surveyEditorValidationSvc.validateMovingPage(pages);

                expect(toastr.warning).toHaveBeenCalledWith('Cannot move thank you page.');
                expect(result).toEqual(false);
            }));
        });
    });
})();