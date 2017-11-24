describe('Survey Designer', function () {
    var SurveyEditorPage = requirePage('app/survey/surveyEditorPage'),
        SurveyListPage = requirePage('app/survey/surveyListPage'),
        surveyEditorPage,
        surveyListPage,
        surveyTitle = (new Date().toUTCString()) + " For Testing Survey Look And Feel",
        surveyListPage = new SurveyListPage(),
        surveyEditorPage = new SurveyEditorPage(),
        waitingUtil = new (requireUtil('waitingUtil.js'))();

    beforeAll(function (done) {
        surveyListPage.goTo();
        surveyListPage.createSurvey(surveyTitle);
        waitingUtil.waitForElementVisible(surveyEditorPage.btnLookandFeel, 5000);
        done();
    });

    describe('Look And Feel', function () {
        var LookAndFeelDialog = requirePage('app/survey/common/lookAndFeelDialog');
        var lookAndFeelDialog;

        it('should show Look And Feel push down when clicking on Look And Feel button', function (done) {
            surveyEditorPage.clickLookAndFeelSettingButton();
            lookAndFeelDialog = new LookAndFeelDialog();
            expect(lookAndFeelDialog.isLookAndFeelDisplayed()).toBeTruthy();
            expect(lookAndFeelDialog.getLookAndFeelText()).toEqual('Look And Feel Settings');
            done();
        });

       it('should hideLook And Feel pushdown when closing', function (done) {
            // Should check that push down is closed.
            lookAndFeelDialog.clickCloseDialog().then(function () {
                expect(lookAndFeelDialog.isLookAndFeelDisplayed()).toBeFalsy();
                done();
            });
        });

       it('should keep editted data on look and Feel form after editting', function (done) {
           var layoutName = 'Default Layout',
               themeName = 'Blue';
            surveyEditorPage.clickLookAndFeelSettingButton().then(function () {
                lookAndFeelDialog = new LookAndFeelDialog();
                lookAndFeelDialog.selectLayout(layoutName);
                lookAndFeelDialog.selectTheme(themeName);
                lookAndFeelDialog.clickDone();
                surveyEditorPage.clickLookAndFeelSettingButton();
                expect(lookAndFeelDialog.isLookAndFeelDisplayed()).toBeTruthy();
                expect(lookAndFeelDialog.getTextDefaultLayout()).toEqual(layoutName);
                expect(lookAndFeelDialog.getTextDefaultTheme()).toEqual(themeName);
                done();
            });
        });
    });

    afterAll(function (done) {
        surveyListPage.deleteFirstSurveyByTitle(surveyTitle);
        done();
    });
});