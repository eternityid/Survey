var DeleteDialog = function() {
    var self = this,
        parentElement = element(by.css('div.modal div.modal-dialog div.modal-content'));

    self.clickCancel = clickCancel;
    self.clickDelete = clickDelete;

    function clickCancel() {
        parentElement.element(by.id('cancel-button')).click();
        browser.wait(function () {
            return browser.isElementPresent(by.id('cancel-button'))
                   .then(function (presenceOfElement) { return !presenceOfElement });
        }, 5000);
    }

    function clickDelete() {
        var deferred = protractor.promise.defer();
        browser.isElementPresent(by.id('confirm-delete-button')).then(function (presenceOfElement) {
            if (presenceOfElement) {
                parentElement.element(by.id('confirm-delete-button')).click();
                var EC = protractor.ExpectedConditions;
                browser.wait(EC.invisibilityOf($('#confirm-delete-button')), 5000);
                var EB = protractor.ExpectedConditions;
                browser.wait(EB.invisibilityOf($('#svtOverlay')), 20000);
            };
            deferred.fulfill();
         });

         return deferred.promise;
    }

};

module.exports = DeleteDialog;