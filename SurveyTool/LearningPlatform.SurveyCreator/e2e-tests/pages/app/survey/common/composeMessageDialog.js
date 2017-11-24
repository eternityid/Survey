var ComposeMessageDialog = function () {
    var self = this;


    self.hTitle = element(by.id('compose-message-title'));
    self.txtSubject = element(by.id('subject'));
    self.txtbxMessage = element(by.id('emailContent'));
    self.btnClose = element(by.id('close-compose-email'));
    self.btnDone = element(by.id('send-email'));


    self.getTitle = getTitle;
    self.setSubject = setSubject;
    self.setMessage = setMessage;
    self.clickCloseDialog = clickCloseDialog;
    self.clickDone = clickDone;
    self.isDisplayed = isDisplayed;
    init();

    function init() {
        browser.wait(function () {
            return browser.isElementPresent(by.id('compose-message-title'));
        }, 5000);
    }

    function getTitle() {
        return self.hTitle.getText();
    }

    function setSubject(value) {

        self.txtSubject.clear().then(function () {
            self.txtSubject.sendKeys(value).then(function () {
            });
        });

    }

    function setMessage(value) {
        self.txtbxMessage.clear().then(function () {
            self.txtbxMessage.sendKeys(value).then(function () {
            });
        });

    }

    function isDisplayed() {
        return self.hTitle.isPresent();
    }

    function clickCloseDialog() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(self.btnClose), 5000);

        self.btnClose.click();
        browser.wait(function () {
            return browser.isElementPresent(by.css('button.btn.btn-default[title="Cancel send"]')).then(function (presenceOfElement) { return !presenceOfElement }); // this modifies the previous line so that it evaluates to false until the element is no longer present.
        }, 15000);

    }

    function clickDone() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(self.btnDone), 5000);
        self.btnDone.click();
        browser.wait(function () {
            return browser.isElementPresent(by.css('button.btn.btn-primary[title="Send email"]')).then(function (presenceOfElement) { return !presenceOfElement }); // this modifies the previous line so that it evaluates to false until the element is no longer present.
        }, 30000);
    }

};

module.exports = ComposeMessageDialog;
