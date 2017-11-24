var EditElementDialog = function (html) {
    var self = this;

    self.rootElement = html;
    self.selectQuestion = selectQuestion;
    self.selectChartType = selectChartType;
    self.clickSave = clickSave;

    function selectQuestion(value) {
        browser.wait(function () {
            return browser.isElementPresent(by.model("editor.element.questionId"));
        }, 1000);
        element(by.model("editor.element.questionId")).click();
        browser.wait(function () {
            return browser.isElementPresent(by.cssContainingText('option', value));
        }, 5000);
        element(by.cssContainingText('option', value)).click();
    }

    function selectChartType(chartname) {
        browser.wait(function () {
            return browser.isElementPresent(by.model("editor.element.chartType"));
        }, 1000);
        element(by.model("editor.element.chartType")).click();
        browser.wait(function () {
            return browser.isElementPresent(by.cssContainingText('option', chartname));
        }, 1000);
        element(by.cssContainingText('option', chartname)).click()
    }

    function clickSave() {
        browser.wait(function () {
            return browser.isElementPresent(by.css('button[ng-click="save()"]'));
        }, 1000);
        element(by.css('button[ng-click="save()"]')).click();
    }

    function clickCancel() {
        browser.wait(function () {
            return browser.isElementPresent(by.css('button[ng-click="cancel()"]'));
        }, 1000);
        element(by.css('button[ng-click="cancel()"]')).click();
    }
};

module.exports = EditElementDialog;