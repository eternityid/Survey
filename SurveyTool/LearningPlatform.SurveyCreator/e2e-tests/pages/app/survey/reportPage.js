var BasePage = requirePage('common/basePage'),
    waitingUtil = new (requireUtil('waitingUtil.js'))();
var ElementEditor = function (html) {
    var self = this;
    self.rootElement = html;
    self.editButton = self.rootElement.element(by.css('div.button-position-control-in-reportpage[ng-click="reportPageCtrl.onEditElement($event,reportQuestion)"]'));
    self.removeButton = self.rootElement.element(by.css('div.button-position-control-in-reportpage[ng-click="reportPageCtrl.onDeleteElement($event,reportQuestion)"]'));
    self.clickEditButton = clickEditButton;
    self.clickDeleteButton = clickDeleteButton;
    self.clickCancelConfirmation = clickCancelConfirmation;
    self.clickDeleteConfirmation = clickDeleteConfirmation;

    function clickEditButton() {
        self.editButton.click();
    }

    function clickDeleteButton() {
        self.removeButton.click();
    }

    function clickCancelConfirmation() {
        deleteDialog = new DeleteDialog();
        deleteDialog.clickCancel();
    }

    function clickDeleteConfirmation() {
        deleteDialog = new DeleteDialog();
        deleteDialog.clickDelete();
    }
    function setShowTable() {
        self.rootElement.element(by.css('button[title="Settings"]')).click();
        self.showTableItem.click();
    }

    function setHideTable() {
        self.rootElement.element(by.css('button[title="Settings"]')).click();
        self.hideTableItem.click();
    }

    function checkTableOnElement() {
        return tableOnElement.isDisplayed();
    }
};

var ElementPage = function (html) {
    var self = this,
        DeleteDialog = requirePage('app/survey/common/deleteDialog');
    AddEditElement = requirePage('app/survey/reportelement/editReportElement');
    var deleteDialog;

    self.rootElement = html;
    self.deletePageButton = self.rootElement.element(by.css('span.glyphicon.icon--delete'));
    self.clickDeleteButton = clickDeleteButton;
    self.addButton = self.rootElement.all(by.css('button.btn.btn-default.dropdown-toggle')).first();

    self.clickCancelConfirmation = clickCancelConfirmation;
    self.clickDeleteConfirmation = clickDeleteConfirmation;
    self.getElementByIndex = getElementByIndex;
    self.getElementCount = getElementCount;
    self.clickOnDropDownButtonAddPage = clickOnDropDownButtonAddPage;
    self.clickOnDropDownButtonTable = clickOnDropDownButtonTable;
    self.clickOnDropDownButtonChart = clickOnDropDownButtonChart;
    self.selectQuestionElement = selectQuestionElement;
    self.selectChartType = selectChartType;
    self.clickCancelAddEditDialog = clickCancelAddEditDialog;
    self.clickSaveAddEditDialog = clickSaveAddEditDialog;

    function getElementCount() {
        browser.wait(function () {
            return browser.isElementPresent(by.css('div.toast-message')).then(function (presenceOfElement) { return !presenceOfElement });
        }, 10000);
        return element.all(by.repeater('reportQuestion in reportPageCtrl.currentPage.reportElementDefinitions')).count();
    }
    function getElementByIndex(elementIndex) {
        return new ElementEditor(element.all(by.repeater('reportQuestion in reportPageCtrl.pageObj.reportElementDefinitions')).get(elementIndex));
    }

    function clickOnDropDownButtonTable() {
        self.addButton.click();
        self.rootElement.all(by.css('a[data-ng-click="reportPageCtrl.onAddTable()"]')).first().click();
        browser.wait(protractor.ExpectedConditions.invisibilityOf(element.all(by.css('a[data-ng-click="reportPageCtrl.onAddTable()"]')).first()), 2000);
    }

    function clickOnDropDownButtonChart() {
        self.addButton.click();
        self.rootElement.all(by.css('a[data-ng-click="reportPageCtrl.onAddChart()"]')).first().click();
        browser.wait(protractor.ExpectedConditions.invisibilityOf(element.all(by.css('a[data-ng-click="reportPageCtrl.onAddChart()"]')).first()), 2000);
    }

    function clickOnDropDownButtonAddPage() {
        self.addButton.click();
        self.rootElement.all(by.css('a[data-ng-click="reportPageCtrl.onAddPage()"]')).first().click();
        browser.wait(protractor.ExpectedConditions.invisibilityOf(element.all(by.css('a[data-ng-click="reportPageCtrl.onAddPage()"]')).first()), 2000);
    }


    function clickDeleteButton() {
        browser.actions().mouseMove(self.rootElement.element(by.css('div.page-content'))).perform();
        waitingUtil.waitForElement(element(by.css('span.glyphicon.icon--delete')), 2000);
        self.rootElement.element(by.css('span.glyphicon.icon--delete')).click();
        waitingUtil.waitForElement(element(by.id('delete-confirmation-title')), 2000);
    }

    function selectQuestionElement(questionTitle) {
        addEditElement = new AddEditElement();
        addEditElement.selectQuestion(questionTitle);
    }

    function selectChartType(ChartType) {
        addEditElement = new AddEditElement();
        addEditElement.selectChartType(ChartType);
    }

    function clickCancelAddEditDialog() {
        addEditElement = new AddEditElement();
        addEditElement.clickCancel();
    }

    function clickSaveAddEditDialog() {
        addEditElement = new AddEditElement();
        addEditElement.clickSave();
    }

    function clickCancelConfirmation() {
        deleteDialog = new DeleteDialog();
        deleteDialog.clickCancel();
    }

    function clickDeleteConfirmation() {
        deleteDialog = new DeleteDialog();
        deleteDialog.clickDelete();
    }
};

var ReportPage = function (url) {
    var self = this;
    self.url = url || '#/reports/:surveyId/designer';
    self.reportSettingsButton = element(by.id('survey-setting-button'));
    self.spanSurveyTitle = element(by.css('div.report-title__text'));
    self.clickReportSettingButton = clickReportSettingButton;
    self.getReportPageByIndex = getReportPageByIndex;
    self.getReportTitleText = getReportTitleText;
    self.getPagesCount = getPagesCount;

    function getReportTitleText() {
        waitingUtil.waitForElementVisible(self.spanSurveyTitle, 5000);
        return self.spanSurveyTitle.getText();
    }

    function getPagesCount() {
        return element.all(by.repeater('page in vm.pages.data')).count();
    }

    function clickReportSettingButton() {
        waitingUtil.waitForElementToBeClickable(self.reportSettingsButton, 5000);
        return self.reportSettingsButton.click();
    }

    function getReportPageByIndex(pageindex) {
        return new ElementPage(element.all(by.repeater('page in vm.pages.data')).get(pageindex));
    }

};


ReportPage.prototype = new BasePage();
ReportPage.constructor = BasePage;

module.exports = ReportPage;