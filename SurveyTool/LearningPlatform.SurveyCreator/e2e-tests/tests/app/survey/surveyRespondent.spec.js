describe('Respondents testing', function () {
    var RespondentsPage = requirePage('app/survey/RespondentsPage');

    var respondentsPage, originalTimeout;

    beforeAll(function (done) {
        respondentsPage = new RespondentsPage('#/surveys/00000000000000000000000a/responses');
        respondentsPage.goTo();
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        done();
    });

    describe('Testing Import Form', function () {
        ImportContactDialog = requirePage('app/survey/common/importContactDialog');
        var path = require('path');
        var importContactDialog;
        it('should show Import Form when clicking on Import button', function (done) {
            var fileToUpload = '../../../sample-files/cvs.csv',
                absolutePath = path.resolve(__dirname, fileToUpload);
            respondentsPage.clickImportIcon().then(function () {
                importContactDialog = new ImportContactDialog();
                importContactDialog.uploadFile(absolutePath).then(function () {
                    importContactDialog.clickImport().then(function () {
                        expect(respondentsPage.isDisplayedaEmailIcon()).toBeTruthy();
                        done();
                    });
                });
            });
        });
    });

    describe('Testing Compose Message Form', function () {
        ComposeMessageDialog = requirePage('app/survey/common/composeMessageDialog');

        var composeMessageDialog;

        it('should show Compose Message dialog when clicking on Email', function (done) {
            respondentsPage.clickEmailIcon().then(function () {
                composeMessageDialog = new ComposeMessageDialog();
                expect(composeMessageDialog.isDisplayed()).toBeTruthy();
                expect(composeMessageDialog.getTitle()).toEqual('Compose Message');
                composeMessageDialog.clickCloseDialog();
                done();
            });
        });

        it('should show the Respondent when closing Compose Dialog dialog', function (done) {
            respondentsPage.clickEmailIcon().then(function () {
                composeMessageDialog = new ComposeMessageDialog();
                composeMessageDialog.clickCloseDialog();
                expect(composeMessageDialog.isDisplayed()).not.toBeTruthy();
                done();
            });
        });

        it('should show the Respondent when closing Compose Dialog dialog', function (done) {
            respondentsPage.clickEmailIcon().then(function () {
                composeMessageDialog = new ComposeMessageDialog();
                composeMessageDialog.clickDone();
                expect(composeMessageDialog.isDisplayed()).not.toBeTruthy();
                done();
            });
        });
    });

    xdescribe('Testing Search Panel', function () {

        it('should show the return result when input valid data', function (done) {
            respondentsPage.clickExpandButton().then(function () {
                respondentsPage.setNumberSent('Greater Than', 0);
                respondentsPage.setLastDateSent('After', '06/01/2015');
                respondentsPage.setEmailSearchText('khai.dao');
                respondentsPage.clickSearchButton();
                expect(respondentsPage.getTableRow()).toBeGreaterThan(0);
                done();
            });
        });
    });

    afterAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});
