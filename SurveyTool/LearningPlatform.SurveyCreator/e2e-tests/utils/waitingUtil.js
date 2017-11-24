var WaitingUtil = function () { },
    defaultTimeout = 5000,
    condition = protractor.ExpectedConditions;

WaitingUtil.prototype.waitForElement = function (selector, timeout) {
    timeout = timeout || defaultTimeout;
    browser.wait(condition.presenceOf(selector), timeout);
};

WaitingUtil.prototype.waitForElementVisible = function (selector, timeout) {
    timeout = timeout || defaultTimeout;
    browser.wait(condition.visibilityOf(selector), timeout);
};

WaitingUtil.prototype.waitForElementInVisible = function (selector, timeout) {
    timeout = timeout || defaultTimeout;
    browser.wait(condition.invisibilityOf(selector), timeout);
};

WaitingUtil.prototype.waitForElementToBeClickable = function (selector, timeout) {
    timeout = timeout || defaultTimeout;
    browser.wait(condition.elementToBeClickable(selector), timeout);
};

WaitingUtil.prototype.waitForElementDisappear = function (selector, timeout) {
    timeout = timeout || defaultTimeout;
    browser.wait(condition.not(condition.presenceOf(selector)), timeout);
};


module.exports = WaitingUtil;
