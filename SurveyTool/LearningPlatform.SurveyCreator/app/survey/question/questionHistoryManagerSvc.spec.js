(function () {
    describe('Testing questionHistoryManagerSvc service', function () {
        var svc,
            guidUtilSvc,
            questionConst,
            serverValidationSvc,
            questionAdvanceSettingSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide, $injector) {
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);
                questionConst = $injector.get('questionConst');
                serverValidationSvc = jasmine.createSpyObj('serverValidationSvc', ['getServerValidationTypes']);
                questionAdvanceSettingSvc = jasmine.createSpyObj('questionAdvanceSettingSvc', ['getDisplayOrientations']);

                $provide.value('guidUtilSvc', guidUtilSvc);
                $provide.value('serverValidationSvc', serverValidationSvc);
                $provide.value('questionAdvanceSettingSvc', questionAdvanceSettingSvc);
            });

            inject(function ($injector) {
                svc = $injector.get('questionHistoryManagerSvc');
            });
        });

        describe('Testing clearHistories function', function () {
            it('should clear all histories', function () {
                svc.setQuestionHistories({ dummy: 'dummy' });

                svc.clearHistories();

                expect(svc.getQuestionHistories()).toEqual({});
            });
        });

        describe('Testing updateQuestionHistory function', function () {
            var question = {},
                questionHistories;

            describe('Long text question type', function () {
                beforeEach(function () {
                    question.$type = questionConst.questionTypes.longText;
                });

                it('should initialize question history for long text when it does not exist', function () {
                    svc.setQuestionHistories({ dummy: 'dummy' });

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.longText).toEqual(jasmine.any(Object));
                });

                it('should update question history for long text when it already exists', function () {
                    svc.setQuestionHistories({ longText: { rows: 1 } });
                    question.rows = 10;

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.longText.rows).toEqual(10);
                });
            });

            describe('Single/Multiple selection question type', function () {
                it('should initialize question history for single/multiple selection when it does not exist', function () {
                    svc.setQuestionHistories({ dummy: 'dummy' });
                    question.$type = questionConst.questionTypes.singleSelection;

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.simpleSelection).toEqual(jasmine.any(Object));
                });

                it('should update question history for single/multiple selection when it already exists', function () {
                    svc.setQuestionHistories({ simpleSelection: { optionList: {} } });
                    question.$type = questionConst.questionTypes.multipleSelection;
                    question.optionList = { dummy: 'dummy' };

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.simpleSelection.optionList).not.toEqual({});
                    expect(questionHistories.simpleSelection.optionList).toEqual(jasmine.any(Object));
                });
            });

            describe('Rating question type', function () {
                beforeEach(function () {
                    question.$type = questionConst.questionTypes.rating;
                });

                it('should initialize question history for rating when it does not exist', function () {
                    svc.setQuestionHistories({ dummy: 'dummy' });

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.rating).toEqual(jasmine.any(Object));
                });

                it('should update question history for rating when it already exists', function () {
                    svc.setQuestionHistories({ rating: { shapeName: 'dummy' } });
                    question.shapeName = 'star';

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.rating.shapeName).toEqual('star');
                });
            });

            describe('Scale question type', function () {
                beforeEach(function () {
                    question.$type = questionConst.questionTypes.scale;
                });

                it('should initialize question history for scale when it does not exist', function () {
                    svc.setQuestionHistories({ dummy: 'dummy' });

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.scale).toEqual(jasmine.any(Object));
                });

                it('should update question history for scale when it already exists', function () {
                    svc.setQuestionHistories({ scale: { likertLeftText: 'dummy' } });
                    question.likertLeftText = 'left';

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.scale.likertLeftText).toEqual('left');
                });
            });

            describe('Net promoter score question type', function () {
                beforeEach(function () {
                    question.$type = questionConst.questionTypes.netPromoterScore;
                });

                it('should initialize question history for net promoter score when it does not exist', function () {
                    svc.setQuestionHistories({ dummy: 'dummy' });

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.netPromoterScore).toEqual(jasmine.any(Object));
                });

                it('should update question history for net promoter score when it already exists', function () {
                    svc.setQuestionHistories({ netPromoterScore: { likertRightText: 'dummy' } });
                    question.likertRightText = 'right';

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.netPromoterScore.likertRightText).toEqual('right');
                });
            });

            describe('Single/Multiple picture selection question type', function () {
                it('should initialize question history for single/multiple picture selection when it does not exist', function () {
                    svc.setQuestionHistories({ dummy: 'dummy' });
                    question.$type = questionConst.questionTypes.pictureSingleSelection;
                    question.optionList = { dummy: 'dummy' };

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.pictureSelection).toEqual(jasmine.any(Object));
                    expect(questionHistories.pictureSelection.optionList).toEqual(jasmine.any(Object));
                });

                it('should update question history for single/multiple selection when it already exists', function () {
                    svc.setQuestionHistories({ pictureSelection: { orderType: {} } });
                    question.$type = questionConst.questionTypes.pictureMultipleSelection;
                    question.optionList = { dummy: 'dummy' };
                    question.orderType = { dummy: 'dummy' };

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.pictureSelection.orderType).not.toEqual({});
                    expect(questionHistories.pictureSelection.optionList).toEqual(jasmine.any(Object));
                });
            });

            describe('Grid selection question type', function () {
                it('should initialize question history for grid selection when it does not exist', function () {
                    svc.setQuestionHistories({ dummy: 'dummy' });
                    question.$type = questionConst.questionTypes.singleSelectionGrid;

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.selectionGrid).toEqual(jasmine.any(Object));
                });

                it('should update question history for grid selection when it already exists', function () {
                    svc.setQuestionHistories({ selectionGrid: { subQuestion: 'dummy' } });
                    question.$type = questionConst.questionTypes.multipleSelectionGrid;
                    question.subQuestionDefinition = {};

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.selectionGrid.subQuestion).toEqual(jasmine.any(Object));
                });
            });

            describe('Text list question type', function () {
                beforeEach(function () {
                    question.$type = questionConst.questionTypes.shortTextList;
                });

                it('should initialize question history for short text list when it does not exist', function () {
                    svc.setQuestionHistories({ dummy: 'dummy' });

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.textList).toEqual(jasmine.any(Object));
                });

                it('should update question history for text list when it already exists', function () {
                    svc.setQuestionHistories({ textList: { optionList: {} } });
                    question.optionList = {};

                    svc.updateQuestionHistory(question);
                    questionHistories = svc.getQuestionHistories();

                    expect(questionHistories.textList.optionList).toEqual(jasmine.any(Object));
                });
            });
        });

        describe('Testing setupQuestionAfterChangingType function', function () {
            var newQuestionType,
                oldQuestion = {},
                newQuestion;

            it('should not setup short text question properties', function () {
                newQuestionType = questionConst.questionTypes.shortText;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);

                expect(newQuestion.rows).not.toBeDefined();
            });

            it('should setup long text question properties', function () {
                newQuestionType = questionConst.questionTypes.longText;
                svc.setQuestionHistories({ longText: { rows: 5 } });

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);

                expect(newQuestion.rows).toBeDefined();
            });

            it('should setup rating question properties', function () {
                newQuestionType = questionConst.questionTypes.rating;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.shapeName).not.toBeDefined();

                svc.setQuestionHistories({ rating: { shapeName: 'star' } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.shapeName).toBeDefined();
            });

            it('should setup scale question properties', function () {
                newQuestionType = questionConst.questionTypes.scale;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.likertCenterText).not.toBeDefined();

                svc.setQuestionHistories({ scale: { likertCenterText: 'center' } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.likertCenterText).toEqual('center');
            });

            it('should setup net promoter score question properties', function () {
                newQuestionType = questionConst.questionTypes.netPromoterScore;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.likertRightText).not.toBeDefined();

                svc.setQuestionHistories({ netPromoterScore: { likertRightText: 'right' } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.likertRightText).toEqual('right');
            });

            it('should setup single selection question properties', function () {
                newQuestionType = questionConst.questionTypes.singleSelection;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.optionsMask).not.toBeDefined();

                svc.setQuestionHistories({ simpleSelection: { optionsMask: {} } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.optionsMask).toEqual(jasmine.any(Object));
            });

            describe('Multiple selection question type', function () {
                beforeEach(function () {
                    newQuestionType = questionConst.questionTypes.multipleSelection;
                    svc.setQuestionHistories({ simpleSelection: { displayOrientation: '0' } });
                });

                it('should setup display orientation by history',
                    function () {
                        questionAdvanceSettingSvc.getDisplayOrientations.and.returnValue(['0', '1', '2']);

                        newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);

                        expect(newQuestion.displayOrientation).toEqual('0');
                    });
            });

            it('should setup single selection picture question properties', function () {
                newQuestionType = questionConst.questionTypes.pictureSingleSelection;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.isPictureShowLabel).not.toBeDefined();

                svc.setQuestionHistories({ pictureSelection: { isPictureShowLabel: true, optionList: {} } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);

                expect(newQuestion.isPictureShowLabel).toEqual(true);
                expect(newQuestion.optionList).toEqual(jasmine.any(Object));
            });

            it('should setup multiple selection picture question properties', function () {
                newQuestionType = questionConst.questionTypes.pictureMultipleSelection;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.orderType).not.toBeDefined();

                svc.setQuestionHistories({ pictureSelection: { orderType: '1', optionList: {} } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);

                expect(newQuestion.orderType).toEqual('1');
                expect(newQuestion.optionList).toEqual(jasmine.any(Object));
            });

            it('should setup short text list question properties', function () {
                newQuestionType = questionConst.questionTypes.shortTextList;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.optionList).toEqual(null);

                svc.setQuestionHistories({ shortTextList: { optionList: {} } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);

                expect(newQuestion.optionList).toEqual(jasmine.any(Object));
            });

            it('should setup grid single selection question properties', function () {
                newQuestionType = questionConst.questionTypes.singleSelectionGrid;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.subQuestionDefinition).not.toBeDefined();

                svc.setQuestionHistories({ selectionGrid: { subQuestion: {} } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);

                expect(newQuestion.subQuestionDefinition).toEqual(jasmine.any(Object));
            });

            it('should setup grid multiple selection question properties', function () {
                newQuestionType = questionConst.questionTypes.multipleSelectionGrid;

                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);
                expect(newQuestion.transposed).not.toBeDefined();

                svc.setQuestionHistories({ selectionGrid: { transposed: true, subQuestion: {} } });
                newQuestion = svc.setupQuestionAfterChangingType(newQuestionType, oldQuestion);

                expect(newQuestion.transposed).toEqual(true);
            });
        });
    });
})();