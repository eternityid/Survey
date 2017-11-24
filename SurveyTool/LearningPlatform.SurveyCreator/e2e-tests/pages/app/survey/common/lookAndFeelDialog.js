var waitingUtil = new (requireUtil('waitingUtil.js'))();
var LookAndFeelDialog = function () {
    var self = this;

    self.rootElement = element(by.css('div.svt-push-down'));
    self.txtLookAndFeel = element(by.css('div.svt-push-down__form-heading'));
    self.cbxLayout = self.rootElement.element(by.id('lookandfeel-layout-dropdown'));
    self.cbxTheme = self.rootElement.element(by.id('lookandfeel-theme-dropdown'));
    self.ckbSaveNewTheme = self.rootElement.element(by.id('saveNewTheme'));
    self.txtNewThemeName = self.rootElement.element(by.id('newThemeName'));
    self.btnClose = self.rootElement.element(by.id('lookandfeel-cancel-btn'));
    self.btnDone = self.rootElement.element(by.id('lookandfeel-save-btn'));

    self.isLookAndFeelDisplayed = isLookAndFeelDisplayed;
    self.getLookAndFeelText = getLookAndFeelText;
    self.selectLayout = selectLayout;
    self.selectTheme = selectTheme;
    self.setNewThemeName = setNewThemeName;
    self.getTextDefaultLayout = getTextDefaultLayout;
    self.getTextDefaultTheme = getTextDefaultTheme;
    self.clickCloseDialog = clickCloseDialog;
    self.clickDone = clickDone;

    init();

    function init() {
        waitingUtil.waitForElement(element(by.css('div.svt-push-down__form-heading')), 5000);
    }

    function isLookAndFeelDisplayed() {
        return self.txtLookAndFeel.isPresent();
    }

    function selectLayout(value) {
        var EC = protractor.ExpectedConditions;
        waitingUtil.waitForElementToBeClickable(self.cbxLayout, 5000);
        self.cbxLayout.click();
        browser.wait(EC.elementToBeClickable(self.cbxLayout.element(by.cssContainingText('option', value))), 2000);
        self.cbxLayout.element(by.cssContainingText('option', value)).click();
        browser.sleep(3000);
    }
    function getLookAndFeelText() {
        return self.txtLookAndFeel.getText();
    }

    function selectTheme(value) {
        waitingUtil.waitForElementVisible(self.cbxTheme, 5000);
        self.cbxTheme.click();
        browser.driver.wait(function () {
            return self.cbxTheme.element(by.cssContainingText('option', value)).isDisplayed();
        }, 5000);
        self.cbxTheme.element(by.cssContainingText('option', value)).click();
    }

    function setNewThemeName(value) {
        var deferred = protractor.promise.defer();
        self.ckbSaveNewTheme.click().then(function () {
            self.txtNewThemeName.clear().then(function () {
                self.txtNewThemeName.sendKeys(value).then(function () {
                    deferred.fulfill();
                });
            });
        });
        return deferred.promise;
    }

    function clickCloseDialog() {
        waitingUtil.waitForElement(element(by.id('lookandfeel-cancel-btn')), 5000);
        return self.btnClose.click();
    }

    function getTextDefaultLayout() {
        return self.cbxLayout.$('option:checked').getText();
    }

    function getTextDefaultTheme() {
        return self.cbxTheme.$('option:checked').getText();
    }

    function clickDone() {
        browser.executeScript('window.scrollTo(629,734);');
        self.btnDone.click();
    }

};

module.exports = LookAndFeelDialog;
