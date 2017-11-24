describe('Survey List', function () {
    var SurveyListPage = requirePage('app/survey/surveyListPage'),
        DashboardPage = requirePage('app/survey/dashboardPage'),
        SurveyEditorPage = requirePage('app/survey/surveyEditorPage'),
        restartBrowserBetweenTests,
        surveyListPage,
        dashboardPage,
        newSurveyTitle = (new Date().toUTCString()) + " For Survey List";

    beforeAll(function (done) {
        restartBrowserBetweenTests = browser.getProcessedConfig().value_.restartBrowserBetweenTests;
        if (!restartBrowserBetweenTests) {
            surveyListPage = new SurveyListPage();
            surveyListPage.goTo();
            done();
        }
    });

    it('should show survey list after renderring page by default', function () {
        expect(surveyListPage.getAllRecordsOnPage1().count()).toBeGreaterThan(0);
    });

    it('should load more data when clicking on Load More button', function (done) {
        surveyListPage.getSurveyShowFoundCount().then(function (data) {
            if (data.show !== data.found) {
                surveyListPage.clickLoadMore().then(function () {
                    surveyListPage.getSurveyShowFoundCount().then(function (dataAfter) {
                        expect(data.show).not.toEqual(dataAfter.show);
                        done();
                    });
                });
            } else {
                done();
            }
        });
    });

    it('should show search result correctly', function (done) {
        var titleMock = 'survey';
        surveyListPage.inputSearchText(titleMock);
        surveyListPage.applySearch();
        surveyListPage.getCellValue(0, 'SURVEY TITLE').then(function (text) {
            expect(text.toLowerCase()).toContain(titleMock.toLowerCase());
            done();
        });
    });

    it('should show pushdown when creating new survey', function (done) {
        surveyListPage.clickCreateSurvey().then(function () {
            expect(surveyListPage.getDialogCreateSurvey().isDisplayed()).toBeTruthy();
            surveyListPage.clickCreateSurvey().then(function () {
                done();
            });
        });
    });

    describe('Create Survey Form', function () {
        EditSurveyDialog = requirePage('app/survey/common/editSurveyDialog'); // Same dialog for create/update survey

        var createSurveyDialog;

        it('should create survey successfully', function (done) {
            surveyEditorPage = new SurveyEditorPage();
            surveyListPage.clickCreateSurvey().then(function () {
                createSurveyDialog = new EditSurveyDialog();
                createSurveyDialog.setTitle(newSurveyTitle);
                createSurveyDialog.clickDone();
                var surveyTitle = browser.driver.findElement(by.id('survey-title')).getAttribute('innerText');
                surveyTitle.then(function (value) {
                    expect(value.indexOf('NEW')).toBeGreaterThan(0);
                    expect(surveyEditorPage.btnLookandFeel.isPresent()).toBeTruthy();
                    done();
                });
            });
        });
    });

    it('should show dashboard screen when clicking on survey item', function (done) {
        surveyListPage = new SurveyListPage();
        surveyListPage.goTo();
        surveyListPage.getHref(0, 'SURVEY TITLE').then(function (href) {
            surveyListPage.clickLink(0, 'SURVEY TITLE').then(function () {
                dashboardPage = new DashboardPage(href);
                expect(dashboardPage.at()).toBeTruthy();
                done();
            });
        });
    });

    afterAll(function (done) {
        surveyListPage.deleteFirstSurveyByTitle(newSurveyTitle);
        done();
    });
});
