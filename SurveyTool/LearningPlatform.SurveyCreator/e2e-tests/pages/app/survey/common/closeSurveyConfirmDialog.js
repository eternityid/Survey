var CloseSurveyConfirmDialog = function() {
    var self = this,
        parentElement = element(by.css('div.modal div.modal-dialog div.modal-content'));

    self.clickNo = clickNo;
    self.clickYes = clickYes;
    self.clickTempCloseCheckbox = clickTempCloseCheckbox;
    function clickNo() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(parentElement.element(by.id('cancel-close-survey'))), 10000);
        parentElement.element(by.id('cancel-close-survey')).click();
        browser.wait(function () {
            return browser.isElementPresent(by.id('cancel-close-survey'))
                   .then(function (presenceOfElement) { return !presenceOfElement });
        }, 5000);
    }

    function clickYes() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(parentElement.element(by.id('close-survey-confirm'))), 10000);
        parentElement.element(by.id('close-survey-confirm')).click();
        browser.wait(function () {
            return browser.isElementPresent(by.id('close-survey-confirm'))
                   .then(function (presenceOfElement) { return !presenceOfElement });
        }, 5000);
    }

    function clickTempCloseCheckbox() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(parentElement.element(by.id('close-temporarily-survey'))), 10000);
        parentElement.element(by.id('close-temporarily-survey')).click();
    }
};

module.exports = CloseSurveyConfirmDialog;