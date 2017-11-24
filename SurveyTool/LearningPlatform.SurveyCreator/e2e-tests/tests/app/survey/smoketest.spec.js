describe('Smoke Test', function () {
    describe('Survey List', function () {
        var SurveyListPage = requirePage('app/survey/surveyListPage'),
            DashboardPage = requirePage('app/survey/dashboardPage');

        var surveyListPage,
            dashboardPage;

        beforeAll(function (done) {
            surveyListPage = new SurveyListPage();
            surveyListPage.goTo();
            done();
        });

        it('should show survey list after renderring page by default', function (done) {
            expect(surveyListPage.getAllRecordsOnPage1().count()).toBeGreaterThan(0);
            done();
        });
        afterAll(function () {
            browser.restart();
        });
    });

    describe('Survey Designer', function () {
        var SurveyEditorPage = requirePage('app/survey/surveyEditorPage');
        var PageContainerPage = requirePage('app/survey/pageContainerPage');

        var pageContainer, surveyEditorPage;
        beforeAll(function (done) {
            pageContainer = new PageContainerPage();
            surveyEditorPage = new SurveyEditorPage('#/surveys/7/designer');
            surveyEditorPage.goTo();
            done();
        });

        it('should show Page Editor after clicking on first page', function (done) {
            pageContainer.getPageByIndex(0).clickPageTitle().then(function () {
                expect(pageContainer.getPageEditorByIndex(0).isDisplayedTitle()).toBe(true);
                expect(pageContainer.getPageEditorByIndex(0).isDisplayedDescription()).toBeTruthy();
                done();
            });
        });
        afterAll(function () {
            browser.restart();
        });
    });

    describe('Survey Execution', function () {
        var SurveyExecutionPage = requirePage('app/survey/SurveyExecutionPage');
        var surveyExecutionPage;

        beforeAll(function (done) {
            surveyExecutionPage = new SurveyExecutionPage('survey/6');
            surveyExecutionPage.goTo();
            done();
        });

        it('should show the returned result when input valid data to Single Selection Grid Question', function (done) {
            surveyExecutionPage.goToQuestionByIndex  (1);
            surveyExecutionPage.selectSingleSelectionGridAnswer(3, 0, 0, 2).then(function (data) {
                var expectedresult = { OptionName: 'Mustang', Position: '4', Status: 'true' };
                expect(data).toEqual(expectedresult);
                done();
            });
        });
    });
});
