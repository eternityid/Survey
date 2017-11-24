var CreateQuestionDialog = function (html) {
    var self = this,
        rootElement = html;

    self.setTitle = setTitle;
    self.setDescription = setDescription;
    self.clickDone = clickDone;
    self.clickAddSingleSelectionOption = clickAddSingleSelectionOption;
    self.clickAddMultipleSelectionOption = clickAddMultipleSelectionOption;
    self.clickAddSingleSelectionGridOption = clickAddSingleSelectionGridOption;
    self.clickAddSingleSelectionGridTopic = clickAddSingleSelectionGridTopic;
    self.clickAddMultipleSelectionGridOption = clickAddMultipleSelectionGridOption;
    self.clickAddMultipleSelectionGridTopic = clickAddMultipleSelectionGridTopic;
    self.clickAddScaleConditions = clickAddScaleConditions;
    self.clickAddNetPromoterConditions = clickAddNetPromoterConditions;

    function setTitle(value) {
        var control = rootElement.element(by.model('question.title.items[0].text'));
        control.click();
        browser.sleep(2000);
        control.click();
        control.sendKeys(value);
    }

    function setDescription(value) {
        rootElement.element(by.model('question.description.items[0].text')).sendKeys(value);
    }

    function clickDone() {
        var scrollToDoneButtonScript = 'document.getElementById("createquestion-editor-done-button").scrollIntoView();';
        browser.executeScript(scrollToDoneButtonScript).then(function () {
            return rootElement.element(by.id('createquestion-editor-done-button')).click();
        });
    }

    function clickAddSingleSelectionOption() {
        rootElement.element(by.tagName('selection-option-list')).element(by.css('button[ng-click="vm.addOption(vm.optionTypes.normalOption)"]')).click();
    }

    function clickAddMultipleSelectionOption() {
        rootElement.element(by.tagName('selection-option-list')).element(by.css('button[ng-click="vm.addOption(vm.optionTypes.normalOption)"]')).click();
    }

    function clickAddSingleSelectionGridOption() {
        element(by.id('option-list')).element(by.css('button[ng-click="vm.addOption(vm.optionTypes.normalOption)"]')).click();
    }

    function clickAddSingleSelectionGridTopic() {
        element(by.id('topic-list')).element(by.css('button[ng-click="vm.addOption(vm.optionTypes.normalOption)"]')).click();
    }

    function clickAddMultipleSelectionGridOption() {
        element(by.id('option-list')).element(by.css('button[ng-click="vm.addOption(vm.optionTypes.normalOption)"]')).click();
    }

    function clickAddMultipleSelectionGridTopic() {
        element(by.id('topic-list')).element(by.css('button[ng-click="vm.addOption(vm.optionTypes.normalOption)"]')).click();
    }

    function clickAddScaleConditions() {
        selectStartEndValue("-5", "14");
        selectPointLabels("left point", "middle point", "right point");

        function selectStartEndValue(start, end) {
            browser.driver.findElement(by.id('min-score')).clear();
            browser.driver.findElement(by.id('min-score')).sendKeys(start);

            browser.driver.findElement(by.id('max-score')).clear();
            browser.driver.findElement(by.id('max-score')).sendKeys(end);
            }

        function selectPointLabels(leftpoint, midpoint, rightpoint) {
            element(by.css('div[ng-model="vm.question.likertLeftText.items[0].text"]')).clear();
            element(by.css('div[ng-model="vm.question.likertLeftText.items[0].text"]')).sendKeys(leftpoint);
            element(by.css('div[ng-model="vm.question.likertCenterText.items[0].text"]')).clear();
            element(by.css('div[ng-model="vm.question.likertCenterText.items[0].text"]')).sendKeys(midpoint);
            element(by.css('div[ng-model="vm.question.likertRightText.items[0].text"]')).clear();
            element(by.css('div[ng-model="vm.question.likertRightText.items[0].text"]')).sendKeys(rightpoint);
        }


    }

    function clickAddNetPromoterConditions() {
        rootElement.element(by.id('likertLeftText')).clear();
        rootElement.element(by.id('likertLeftText')).sendKeys("Bad Idea");
        rootElement.element(by.id('likertRightText')).clear();
        rootElement.element(by.id('likertRightText')).sendKeys("Cool Idea");
    }


};

module.exports = CreateQuestionDialog;