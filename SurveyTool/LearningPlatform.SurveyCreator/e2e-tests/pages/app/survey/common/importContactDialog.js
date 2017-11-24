var ImportContactDialog = function () {
    var self = this;

    self.hTitle = element(by.id('import-contact-title'));
    self.btnClose = element(by.id('cancel-import-contact'));
    self.btnDone = element(by.id('import-contact'));


    self.getTitle = getTitle;
    self.clickCancelDialog = clickCancelDialog;
    self.clickImport = clickImport;
    self.isDisplayedPEditSurvey = isDisplayedPEditSurvey;
    self.uploadFile = uploadFile;
    init();

    function init() {
        browser.driver.wait(function () {
            return self.hTitle.isDisplayed();
        }, 5000);
    }

    function getTitle() {
        return self.hTitle.getText();
    }

    function isDisplayedPEditSurvey() {
        return self.hTitle.isDisplayed();
    }

    function clickCancelDialog() {
        self.btnClose.click();
    }

    function uploadFile(value) {
        var elm = $('input[type="file"]');
        return browser.executeScript('arguments[0].style = {};', elm.getWebElement()).then(function () {
            elm.sendKeys(value);
        });
    }

    function clickImport() {
        return self.btnDone.click();
    }

};

module.exports = ImportContactDialog;
