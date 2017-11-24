var EditSurveyDialog = function () {
    var self = this;

    self.rootElement = element(By.css('div.svt-push-down'));
    self.pEditSurvey = element(by.css('div.edit-survey-configurations'));

    self.txtTitle = element(by.model('vm.surveySettings.surveyTitle'));

    self.cboLayout = self.rootElement.element(by.id('select-layout-dropdown'));
    self.btnClose = self.rootElement.element(by.css('button.btn.svt-button--cancel'));
    self.btnDone = self.rootElement.element(by.css('button.btn.svt-button--done'));

    self.isPresentPEditSurvey = isPresentPEditSurvey;
    self.isDisplayedPEditSurvey = isDisplayedPEditSurvey;
    self.getEditSurveyText = getEditSurveyText;
    self.appendTitle = appendTitle;
    self.setTitle = setTitle;
    self.clickCloseDialog = clickCloseDialog;
    self.clickDone = clickDone;

    init();

    function init() {
        browser.driver.wait(function () {
            return self.txtTitle.isDisplayed();
        }, 5000);
    }

    function isDisplayedPEditSurvey() {
        return self.pEditSurvey.isDisplayed();
    }

    function isPresentPEditSurvey() {
        return self.pEditSurvey.isPresent();
    }

    function getEditSurveyText() {
        return self.pEditSurvey.getText();
    }

    function appendTitle(value) {
        return self.txtTitle.sendKeys(value);
    }

    function setTitle(value) {
        var deferred = protractor.promise.defer();
        self.txtTitle.clear().then(function () {
            self.txtTitle.sendKeys(value).then(function () {
                deferred.fulfill();
            });
        });
        return deferred.promise;
    }

    function clickCloseDialog() {
        self.btnClose.click();
    }

    function clickDone() {
        self.btnDone.click();
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.invisibilityOf($('.button.btn.svt-button--done')), 5000);
    }
};

module.exports = EditSurveyDialog;
