var BasePage = requirePage('common/basePage'),
    waitingUtil = new (requireUtil('waitingUtil.js'))();
var LaunchPage = function (url) {
    var self = this,
    CloseSurveyConfirmDialog = requirePage('app/survey/common/closeSurveyConfirmDialog');

    var closeSurveyConfirmDialog;
    self.url = url || '#/surveylaunch/:surveyId';
    self.radioInvitationOnlySurvey = element(by.id('invitation-only-survey'));
    self.chkInviteRespondents = element(by.id('invite-respondents'));
    self.txtSendEmail = element(by.model('$select.search'));
    self.txtSubject = element(by.model('vm.respondent.subject'));
    self.txtMessage = element(by.model('vm.respondent.body'));
    self.btnPublish = element(by.id('publish_button'));
    self.btnRePublish = element(by.id('republish_button'));
    self.btnClose = element(by.id('close_survey_button'));
    self.btnReopen = element(by.id('reopen_survey_button'));
    self.spanSurveyTitle = element(by.id('survey-info-status'));

    self.clickInvitationOnlySurvey = clickInvitationOnlySurvey;
    self.clickInviteRespondents = clickInviteRespondents;
    self.inputEmailSendTo = inputEmailSendTo;
    self.clickPublishButton = clickPublishButton;
    self.clickRePublishButton = clickRePublishButton;
    self.clickCloseSurveyButton = clickCloseSurveyButton;
    self.clickReOpenButton = clickReOpenButton;
    self.clickYesConfirmation = clickYesConfirmation;
    self.clickNoConfirmation = clickNoConfirmation;
    self.clickTempCloseCheckbox = clickTempCloseCheckbox;
    self.getSurveyTitleText = getSurveyTitleText;
    self.goTab = goTab;

    function clickInvitationOnlySurvey() {
        waitingUtil.waitForElementVisible(self.radioInvitationOnlySurvey, 5000);
        waitingUtil.waitForElementToBeClickable(self.radioInvitationOnlySurvey, 5000);
        return self.radioInvitationOnlySurvey.click();
    }

    function goTab() {
        browser.wait(function () {
            return browser.isElementPresent(by.css('div.toast-message')).then(function (presenceOfElement) { return !presenceOfElement });
        }, 10000);
        browser.driver.wait(function () {
            return element(by.css("li a[href='" + url + "']")).isDisplayed();
        }, 5000);
        element(by.css("li a[href='" + url + "']")).click();
    }

    function clickInviteRespondents() {
        waitingUtil.waitForElementToBeClickable(self.chkInviteRespondents, 5000);
        self.chkInviteRespondents.click();
    }

    function inputEmailSendTo(text) {
        waitingUtil.waitForElementVisible(self.txtSendEmail, 5000);
        self.txtSendEmail.clear();
        self.txtSendEmail.sendKeys(text);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();
    }

    function clickPublishButton() {
        self.btnPublish.isDisplayed().then(function (isVisible) {
            if (isVisible) {
                waitingUtil.waitForElementToBeClickable(self.btnPublish, 5000);
                self.btnPublish.click();
            }
        });        
    }

    function clickRePublishButton() {        
        self.btnRePublish.isDisplayed().then(function (isVisible) {
            if (!isVisible) return;
            self.btnRePublish.isEnabled().then(function (isEnable) {
                if (!isEnable) return;
                waitingUtil.waitForElementToBeClickable(self.btnRePublish, 5000);
                self.btnRePublish.click();
            });
        });       
    }

    function getSurveyTitleText() {
        waitingUtil.waitForElementVisible(self.spanSurveyTitle, 5000);
        return self.spanSurveyTitle.getText();
    }

    function clickCloseSurveyButton() {
        waitingUtil.waitForElementToBeClickable(self.btnClose, 5000);
        self.btnClose.click();
    }


    function clickReOpenButton() {
        self.btnReopen.isPresent().then(function (isVisible) {
            if (!isVisible) return;
            self.btnReopen.isEnabled().then(function (isEnable) {
                if (!isEnable) return;
                waitingUtil.waitForElementToBeClickable(self.btnReopen, 5000);
                self.btnReopen.click();
                waitingUtil.waitForElement(element(by.id('close_survey_button')), 5000);

            });
        });
    }

    function clickYesConfirmation() {
        closeSurveyConfirmDialog = new CloseSurveyConfirmDialog();
        closeSurveyConfirmDialog.clickYes();
        browser.driver.wait(function () {
            return self.btnReopen.isDisplayed();
        }, 5000);
    }

    function clickNoConfirmation() {
        closeSurveyConfirmDialog = new CloseSurveyConfirmDialog();
        closeSurveyConfirmDialog.clickNo();
    }

    function clickTempCloseCheckbox() {
        closeSurveyConfirmDialog = new CloseSurveyConfirmDialog();
        closeSurveyConfirmDialog.clickTempCloseCheckbox();
    }
};

LaunchPage.prototype = new BasePage();
LaunchPage.constructor = BasePage;

module.exports = LaunchPage;