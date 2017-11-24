var BasePage = requirePage('common/basePage'),
    waitingUtil = new (requireUtil('waitingUtil.js'))();
var SurveyEditorPage = function (url) {
    var self = this;

    self.url = url || '#/editsurvey/:surveyId';
    self.spanSurveyTitle = element(by.css('div.survey-info__title'));
    self.btnSurveySettings = element(By.id('survey-setting-button'));
    self.btnLookandFeel = element(by.css('a[ng-click="vm.showLookAndFeelSetting()"]'));
    self.spanSurveyStatus = element(By.id('survey-info-status'));

    self.clickSurveySettingButton = clickSurveySettingButton;
    self.getSurveyTitleText = getSurveyTitleText;
    self.isDisplayedSurveyTitle = isDisplayedSurveyTitle;
    self.clickLookAndFeelSettingButton = clickLookAndFeelSettingButton;

    function clickLookAndFeelSettingButton() {
        waitingUtil.waitForElementInVisible(element(by.id('svtOverlay')), 5000);
        waitingUtil.waitForElementToBeClickable(self.btnLookandFeel, 5000);
        return self.btnLookandFeel.click();
    }


    function clickSurveySettingButton() {
        waitingUtil.waitForElementToBeClickable(self.btnSurveySettings, 5000);
        self.btnSurveySettings.click();
    }


    function getSurveyTitleText() {
        var deferred = protractor.promise.defer();
        browser.driver.wait(function () {
            return self.spanSurveyTitle.isDisplayed();
        }, 5000);

       self.spanSurveyTitle.getText().then(function (text) {
           self.spanSurveyStatus.getText().then(function (sttext) {
                var pos = text.lastIndexOf(sttext);
                deferred.fulfill(text.substr(0, pos - 1));
            });
       });

       return deferred.promise;
    }

    function isDisplayedSurveyTitle() {
        return self.spanSurveyTitle.isDisplayed();
    }

};

SurveyEditorPage.prototype = new BasePage();
SurveyEditorPage.constructor = BasePage;

module.exports = SurveyEditorPage;