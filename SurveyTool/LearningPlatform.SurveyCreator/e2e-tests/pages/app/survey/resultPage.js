var BasePage = requirePage('common/basePage'),
    waitingUtil = new (requireUtil('waitingUtil.js'))();
var ElementEditor = function (html) {
    var self = this;

    self.rootElement = html;

    self.setChartTypeCombobox = setChartTypeCombobox;
    self.chartTypeCombobox = self.rootElement.element(by.id('settingQuestionContainer'));
    self.getChartTypeNumber = getChartTypeNumber;

    self.isActiveTableOnElement = self.rootElement.element(by.css('.dropdown-menu .active-check-box')).isPresent();
    self.isDeactiveTableOnElement = self.rootElement.element(by.css('.dropdown-menu .disactive-check-box')).isPresent();

    function setChartTypeCombobox(value) {
        waitingUtil.waitForElementVisible(self.chartTypeCombobox, 5000);
        self.chartTypeCombobox.click();
        browser.driver.wait(function () {
            return self.rootElement.element(by.cssContainingText('a', value)).isDisplayed();
        }, 500);
        self.rootElement.element(by.cssContainingText('a', value)).click();
    }

    function getChartTypeNumber() {
        return self.rootElement.element(by.css('div[config="vm.chart"]')).getAttribute('data-highcharts-chart');
    }
};

var ResultPage = function (url) {
    var self = this;

    self.url = url || '#/surveys/:surveyId/results';
    self.summaryReportName = element(by.id('result-summary'));

    self.toggleDatatableSetting = toggleDatatableSetting;
    self.getSummaryReportName = getSummaryReportName;
    self.getElementByIndex = getElementByIndex;

    function toggleDatatableSetting() {
        element(by.id('result-setting-button')).click();
        element(by.id('result-toggle-datatable-button')).click();
    }

    function getSummaryReportName() {
        return self.summaryReportName.getText();
    }

    function getElementByIndex(pageindex) {
        return new ElementEditor(element.all(by.repeater('response in vm.responsesReport')).get(pageindex));
    }
};

ResultPage.prototype = new BasePage();
ResultPage.constructor = BasePage;

module.exports = ResultPage;