var EditReportDialog = function () {
    var self = this;

    self.rootElement = element(by.css('div.svt-push-down'));
    self.reportName = self.rootElement.element(by.id('report-editor-title'));
    self.txtTitle = self.rootElement.element(by.id('reportName'));
    self.btnClose = self.rootElement.element(by.id('report-setting-cancel'));
    self.btnDone = self.rootElement.element(by.id('report-setting-save'));

    self.isDisplayedReportName = isDisplayedReportName;
    self.getEditReportText = getEditReportText;
    self.appendReportTitle = appendReportTitle;
    self.setReportTitle = setReportTitle;
    self.clickReportCancelButton = clickReportCancelButton;
    self.clickReportSaveButton = clickReportSaveButton;

    init();

    function init() {
        browser.wait(function () {
            return browser.isElementPresent(by.id('report-editor-title'));
        }, 5000);
    }

    function isDisplayedReportName() {
        return self.reportName.isPresent();
    }

    function getEditReportText() {
        return self.reportName.getText();
    }

    function appendReportTitle(value) {
        return self.txtTitle.sendKeys(value);
    }

    function setReportTitle(value) {
        var deferred = protractor.promise.defer();
        self.txtTitle.clear().then(function () {
            self.txtTitle.sendKeys(value).then(function () {
                deferred.fulfill();
            });
        });
        return deferred.promise;
    }

    function clickReportCancelButton() {
        self.btnClose.click();
    }

    function clickReportSaveButton() {
        self.btnDone.click();
        browser.wait(function () {
            return browser.isElementPresent(by.id('report-setting-save'))
                   .then(function (presenceOfElement) { return !presenceOfElement });
        }, 5000);
    }

};

module.exports = EditReportDialog;
