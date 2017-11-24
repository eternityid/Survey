var waitingUtil = new (requireUtil('waitingUtil.js'))();
var QuestionDisplay = function (html) {
    var self = this;

    self.rootElement = html;

    self.getTitleText = getTitleText;
    self.getDescriptionText = getDescriptionText;
    self.clickToEdit = clickToEdit;

    function getTitleText() {
        return self.rootElement.element(by.id('question-title')).getText();
    }

    function getDescriptionText() {
        return self.rootElement.element(by.css('p.description-question')).getText();
    }

    function clickToEdit() {
        self.rootElement.element(by.css('div[ng-click="pageCtrl.selectQuestionByStep(question)"]')).click() ;
        return self.rootElement.element(by.css('div[ng-click="pageCtrl.selectQuestionByStep(question)"]')).click();
    }
};

var SurveyPage = function (html) {
    var self = this,
        CreateQuestionDialog = requirePage('app/survey/question/createQuestionDialog'),
        EditQuestionDialog = requirePage('app/survey/question/editQuestionDialog'),
        DeleteDialog = requirePage('app/survey/common/deleteDialog');

    var deleteDialog;
    self.rootElement = html;
    self.firstCreateQuestionDialog = new CreateQuestionDialog(self.rootElement.element(by.tagName('create-question')));
    self.firstQuestionDisplay = new QuestionDisplay(self.rootElement.all(by.css('div.survey-question')).first());
    self.firstEditQuestionDialog = new EditQuestionDialog(self.rootElement.all(by.tagName('edit-question')).first());
    self.editQuestionDialog = new EditQuestionDialog(self.rootElement.all(by.tagName('edit-question')));

    self.clickAddTextQuestion = clickAddTextQuestion;
    self.clickAddSingleSelectionQuestion = clickAddSingleSelectionQuestion;
    self.clickAddMultipleSelectionQuestion = clickAddMultipleSelectionQuestion;
    self.clickAddSingleSelectioGridQuestion = clickAddSingleSelectioGridQuestion;
    self.clickAddMultipleSelectionGridQuestion = clickAddMultipleSelectionGridQuestion;
    self.clickAddInformationQuestion = clickAddInformationQuestion;
    self.clickAddNumericQuestion = clickAddNumericQuestion;
    self.clickAddScaleQuestion = clickAddScaleQuestion;
    self.clickAddNetPromoterScoreQuestion = clickAddNetPromoterScoreQuestion;
    self.clickAddNewPage = clickAddNewPage;
    self.clickPageTitle = clickPageTitle;
    self.clickPageEditIcon = clickPageEditIcon;
    self.getQuestionsCount = getQuestionsCount;
    self.openEditQuestionDialogByIndex = openEditQuestionDialogByIndex;
    self.getTitleText = getTitleText;
    self.getDescriptionText = getDescriptionText;

    self.clickDeletePageIcon = clickDeletePageIcon;
    self.clickCancelConfirmation = clickCancelConfirmation;
    self.clickDeleteConfirmation = clickDeleteConfirmation;

    function getTitleText() {
        return self.rootElement.all(by.css('div.pageHeader h2')).first().getText();
    }

    function getDescriptionText() {
        return self.rootElement.all(by.css('div.pageHeader h2')).get(1).getText();
    };

    function clickDeletePageIcon() {
        var control = self.rootElement.element(by.css('div.page-operations span.glyphicon.icon--delete'));
        return browser.isElementPresent(control).then(function (presenceOfElement) {
            if (presenceOfElement) {
                self.rootElement.element(by.css('div.page-operations span.glyphicon.icon--delete')).click();
            } else {
                self.rootElement.element(by.css('div.pageHeader')).click();
                waitingUtil.waitForElementVisible(self.rootElement.element(by.css('div.page-operations span.glyphicon.icon--delete')), 5000);
                var EB = protractor.ExpectedConditions;
                browser.wait(EB.stalenessOf($('.toast.toast-success')), 20000);
                self.rootElement.element(by.css('div.page-operations span.glyphicon.icon--delete')).click();
            }
        });
    };

    function clickCancelConfirmation() {
        deleteDialog = new DeleteDialog();
        deleteDialog.clickCancel();
    }

    function clickDeleteConfirmation() {
        deleteDialog = new DeleteDialog();
        return deleteDialog.clickDelete();
    }

    function openEditQuestionDialogByIndex(questionindex) {
        self.rootElement.all(by.repeater("question in pageCtrl.questionsInPage[pageCtrl.currentPage.Id].data")).get(questionindex).click();
    }

    function clickAddTextQuestion() {
        return selectQuestionTypeByText('Short Text');
    }

    function selectQuestionTypeByText(typeText) {
        //self.rootElement.element(by.css("div[id^='addBtn-forPage'] button.dropdown-toggle")).click();
        self.rootElement.element(by.css("#add-button-for-page-block button.dropdown-toggle")).click();
        browser.driver.wait(function () {
            return self.rootElement.all(by.cssContainingText("#add-button-for-page-block .dropdown-menu li a", typeText)).first().isDisplayed();
        }, 1000);
        self.rootElement.all(by.cssContainingText("#add-button-for-page-block .dropdown-menu li a", typeText)).first().click();
    }

    function clickPageTitle() {
        var control = self.rootElement.element(by.css('div.pageHeader.highlight-selection__page-info'));
        self.rootElement.element(by.css('div.pageHeader')).click();
        return browser.isElementPresent(control).then(function (presenceOfElement) {
            if (presenceOfElement) {
                self.rootElement.element(by.css('div.pageHeader')).click();
            }
        });
    }

    function clickPageEditIcon() {
        var control = self.rootElement.element(by.css('div.page-operations span.glyphicon.icon--edit'));
        return browser.isElementPresent(control).then(function (presenceOfElement) {
            if (presenceOfElement) {
                self.rootElement.element(by.css('div.page-operations span.glyphicon.icon--edit')).click();
            } else {
                self.rootElement.element(by.css('div.pageHeader')).click();
                browser.driver.wait(function () {
                    return self.rootElement.element(by.css('div.page-operations span.glyphicon.icon--edit')).isDisplayed();
                }, 100);
                self.rootElement.element(by.css('div.page-operations span.glyphicon.icon--edit')).click();
            }
        });
    };

    function clickAddSingleSelectionQuestion() {
        selectQuestionTypeByText('Single Selection');
    }

    function clickAddMultipleSelectionQuestion() {
        selectQuestionTypeByText('Multiple Selection');
    }

    function clickAddSingleSelectioGridQuestion() {
        selectQuestionTypeByText('Single Selection Grid');
    }

    function clickAddMultipleSelectionGridQuestion() {
        selectQuestionTypeByText('Multiple Selection Grid');
    }

    function clickAddInformationQuestion() {
        selectQuestionTypeByText('Information');
    }

    function clickAddNumericQuestion() {
        selectQuestionTypeByText('Numeric');
    }

    function clickAddScaleQuestion() {
        selectQuestionTypeByText('Scale');
    }

    function clickAddNetPromoterScoreQuestion() {
        selectQuestionTypeByText('Net Promoter Score');
    }

    function clickAddNewPage() {
        self.rootElement.element(by.id('add-new-page-link')).click();
    }

    function getQuestionsCount() {
        return self.rootElement.all(by.repeater("question in pageCtrl.questionsInPage")).count();
    }

};


var PageEditor = function (html) {
    var self = this;

    self.rootElement = html;

    self.setTitle = setTitle;
    self.getTitleText = getTitleText;
    self.isDisplayedTitle = isDisplayedTitle;
    self.setDescription = setDescription;
    self.getDescriptionText = getDescriptionText;
    self.isDisplayedDescription = isDisplayedDescription;
    self.clickDone = clickDone;
    self.clickCancel = clickCancel;

    var title = self.rootElement.element(by.id('page-name-text')),
        description = self.rootElement.element(by.id('page-description-text'));

    function setTitle(value) {
        var deferred = protractor.promise.defer();
        title.click();
        browser.sleep(2000);
        title.clear().then(function () {
            title.getText().then(function (txt) {
                if (txt) {
                    browser.sleep(2000);
                    title.clear().then(function () {
                        title.sendKeys(value).then(function () {
                            deferred.fulfill();
                        });
                    });
                } else {
                    title.sendKeys(value).then(function () {
                        deferred.fulfill();
                    });
                }
            });
        });

        return deferred.promise;
    }

    function getTitleText() {
        return title.getText();
    }

    function isDisplayedTitle() {
        return title.isDisplayed();
    }

    function setDescription(value) {
        var deferred = protractor.promise.defer();
        description.click();
        description.clear().then(function () {
            description.getText().then(function (txt) {
                if (txt) {
                    browser.sleep(2000);
                    description.clear().then(function () {
                        description.sendKeys(value).then(function () {
                            deferred.fulfill();
                        });
                    });
                } else {
                    description.sendKeys(value).then(function () {
                        deferred.fulfill();
                    });
                }
            });
        });

        return deferred.promise;
    }

    function getDescriptionText() {
        return description.getText();
    }

    function isDisplayedDescription() {
        return description.isDisplayed();
    }

    function clickDone() {
        self.rootElement.element(by.id('page-editor-done')).click();
        browser.wait(protractor.ExpectedConditions.invisibilityOf(element(by.id('page-editor-done'))), 5000);
    }


    function clickCancel() {
        self.rootElement.element(by.id('page-editor-cancel')).click();
        browser.wait(protractor.ExpectedConditions.invisibilityOf(element(by.id('page-editor-cancel'))), 5000);
    }
};

var PageContainerPage = function () {
    var self = this;

    self.getPageByIndex = getPageByIndex;
    self.getPagesCount = getPagesCount;
    self.getPageEditorByIndex = getPageEditorByIndex;

    function getPageByIndex(pageindex) {
        browser.wait(function () {
            return browser.isElementPresent(by.repeater("page in vm.pages | getPageOnlyFilter"));
        }, 5000);

        return new SurveyPage(element.all(by.repeater("page in vm.pages | getPageOnlyFilter")).get(pageindex));
    }

    function getPageEditorByIndex(pageindex) {
        return new PageEditor(element.all(by.css('form.pageEditor')).get(pageindex));
    }

    function getPagesCount() {
        browser.wait(function () {
            return browser.isElementPresent(by.css('div.toast-message')).then(function (presenceOfElement) { return !presenceOfElement });
        }, 10000);
        return element.all(by.repeater("page in vm.pages | getPageOnlyFilter")).count();
    }

};

module.exports = PageContainerPage;
