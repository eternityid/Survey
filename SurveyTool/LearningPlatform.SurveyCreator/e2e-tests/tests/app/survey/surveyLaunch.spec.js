describe('Launch testing', function () {
    var LaunchPage = requirePage('app/survey/LaunchPage');

    var launchPage;

    beforeAll(function (done) {
        launchPage = new LaunchPage('#/surveys/00000000000000000000000a/launch');
        launchPage.goTo();
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        done();
        launchPage.clickReOpenButton();
    });

    describe('Testing Survey Publishing', function () {
        var RespondentsPage = requirePage('app/survey/RespondentsPage');

        var respondentsPage;

        it('should publish successfully and respondent contact will be kept', function (done) {
            launchPage.clickInvitationOnlySurvey().then(function () {
                launchPage.clickInviteRespondents();
                launchPage.inputEmailSendTo("dummy@dummy.com");
                launchPage.clickRePublishButton();
                respondentsPage = new RespondentsPage('#/surveys/00000000000000000000000a/responses');
                respondentsPage.goTab();
                respondentsPage.clickExpandButton().then(function () {
                    respondentsPage.setEmailSearchText('dummy@dummy.com');
                    respondentsPage.clickSearchButton();

                    expect(respondentsPage.getTableRow()).toBeGreaterThan(0);
                    launchPage.goTab();
                    done();
                });
            });
        });
    });

    describe('Testing Survey Close and Re-Open status', function () {
        it('should show Close Survey Confirm Dialog and the status of survey no change', function (done) {
            launchPage.clickCloseSurveyButton();
            launchPage.clickNoConfirmation();

            launchPage.getSurveyTitleText().then(function (textAfter) {
                expect(textAfter.toLowerCase()).not.toContain('closed');
                done();
            });
        });

        it('should show Close Survey Confirm Dialog and change the status of survey to Closed', function (done) {
            launchPage.clickCloseSurveyButton();
            launchPage.clickYesConfirmation();

            browser.driver.wait(function () {
                return launchPage.getSurveyTitleText().then(function (textAfter) {
                    return textAfter.toLowerCase().indexOf('closed') > -1;
                });
            }, 5000);
            launchPage.getSurveyTitleText().then(function (textAfter) {
                expect(textAfter.toLowerCase()).toContain('closed');
                done();
            });
        });

        it('should show Close Survey button reappears', function (done) {
            launchPage.clickReOpenButton();
            launchPage.getSurveyTitleText().then(function (textAfter) {
                expect(textAfter.toLowerCase()).not.toContain('closed');
                done();
            });
        });

        it('should show Close Survey Confirm Dialog and change the status of survey to Temporarily Closed', function (done) {
            launchPage.clickCloseSurveyButton();
            launchPage.clickTempCloseCheckbox();
            launchPage.clickYesConfirmation();
            browser.driver.wait(function () {
                return launchPage.getSurveyTitleText().then(function (textAfter) {
                    return textAfter.toLowerCase().indexOf('temporarily closed') > -1;
                });
            }, 10000);
            launchPage.getSurveyTitleText().then(function (textAfter) {
                expect(textAfter.toLowerCase()).toContain('temporarily closed');
                done();
            });
        });
    });

    afterAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
