var EditQuestionDialog = function (html) {
    var self = this;

    self.rootElement = html;
    self.setTitle = setTitle;
    self.setDescription = setDescription;
    self.clickDone = clickDone;

    var title = element(by.name('editorQuestionTitle')),
        description = element(by.name('editorQuestionDescription'));

    function setTitle(value) {
        return setControlText(title, value);
    }

    function setDescription(value) {
        return setControlText(description, value);
    }

    function setCarryOverByOptionIndex(optionindex, item, question) {
        var optionelement = element.all(by.repeater("answer in listCtrl.options")).get(optionindex)
        optionelement.element(by.css('button.svt-dropdown-option-mask-display__button')).click();
        optionelement.element(by.cssContainingText('option', item)).click();
        optionelement.element(by.css('button.setCarryOverByOptionIndex')).click();
        optionelement.element(by.cssContainingText('option', question)).click();
    }

    function setControlText(control, value) {
        var deferred = protractor.promise.defer();
        control.click();
        browser.sleep(2000);
        control.clear().then(function () {
            control.getText().then(function (txt) {
                if (txt) {
                    browser.sleep(2000);
                    control.clear().then(function () {
                        control.sendKeys(value).then(function () {
                            deferred.fulfill();
                        });
                    });
                } else {
                    control.sendKeys(value).then(function () {
                        deferred.fulfill();
                    });
                }
            });
        });
        return deferred.promise;
    }

    function clickDone() {
        self.rootElement.element(by.id('editquestion-editor-done-button')).click();
    }
};

module.exports = EditQuestionDialog;