var Promise = require('bluebird');
describe('Survey Designer', function () {
    var SurveyEditorPage = requirePage('app/survey/surveyEditorPage'),
        PageContainerPage = requirePage('app/survey/pageContainerPage'),
        SurveyListPage = requirePage('app/survey/surveyListPage'),
        surveyEditorPage,
        surveyListPage,
        pageContainer,
        surveyTitle = (new Date().toUTCString()) + " For Testing Questions",
        surveyListPage = new SurveyListPage(),
        surveyEditorPage = new SurveyEditorPage(),
        waitingUtil = new (requireUtil('waitingUtil.js'))();

    beforeAll(function (done) {
        surveyListPage.goTo();
        surveyListPage.createSurvey(surveyTitle);
        waitingUtil.waitForElementVisible(surveyEditorPage.btnLookandFeel, 5000);
        pageContainer = new PageContainerPage();
        pageContainer.getPageByIndex(0).clickAddNewPage();
        done();
    });

    describe('Create Question', function () {
        it('should add Short Text question type on first page', function (done) {
            pageContainer.getPageByIndex(0).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(0).clickAddTextQuestion();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setTitle('Short Text Question Type');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setDescription('Short Text Question Type Sample');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });

        it('should add Single Selection question on second page', function (done) {
            pageContainer.getPageByIndex(1).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(1).clickAddSingleSelectionQuestion();
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.setTitle('Title 2');
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.setDescription('Single Choice Question Type Sample');
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.clickAddSingleSelectionOption();
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(1).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(1).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });

        it('should add Multiple Selection question on first page', function (done) {
            pageContainer.getPageByIndex(0).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(0).clickAddMultipleSelectionQuestion();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setTitle('Title 3');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setDescription('Description 3');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickAddMultipleSelectionOption();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });

        it('should add Information question on second page', function (done) {
            pageContainer.getPageByIndex(1).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(1).clickAddInformationQuestion();
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.setTitle('Title 4');
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.setDescription('Description 4');
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(1).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(1).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });

        it('should add Numeric question on second page', function (done) {
            pageContainer.getPageByIndex(0).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(0).clickAddNumericQuestion();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setTitle('Title 5');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setDescription('Description 4');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });

        it('should add Single Selection Grid question on second page', function (done) {
            pageContainer.getPageByIndex(1).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(1).clickAddSingleSelectioGridQuestion();
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.setTitle('Title 6');
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.setDescription('Description 6');
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.clickAddSingleSelectionGridOption();
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.clickAddSingleSelectionGridTopic();
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(1).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(1).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });

        it('should add Multiple Selection Grid question on first page', function (done) {
            pageContainer.getPageByIndex(0).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(0).clickAddMultipleSelectionGridQuestion();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setTitle('Title 7');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setDescription('Description 7');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickAddMultipleSelectionGridOption();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickAddMultipleSelectionGridTopic();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });

        it('should add Scale question on second page', function (done) {
            pageContainer.getPageByIndex(1).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(1).clickAddScaleQuestion();
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.setTitle('Title 8');
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.setDescription('Description 8');
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.clickAddScaleConditions();
                pageContainer.getPageByIndex(1).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(1).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(1).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });

        it('should add Net Promoter Score question on first page', function (done) {
            pageContainer.getPageByIndex(0).getQuestionsCount().then(function (firstCount) {
                pageContainer.getPageByIndex(0).clickAddNetPromoterScoreQuestion();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setDescription('Description 9');
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickAddNetPromoterConditions();
                pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickDone();
                browser.driver.wait(function () {
                    return pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                        return firstCount != secondCount;
                    });
                }, 5000);
                pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                    expect(firstCount).toBeLessThan(secondCount);
                    done();
                });
            });
        });
    });

    describe('Modifying Question (Updating, Deleting)', function () {
        it('should update the title of first question on first page successfully', function (done) {
            pageContainer.getPageByIndex(0).firstQuestionDisplay.getTitleText().then(function (originalTitle) {
                pageContainer.getPageByIndex(0).firstQuestionDisplay.clickToEdit().then(function () {
                    pageContainer.getPageByIndex(0).firstEditQuestionDialog.setTitle(originalTitle + '-test').then(function () {
                        pageContainer.getPageByIndex(0).firstEditQuestionDialog.clickDone();
                        pageContainer.getPageByIndex(0).firstQuestionDisplay.getTitleText().then(function (newTitle) {
                            expect(originalTitle).not.toEqual(newTitle);
                            expect(newTitle).toContain('-test');
                            done();
                        });
                    });
                });
            });
        });
    });

    afterAll(function (done) {
        surveyListPage.deleteFirstSurveyByTitle(surveyTitle);
        done();
    });
});