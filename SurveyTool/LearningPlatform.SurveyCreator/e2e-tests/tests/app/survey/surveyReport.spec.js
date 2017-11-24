describe('Report testing', function () {
    var ReportPage = requirePage('app/survey/ReportPage');

    var reportPage;

    beforeAll(function (done) {
        reportPage = new ReportPage('#/reports/1/designer/00000000000000000000000a');
        reportPage.goTo();
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        done();
    });

    describe('Testing Edit Report Setting Form', function () {
        EditReportDialog = requirePage('app/survey/common/editReportDialog');
        var editReportDialog;
        beforeAll(function (done) {
            reportPage.clickReportSettingButton().then(function () {
                editReportDialog = new EditReportDialog();
                editReportDialog.setReportTitle('Report-Survey').then(function () {
                    editReportDialog.clickReportSaveButton();
                });
            });
            done();
        });

        it('should show Edit Report Setting Form when clicking on Report Setting button', function (done) {
            reportPage.clickReportSettingButton().then(function () {
                editReportDialog = new EditReportDialog();
                expect(editReportDialog.isDisplayedReportName()).toBeTruthy();
                expect(editReportDialog.getEditReportText()).toEqual('Report Settings');
                editReportDialog.clickReportCancelButton();
                done();
            });
        });

        it('should show Report title when open Report Setting Form', function (done) {
            reportPage.clickReportSettingButton().then(function () {
                editReportDialog = new EditReportDialog();
                editReportDialog.clickReportCancelButton();
                expect(editReportDialog.isDisplayedReportName()).toBeFalsy();
                done();
            });
        });

        it('should change report title correctly', function (done) {
            reportPage.getReportTitleText().then(function (text) {
                var oldTitle = text.split('(')[0];
                reportPage.clickReportSettingButton();
                editReportDialog = new EditReportDialog();
                editReportDialog.appendReportTitle('-test').then(function () {
                    editReportDialog.clickReportSaveButton();
                    browser.driver.wait(function () {
                        return reportPage.getReportTitleText().then(function (textAfter) {
                            return text != textAfter;
                        });
                    }, 5000);
                    reportPage.getReportTitleText().then(function (textAfter) {
                        var newTitle = textAfter.split('(')[0];
                        expect(newTitle).toEqual(oldTitle.trim() + '-test ');
                        done();
                    });
                });
            });
        });
    });

    describe('Testing Report Page Container', function () {
        describe('Testing Report Page Editor', function () {
            it('should add new report page successfully', function (done) {
                reportPage.getPagesCount(0).then(function (firstCount) {
                    reportPage.getReportPageByIndex(0).clickOnDropDownButtonAddPage();
                    reportPage.getPagesCount().then(function (secondCount) {
                        expect(secondCount).toBeGreaterThan(firstCount);
                        done();
                    });
                });
            });

            it('should add new report table element successfully', function (done) {
                reportPage.getReportPageByIndex(0).getElementCount().then(function (firstCount) {
                    reportPage.getReportPageByIndex(0).clickOnDropDownButtonTable();
                    reportPage.getReportPageByIndex(0).selectQuestionElement('On a scale from 0-10, how likely are you to recommend Orient Software to a friend or colleague?');
                    reportPage.getReportPageByIndex(0).clickSaveAddEditDialog();
                    browser.wait(function () {
                        return reportPage.getReportPageByIndex(0).getElementCount().then(function (secondCount) {
                            return firstCount != secondCount;
                        });
                    }, 5000);
                    reportPage.getReportPageByIndex(0).getElementCount().then(function (secondCount) {
                        expect(secondCount).toBeGreaterThan(firstCount);
                        done();
                    });
                });
            });

            it('should add new report chart element successfully', function (done) {
                reportPage.getReportPageByIndex(0).getElementCount().then(function (firstCount) {
                    reportPage.getReportPageByIndex(0).clickOnDropDownButtonChart();
                    reportPage.getReportPageByIndex(0).selectQuestionElement('abcde');
                    reportPage.getReportPageByIndex(0).selectChartType('Column');
                    reportPage.getReportPageByIndex(0).clickSaveAddEditDialog();
                    browser.wait(function () {
                        return reportPage.getReportPageByIndex(0).getElementCount().then(function (secondCount) {
                            return firstCount != secondCount;
                        });
                    }, 5000);
                    reportPage.getReportPageByIndex(0).getElementCount().then(function (secondCount) {
                        expect(secondCount).toBeGreaterThan(firstCount);
                        done();
                    });
                });
            });

            describe('Testing Report Page Container', function () {
                beforeEach(function (done) {
                    reportPage.getReportPageByIndex(0).getElementCount().then(function (firstCount) {
                        if (!firstCount) {
                            reportPage.getReportPageByIndex(0).clickOnDropDownButtonTable();
                            reportPage.getReportPageByIndex(0).selectQuestionElement('abcde');
                            reportPage.getReportPageByIndex(0).clickSaveAddEditDialog();
                            browser.wait(function () {
                                return reportPage.getReportPageByIndex(0).getElementCount().then(function (secondCount) {
                                    return firstCount != secondCount;
                                });
                            }, 5000);
                        };
                    });
                    done();
                });

                it('should not delete report page when cancelling deleting page', function (done) {
                    reportPage.getPagesCount(0).then(function (firstCount) {
                        reportPage.getReportPageByIndex(0).clickDeleteButton();
                        reportPage.getReportPageByIndex(0).clickCancelConfirmation();
                        reportPage.getPagesCount().then(function (secondCount) {
                            expect(firstCount).toEqual(secondCount);
                            done();
                        });
                    });
                });

                it('should delete report page when accepting deleting page', function (done) {
                    reportPage.getPagesCount().then(function (firstCount) {
                        reportPage.getReportPageByIndex(0).clickDeleteButton();
                        reportPage.getReportPageByIndex(0).clickDeleteConfirmation();
                        browser.wait(function () {
                            return reportPage.getPagesCount().then(function (secondCount) {
                                return firstCount != secondCount;
                            });
                        }, 5000);
                        reportPage.getPagesCount().then(function (secondCount) {
                            expect(firstCount).toBeGreaterThan(secondCount);
                            done();
                        });
                    });
                });
            });
        });
    });

    afterAll(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});