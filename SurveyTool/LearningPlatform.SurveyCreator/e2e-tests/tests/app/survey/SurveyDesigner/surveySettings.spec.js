describe('Survey Designer', function () {
    var SurveyEditorPage = requirePage('app/survey/surveyEditorPage');
    var PageContainerPage = requirePage('app/survey/pageContainerPage'),
        SurveyListPage = requirePage('app/survey/surveyListPage'),
        surveyEditorPage,
        surveyListPage,
        surveyTitle = (new Date().toUTCString()) + " For Testing Survey Settings",
        surveyListPage = new SurveyListPage(),
        surveyEditorPage = new SurveyEditorPage(),
        waitingUtil = new (requireUtil('waitingUtil.js'))();

    beforeAll(function (done) {
        surveyListPage.goTo();
        surveyListPage.createSurvey(surveyTitle);
        waitingUtil.waitForElementVisible(surveyEditorPage.btnLookandFeel, 5000);
        done();
    });

    describe('Survey Settings', function () {
        EditSurveyDialog = requirePage('app/survey/common/editSurveyDialog');
        var editSurveyDialog;

        it('should show Survey Settings pushing down when clicking on survey settings button', function (done) {
            surveyEditorPage.clickSurveySettingButton();
            editSurveyDialog = new EditSurveyDialog();
            expect(editSurveyDialog.isPresentPEditSurvey()).toBeTruthy();
            editSurveyDialog.clickCloseDialog();
            done();
        });

        it('should hide push down when closing Survey Settings', function (done) {
            surveyEditorPage.clickSurveySettingButton();
            editSurveyDialog = new EditSurveyDialog();
            editSurveyDialog.clickCloseDialog();
            expect(surveyEditorPage.isDisplayedSurveyTitle()).toBeTruthy();
            expect(editSurveyDialog.isPresentPEditSurvey()).toBeFalsy();
            done();
        });

        it('should change survey title correctly', function (done) {
            surveyEditorPage.getSurveyTitleText().then(function (text) {
                surveyEditorPage.clickSurveySettingButton();
                editSurveyDialog = new EditSurveyDialog();
                newSurveyTitle = (new Date().toUTCString()) + " For Testing Survey Settings",
                editSurveyDialog.setTitle(newSurveyTitle).then(function () {
                    editSurveyDialog.clickDone();
                    browser.driver.wait(function () {
                        return surveyEditorPage.getSurveyTitleText().then(function (textAfter) {
                            return text != textAfter;
                            done();
                        });
                    }, 10000);

                    surveyEditorPage.getSurveyTitleText().then(function (textAfter) {
                        expect(text).not.toEqual(textAfter);
                        done();
                    });
                });
            });
        });
    });

    afterAll(function (done) {
        surveyListPage.deleteFirstSurveyByTitle(newSurveyTitle);
        done();
    });
});