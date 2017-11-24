var BasePage = function (url) {
    this.url = url;
};

function login() {
    browser.driver.getCurrentUrl().then(function (currentUrl) {
        browser.driver.manage().window().maximize();
        if ((currentUrl === 'data:,') || (currentUrl.indexOf(getLoginUrl() + 'login?') === -1)) {
            browser.driver.get(getBaseUrl() + '#/login');
            browser.waitForAngular();
            browser.wait(function () {
                return browser.isElementPresent(by.id('username'));
            }, 15000);

            element(by.id('username')).clear().then(function () {
                element(by.id('username')).sendKeys("Admin").then(function () {
                });
            });

            element(by.id('password')).clear().then(function () {
                element(by.id('password')).sendKeys("123456").then(function () {
                });
            });

            element(by.id('login-button')).click();

            browser.wait(function () {
                return browser.isElementPresent(element(by.id('login-button')))
                       .then(function (presenceOfElement) { return !presenceOfElement });
            }, 10000);

            browser.driver.wait(function () {
                return browser.driver.getCurrentUrl().then(function (currentUrl) { return currentUrl.indexOf(getBaseUrl() + '#/surveys') > -1 });
            }, 10000);

            browser.wait(function () {
                return browser.isElementPresent(by.css('span[ng-show="vm.surveysFound > 0"]'));
            }, 15000);
        }
    });
};

BasePage.prototype.waitForElement = function (selector, waitFor) {
    browser.manage().timeouts().pageLoadTimeout(10000);
    waitFor = waitFor || 5000;
    browser.driver.manage().timeouts().implicitlyWait(waitFor);
    browser.driver.findElement(selector);
    browser.driver.manage().timeouts().implicitlyWait(0);
}

BasePage.prototype.goTo = function (url) {
    url = url || this.url;
    browser.driver.getCurrentUrl().then(function (currentUrl) {
        browser.driver.manage().window().maximize();
        if (currentUrl === 'data:,') {
            login();
        }
        browser.driver.get(getBaseUrl() + url);
    });
};

BasePage.prototype.goDirectToWithAbsoluteUrl = function (url) {
    url = url || this.url;
    browser.driver.get(url);
};

BasePage.prototype.at = function (url) {
    url = url || this.url;
    var deferred = protractor.promise.defer();
    var baseUrl = getBaseUrl();
    var fullUrl = url.indexOf(baseUrl) === -1 ? getBaseUrl() + url : url;
    browser.driver.getCurrentUrl().then(function (currentUrl) {
        deferred.fulfill(currentUrl === fullUrl);
    });
    return deferred.promise;
};

module.exports = BasePage;
