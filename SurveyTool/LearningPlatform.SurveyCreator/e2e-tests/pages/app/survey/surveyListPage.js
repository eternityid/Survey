var BasePage = requirePage('common/basePage'),
    waitingUtil = new (requireUtil('waitingUtil.js'))();
var SurveyListPage = function (url) {
    var self = this;

    self.url = url || '#/surveys';
    self.txtSearchText = element(by.id('search-survey-input'));
    self.btnSearch = element(by.css('button[ng-click="vm.doQuickSearch()"]'));
    self.btnCreateSurvey = element(by.id('add-survey-button'));
    self.tblResult = element(by.css('table.table-striped'));
    self.dlgCreateSurvey = element(by.css('div.svt-push-down'));
    self.spanPagingShowCount = element(by.exactBinding('vm.surveys.data.length'));
    self.surveyFoundCount = element.all(by.exactBinding('vm.surveysFound')).first();
    self.btnLoadMore = element(by.css('a.svt-grid__load-more[ng-click="vm.loadMore()"]'));
    self.btnSurveyListAction = element(by.id('survey-list-action-btn'));
    self.btnDelete = element(by.id('delete-button'));
    self.btnConfirmDelete = element(by.id('confirm-delete-button'));

    self.getDialogCreateSurvey = getDialogCreateSurvey;
    self.getSurveyShowFoundCount = getSurveyShowFoundCount;
    self.inputSearchText = inputSearchText;
    self.applySearch = applySearch;
    self.clickCreateSurvey = clickCreateSurvey;
    self.getAllRecordsOnPage1 = getAllRecordsOnPage1;
    self.getRecordAt = getRecordAt;
    self.getHeaders = getHeaders;
    self.getCellValue = getCellValue;
    self.clickLink = clickLink;
    self.getHref = getHref;
    self.clickLoadMore = clickLoadMore;
    self.createSurvey = createSurvey;
    self.deleteSurvey = deleteSurvey;
    self.goToSurveyList = goToSurveyList;
    self.deleteFirstSurveyByTitle = deleteFirstSurveyByTitle;

    function getDialogCreateSurvey() {
        waitingUtil.waitForElementVisible(self.dlgCreateSurvey, 5000);
        return self.dlgCreateSurvey;
    }

    function getSurveyShowFoundCount() {
        var deferred = protractor.promise.defer();
        waitingUtil.waitForElementVisible(self.spanPagingShowCount, 5000);
        self.spanPagingShowCount.getText().then(function (text) {
            // Sample value for text: Displaying 10/15 survey(s).
            var showCountValue = text.split(' ')[1];
            var tempArr = showCountValue.split('/');
            deferred.fulfill({
                show: tempArr[0],
                found: tempArr[1]
            });
        });
        return deferred.promise;
    }

    function inputSearchText(text) {
        waitingUtil.waitForElement(self.txtSearchText, 5000);
        self.txtSearchText.sendKeys(text);
    }

    function applySearch() {
        self.btnSearch.click();
    }

    function clickCreateSurvey() {
        return self.btnCreateSurvey.click();
    }

    function getAllRecordsOnPage1() {
        waitingUtil.waitForElement(element(by.repeater('survey in vm.surveys.data')), 5000);
        return element.all(by.repeater('survey in vm.surveys.data'));
    }

    function getHeaders() {
        return self.tblResult.all(by.css('thead tr th')).map(function (th) {
            return th.getText();
        });
    }

    function getRecordAt(index) {
        return getAllRecordsOnPage1().get(index);
    }

    function getCellValue(rowIndex, title) {
        var deferred = protractor.promise.defer();
        getHeaders().then(function(headers) {
            getRecordAt(rowIndex).all(by.css('td')).get(getCellIndex(headers, title)).getText().then(function(text) {
                deferred.fulfill(text);
            });
        });
        return deferred.promise;
    }

    function getCellIndex(headers, title) {
        for (var i = 0; i < headers.length; i++) {
            if (headers[i] === title) {
                return i;
            }
        }
        return -1;
    }

    function clickLink(rowIndex, title) {
        var deferred = protractor.promise.defer();
        getHeaders().then(function (headers) {
            getRecordAt(rowIndex).all(by.css('td')).get(getCellIndex(headers, title)).element(by.css('a')).click().then(function() {
                deferred.fulfill();
            });
        });
        return deferred.promise;
    }

    function getHref(rowIndex, title) {
        var deferred = protractor.promise.defer();
        getHeaders().then(function (headers) {
            getRecordAt(rowIndex).all(by.css('td')).get(getCellIndex(headers, title)).element(by.css('a')).getAttribute('href').then(function(href) {
                deferred.fulfill(href);
            });
        });
        return deferred.promise;
    }

    function clickLoadMore() {
        return self.btnLoadMore.click();
    }

    function createSurvey(surveyTitle) {
        EditSurveyDialog = requirePage('app/survey/common/editSurveyDialog');
        var createSurveyDialog;
        this.clickCreateSurvey().then(function () {
            createSurveyDialog = new EditSurveyDialog();
            createSurveyDialog.setTitle(surveyTitle);
            createSurveyDialog.clickDone();
        });
    }

    function deleteSurvey() {
        this.btnSurveyListAction.click();
        this.btnDelete.click();
        this.btnConfirmDelete.click();
        waitingUtil.waitForElementDisappear(this.btnConfirmDelete, 5000);
    }

    function goToSurveyList() {
        browser.get(getBaseUrl() + this.url);
    }

    function deleteFirstSurveyByTitle(surveyTitle) {
        this.goToSurveyList();
        this.inputSearchText(surveyTitle);
        this.applySearch();
        this.deleteSurvey();
    }
};

SurveyListPage.prototype = new BasePage();
SurveyListPage.constructor = BasePage;

module.exports = SurveyListPage;
