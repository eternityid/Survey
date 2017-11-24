describe('Survey Designer', function () {
    var SurveyEditorPage = requirePage('app/survey/surveyEditorPage'),
        PageContainerPage = requirePage('app/survey/pageContainerPage'),
        SurveyListPage = requirePage('app/survey/surveyListPage'),
        surveyEditorPage,
        surveyListPage,
        surveyTitle = (new Date().toUTCString()) + " For Testing Pages",
        surveyListPage = new SurveyListPage(),
        surveyEditorPage = new SurveyEditorPage(),
        waitingUtil = new (requireUtil('waitingUtil.js'))();

    beforeAll(function (done) {
        surveyListPage.goTo();
        surveyListPage.createSurvey(surveyTitle);
        waitingUtil.waitForElementVisible(surveyEditorPage.btnLookandFeel, 5000);
        done();
    });

    describe('Page', function () {

        describe('Edit', function () {
            var pageContainer;
            beforeEach(function () {
                pageContainer = new PageContainerPage();
            });

            it('should show Page Editor after clicking on first page', function (done) {
                pageContainer.getPageByIndex(0).clickPageTitle().then(function () {
                    expect(pageContainer.getPageEditorByIndex(0).isDisplayedTitle()).toBe(true);
                    expect(pageContainer.getPageEditorByIndex(0).isDisplayedDescription()).toBeTruthy();
                    done();
                    pageContainer.getPageEditorByIndex(0).clickCancel();
                });
            });

            it('should show Page Editor after clicking on Edit icon on first page', function (done) {
                pageContainer.getPageByIndex(0).clickPageEditIcon().then(function () {
                    expect(pageContainer.getPageEditorByIndex(0).isDisplayedTitle()).toBeTruthy();
                    expect(pageContainer.getPageEditorByIndex(0).isDisplayedDescription()).toBeTruthy();

                    pageContainer.getPageEditorByIndex(0).clickCancel();
                    done();
                });
            });

            it('should change page title correctly', function (done) {
                pageContainer.getPageByIndex(0).getTitleText().then(function (originalTitle) {
                    pageContainer.getPageByIndex(0).clickPageTitle().then(function () {
                        pageContainer.getPageEditorByIndex(0).setTitle(originalTitle + '-test').then(function () {
                            pageContainer.getPageEditorByIndex(0).clickDone();
                            browser.driver.wait(function () {
                                return pageContainer.getPageByIndex(0).getTitleText().then(function (newTitle) {
                                    return originalTitle != newTitle;
                                });
                            }, 5000);
                            pageContainer.getPageByIndex(0).getTitleText().then(function (newTitle) {
                                expect(originalTitle).not.toEqual(newTitle);
                                expect(newTitle).toContain('-test');
                                done();
                            });
                        });
                    });
                });
            });

            it('should change page description correctly', function (done) {
                pageContainer.getPageByIndex(0).getDescriptionText().then(function (originalDescription) {
                    pageContainer.getPageByIndex(0).clickPageTitle().then(function () {
                        pageContainer.getPageEditorByIndex(0).setDescription(originalDescription + '-test').then(function () {
                            pageContainer.getPageEditorByIndex(0).clickDone();
                            browser.driver.wait(function () {
                                return pageContainer.getPageByIndex(0).getDescriptionText().then(function (newDescription) {
                                    return originalDescription != newDescription;
                                });
                            }, 10000);
                            pageContainer.getPageByIndex(0).getDescriptionText().then(function (newDescription) {
                                expect(originalDescription).not.toEqual(newDescription);
                                expect(newDescription).toContain('-test');
                                done();
                            });
                        });
                    });
                });
            });
        });

        describe('Add', function () {
            var pageContainer;
            beforeEach(function () {
                pageContainer = new PageContainerPage();
            });

            it('should add new page', function (done) {
                pageContainer.getPagesCount().then(function (firstCount) {
                    pageContainer.getPageByIndex(0).clickAddNewPage();
                    browser.driver.wait(function () {
                        return pageContainer.getPagesCount().then(function (secondCount) {
                            return firstCount != secondCount;
                        });
                    }, 5000);
                    pageContainer.getPagesCount().then(function (secondCount) {
                        expect(secondCount).toBeGreaterThan(firstCount);
                        done();
                    });
                });
            });
        });

        describe('Delete', function () {
            var pageContainer;
            beforeEach(function (done) {
                pageContainer = new PageContainerPage();

                pageContainer.getPageByIndex(0).getQuestionsCount().then(function (firstCount) {
                    if (!firstCount) {
                        pageContainer.getPageByIndex(0).clickAddTextQuestion();
                        pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setTitle('Short Text Question Type');
                        pageContainer.getPageByIndex(0).firstCreateQuestionDialog.setDescription('Short Text Question Type Sample');
                        pageContainer.getPageByIndex(0).firstCreateQuestionDialog.clickDone();
                        browser.driver.wait(function () {
                            return pageContainer.getPageByIndex(0).getQuestionsCount().then(function (secondCount) {
                                return firstCount != secondCount;
                            });
                        }, 5000);
                    };
                });
                done();
            });
            it('should not delete page when cancelling deleting page', function (done) {
                pageContainer.getPagesCount().then(function (firstCount) {
                    pageContainer.getPageByIndex(0).clickDeletePageIcon();
                    pageContainer.getPageByIndex(0).clickCancelConfirmation();
                    pageContainer.getPagesCount().then(function (secondCount) {
                        expect(firstCount).toEqual(secondCount);
                        done();
                    });
                });
            });

            it('should delete page when accepting deleting page', function (done) {
                pageContainer.getPagesCount().then(function (firstCount) {
                    pageContainer.getPageByIndex(0).clickDeletePageIcon();
                    pageContainer.getPageByIndex(0).clickDeleteConfirmation();
                    browser.driver.wait(function () {
                        return pageContainer.getPagesCount().then(function (secondCount) {
                            return firstCount != secondCount;
                        });
                    }, 5000);
                    pageContainer.getPagesCount().then(function (secondCount) {
                        expect(firstCount).toBeGreaterThan(secondCount);
                        done();
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