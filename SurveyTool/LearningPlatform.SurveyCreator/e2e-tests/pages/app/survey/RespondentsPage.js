var BasePage = requirePage('common/basePage'),
    waitingUtil = new (requireUtil('waitingUtil.js'))();
var RespondentsPage = function (url) {
    var self = this;

    self.url = url || '#/respondents/:surveyId';
    self.aEmailIcon = element(by.id('email-icon'));
    self.aImportIcon = element(by.id('import-icon'));
    self.spanExpandButton = element(by.id('expand-icon'));
    self.cboResponseStatus = element(by.id('response-status'));
    self.cboNumberSent = element(by.id('number-sent-dropdown'));
    self.cboLastDateSent = element(by.id('last-sent-date-dropdown'));
    self.txtEmail = element(by.id('response-email'));
    self.btSearchButton = element(by.id('respondent-search-btn'));

    self.clickEmailIcon = clickEmailIcon;
    self.clickImportIcon = clickImportIcon;
    self.isDisplayedaEmailIcon = isDisplayedaEmailIcon;
    self.clickExpandButton = clickExpandButton;
    self.setLastDateSent = setLastDateSent;
    self.setNumberSent = setNumberSent;
    self.setEmailSearchText = setEmailSearchText;
    self.clickSearchButton = clickSearchButton;
    self.getTableRow = getTableRow;
    self.goTab = goTab;

    function goTab() {
        browser.wait(function () {
            return browser.isElementPresent(by.css('div.toast-message')).then(function (presenceOfElement) { return !presenceOfElement });
        }, 15000);
        browser.driver.wait(function () {
            return element(by.css("li a[href='" + url + "']")).isDisplayed();
        }, 5000);
        element(by.css("li a[href='" + url + "']")).click();
    }

    function clickEmailIcon() {
        waitingUtil.waitForElementToBeClickable(self.aEmailIcon, 5000);
        return self.aEmailIcon.click();
    }

    function clickImportIcon() {
        waitingUtil.waitForElementToBeClickable(self.aImportIcon, 5000);
        return self.aImportIcon.click();
    }

    function isDisplayedaEmailIcon() {
        return self.aEmailIcon.isDisplayed();
    }

    function clickExpandButton() {
        waitingUtil.waitForElementVisible(self.spanExpandButton, 5000);
        if (self.spanExpandButton.isDisplayed()) {
            return self.spanExpandButton.click();
        }
    }

    function setRespondentStatus(optionText) {
        browser.driver.wait(function () {
            return self.cboResponseStatus.element(by.cssContainingText('option', optionText)).isDisplayed();
        }, 5000);
        self.cboResponseStatus.element(by.cssContainingText('option', optionText)).click();

    }

    function setNumberSent(optionText, number) {
        browser.driver.wait(function () {
            return element(by.cssContainingText('option', optionText)).isPresent();
        }, 5000);
        self.cboNumberSent.element(by.cssContainingText('option', optionText)).click();
        element(by.id('number-sent-dropdown-from')).sendKeys(number);
    }

    function setLastDateSent(optionText, datetime) {
        browser.driver.wait(function () {
            return self.cboLastDateSent.element(by.cssContainingText('option', optionText)).isDisplayed();
        }, 5000);
        self.cboLastDateSent.element(by.cssContainingText('option', optionText)).click();
        element(by.id('respondent-last-sent-from-date-text')).sendKeys(datetime);
        self.txtEmail.click();
        browser.wait(function () {
            return browser.isElementPresent(by.css('th.datepicker-switch')).then(function (presenceOfElement) { return !presenceOfElement });
        }, 5000);
    }

    function setEmailSearchText(email) {
        waitingUtil.waitForElementVisible(self.txtEmail, 5000);
        self.txtEmail.click().then(function () {
            self.txtEmail.sendKeys(email);
        });
    }

    function clickSearchButton() {
        self.btSearchButton.click();
    }

    function getTableRow() {
        return element.all(by.repeater('respondent in vm.respondents')).count();
    }
};

RespondentsPage.prototype = new BasePage();
RespondentsPage.constructor = BasePage;

module.exports = RespondentsPage;