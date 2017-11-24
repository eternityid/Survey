describe('Result testing', function () {
    var ResultPage = requirePage('app/survey/ResultPage');

    var resultPage;

    beforeAll(function (done) {
        resultPage = new ResultPage('#/surveys/00000000000000000000000a/results');
        resultPage.goTo();
        done();
    });

    describe('Testing Report Title', function () {
        it('should show number of respondents', function (done) {
            var actualresult = resultPage.getSummaryReportName();

            expect(actualresult).toEqual('Completed Responses 3');
            done();
        });
    });

    describe('Testing Chart Type display', function () {
        it('should show chart in Column Chart Type', function (done) {
            resultPage.getElementByIndex(0).setChartTypeCombobox('Column');
            resultPage.getElementByIndex(0).getChartTypeNumber().then(function (attr) {
                expect(attr).toBeGreaterThan(0);
                done();
            });
        });

        it('should show chart under Pie Chart Type', function (done) {
            resultPage.getElementByIndex(0).setChartTypeCombobox('Pie');
            resultPage.getElementByIndex(0).getChartTypeNumber().then(function (attr) {
                expect(attr).toBeGreaterThan(0);
                done();
            });
        });

        it('should show Chart Under Stacked Percentage Column', function (done) {
            resultPage.getElementByIndex(1).setChartTypeCombobox('Stacked Percentage Column');
            resultPage.getElementByIndex(1).getChartTypeNumber().then(function (chartTypeNumber) {
                expect(chartTypeNumber).toBeGreaterThan(0);
                done();
            });
        });
        it('should show Chart under Stacked Column Chart Type', function (done) {
            resultPage.getElementByIndex(1).setChartTypeCombobox('Stacked Column');
            resultPage.getElementByIndex(1).getChartTypeNumber().then(function (chartTypeNumber) {
                expect(chartTypeNumber).toBeGreaterThan(0);
                done();
            });
        });
        it('should show Chart under Stacked Bar Chart Type', function (done) {
            resultPage.getElementByIndex(1).setChartTypeCombobox('Stacked Bar');
            resultPage.getElementByIndex(1).getChartTypeNumber().then(function (chartTypeNumber) {
                expect(chartTypeNumber).toBeGreaterThan(0);
                done();
            });
        });
    });

    describe('Testing set Show/Hide Table', function () {
        it('should show table under Chart', function (done) {
            resultPage.toggleDatatableSetting();
            var isActive = resultPage.getElementByIndex(0).isActiveTableOnElement;
            expect(isActive).toEqual(true);
            done();
        });

        it('should hide Table under chart', function (done) {
            resultPage.toggleDatatableSetting();
            var isDeactive = resultPage.getElementByIndex(0).isDeactiveTableOnElement;
            expect(isDeactive).toEqual(true);
            done();
        });
    });

});
