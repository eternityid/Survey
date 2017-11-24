describe('Survey Editor testing', function () {
    var SurveyEditorPage = requirePage('app/survey/surveyEditorPage');

    var surveyEditorPage;

    beforeEach(function (done) {
        surveyEditorPage = new SurveyEditorPage('#/surveys/7/designer');
        surveyEditorPage.goTo();
        done();
    });

    describe('Testing Edit Survey Form', function () {
        EditSurveyDialog = requirePage('app/survey/common/editSurveyDialog');

        var editSurveyDialog;

        xit('should show Edit Survey pushing down Form when clicking on survey title', function (done) {
            surveyEditorPage.clickSurveySettingButton();
            editSurveyDialog = new EditSurveyDialog();
            expect(editSurveyDialog.isDisplayedPEditSurvey()).toBeTruthy();
            expect(editSurveyDialog.getEditSurveyText()).toEqual('Survey Settings');
            done();
        });

        xit('should show survey title when closing Edit Survey Form', function (done) {
            surveyEditorPage.clickSurveySettingButton();
            editSurveyDialog = new EditSurveyDialog();
            editSurveyDialog.clickCloseDialog();
            expect(surveyEditorPage.isDisplayedSurveyTitle()).toBeTruthy();
            done();
        });

        it('should change survey title correctly', function (done) {
            surveyEditorPage.getSurveyTitleText().then(function (text) {
                var oldTitle = text.split(' ')[0];
                surveyEditorPage.clickSurveySettingButton();
                editSurveyDialog = new EditSurveyDialog();
                editSurveyDialog.appendTitle('-test').then(function () {
                    editSurveyDialog.clickDone();
                    browser.driver.wait(function () {
                        return surveyEditorPage.getSurveyTitleText().then(function (textAfter) {
                            return text != textAfter;
                        });
                    }, 5000);
                    surveyEditorPage.getSurveyTitleText().then(function (textAfter) {
                        expect(textAfter).toEqual(oldTitle.trim() + '-test OPEN');
                        done();
                    });
                });
            });
        });
    });

    xdescribe('Testing Page Container', function () {
        var PageContainerPage = requirePage('app/survey/pageContainerPage');
        var pageContainer;

        describe('Testing Page Editor', function () {
            beforeEach(function () {
                pageContainer = new PageContainerPage();
            });

            it('should show Page Editor after clicking on first page', function (done) {
                pageContainer.getPageByIndex(0).clickPageTitle().then(function () {
                    expect(pageContainer.getPageEditorByIndex(0).isDisplayedTitle()).toBe(true);
                    expect(pageContainer.getPageEditorByIndex(0).isDisplayedDescription()).toBeTruthy();
                    done();
                });
            });

            it('should show Page Editor after clicking on Edit icon on first page', function (done) {
                pageContainer.getPageByIndex(0).clickPageEditIcon().then(function () {
                    expect(pageContainer.getPageEditorByIndex(0).isDisplayedTitle()).toBeTruthy();
                    expect(pageContainer.getPageEditorByIndex(0).isDisplayedDescription()).toBeTruthy();
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
                            }, 5000);
                            pageContainer.getPageByIndex(0).getDescriptionText().then(function (newDescription) {
                                expect(originalDescription).not.toEqual(newDescription);
                                expect(newDescription).toContain('-test');
                                done();
                            });
                        });
                    });
                });
            });

            it('should add new page successfully', function (done) {
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
            describe('Testing Page Editor', function () {
                beforeEach(function (done) {
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


    });

    xdescribe('Testing Page Container', function () {
        var PageContainerPage = requirePage('app/survey/pageContainerPage');
        var pageContainer;

        describe('Testing Page Editor', function () {
            beforeEach(function () {
                pageContainer = new PageContainerPage();
            });
            it('should change page description correctly', function (done) {
                var elm = element(by.css('a.navbar-brand'));
                browser.driver.wait(function () {
                    return elm.isDisplayed();
                }, 5000);
                browser.actions().keyDown(protractor.Key.CONTROL).perform().then(function () {
                    elm.click().then(function () {
                        browser.actions().keyUp(protractor.Key.CONTROL).perform().then(function () {
                            browser.getAllWindowHandles().then(function (handles) {
                                newWindowHandle = handles[1];
                                newWindowHandle0 = handles[0];
                                browser.switchTo().window(newWindowHandle).then(function () {
                                    surveyEditorPage1 = new SurveyEditorPage('#/surveys/7/designer');
                                    surveyEditorPage1.goTo();
                                    pageContainer1 = new PageContainerPage();
                                    pageContainer1.getPageByIndex(0).clickPageTitle().then(function () {
                                        browser.switchTo().window(newWindowHandle0).then(function () {
                                            pageContainer.getPageByIndex(0).clickPageTitle().then(function () {
                                                pageContainer.getPageEditorByIndex(0).setDescription('ab-test21').then(function () {
                                                    pageContainer.getPageEditorByIndex(0).clickDone();
                                                });
                                            });
                                        });
                                        browser.switchTo().window(newWindowHandle).then(function () {
                                            pageContainer1.getPageEditorByIndex(0).setDescription('test21').then(function () {
                                                pageContainer1.getPageEditorByIndex(0).clickDone();
                                                browser.driver.wait(function () {
                                                    return element(by.css('div.toast-message')).isDisplayed();
                                                }, 5000);

                                                expect(element(by.css('div.toast-message')).getText()).toEqual('This page has changed. Please refresh to get the newest data');
                                                done();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});