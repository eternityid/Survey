describe('Survey Execution', function () {
    var SurveyExecutionPage = requirePage('app/survey/surveyExecutionPage');
    var surveyExecution;

    beforeEach(function (done) {
        //This should not have server
        surveyExecution = new SurveyExecutionPage('survey/6');
        surveyExecution.goTo();
        done();
    });

    it('should show the returned result when input valid data to Single Selection Grid Question', function (done) {
        surveyExecution.goToQuestionByIndex(1).then(function () {
            surveyExecution.selectSingleSelectionGridAnswer(3, 0, 0, 2).then(function (data) {
                var expectedresult = { OptionName: 'Mustang', Position: '4', Status: 'true' };
                expect(data).toEqual(expectedresult);
                done();
            });
        });
    });

    it('should show the returned result when input valid data to Multiple Selection Question', function (done) {
        surveyExecution.goToQuestionByIndex(2).then(function () {
            surveyExecution.selectMultipleSelectionAnswer('', 3, 1, 1, 1).then(function (data) {
                var expectedresult = { OptionName: 'CPoche', Position: '3', Status: 'true' };
                expect(data).toEqual(expectedresult);
                done();
            });
        });
    });

    it('should show the returned result when input valid data to Short Text Question', function (done) {
        surveyExecution.goToQuestionByIndex(3).then(function () {
            surveyExecution.inputShortTextAnswer("dummy").then(function (data) {
                var expectedresult = 'dummy';
                expect(data).toEqual(expectedresult);
                done();
            });
        });
    });

    it('should show the return result when input valid data to Net Promotion Question', function (done) {
        surveyExecution.goToQuestionByIndex(6).then(function () {
            surveyExecution.selectNetPromoterCoreAnswer(null, 7, 2).then(function (data) {
                var expectedresult = { value: '6', position: 6 };
                expect(data).toEqual(expectedresult);
                done();
            });
        });

    });

    it('should show the return result when input valid data to Multiple Selection Grid', function (done) {
        surveyExecution.moveNextPage().then(function () {
            surveyExecution.goToQuestionByIndex(1).then(function () {

                surveyExecution.selectMultiSelectionGridAnswer(1, 0, 0, 2).then(function (data) {
                    var expectedresult = { OptionName: 'Boeing', Position: '2', Status: 'true' };
                    expect(data).toEqual(expectedresult);
                    done();
                });

                surveyExecution.selectMultiSelectionGridAnswer(0, 1, 2, 1).then(function (data) {
                    var expectedresult = { OptionName: 'Airbus', Position: '3', Status: 'true' };
                    expect(data).toEqual(expectedresult);
                    done();
                });
            });
        });
    });

    it('should show the return result when input valid data to Single Selection Question', function (done) {
        surveyExecution.goToQuestionByIndex(5).then(function () {
            surveyExecution.selectSingleSelectionAnswer('', 3, 1, 1, 1).then(function (data) {
                var expectedresult = { OptionName: 'CAudi', Position: '3', Status: true };
                expect(data).toEqual(expectedresult);
                done();
            });
        });
    });

    it('should show the return result when input valid data to Long Text Question', function (done) {
        surveyExecution.moveNextPage().then(function () {
            surveyExecution.goToQuestionByIndex(3).then(function () {

                surveyExecution.inputLongTextAnswer("dummy").then(function (data) {
                    var expectedresult = 'dummy';
                    expect(data).toEqual(expectedresult);
                    done();
                });
            });
        });
    });

    it('should show the return result when input valid data to Numeric Question', function (done) {
        surveyExecution.moveNextPage().then(function () {
            surveyExecution.goToQuestionByIndex(4).then(function () {
                surveyExecution.selectNumericAnswer(null, 3, 4).then(function (data) {
                    var expectedresult = '0';
                    expect(data).toEqual(expectedresult);
                    done();
                });
            });
        });
    });

    it('should show the return result when input valid data to Scale Question', function (done) {
        surveyExecution.moveNextPage().then(function () {
            surveyExecution.goToQuestionByIndex(5).then(function () {
                surveyExecution.selectScaleAnswer(null, 7, 2).then(function (data) {
                    var expectedresult = { value: '6', position: 6 };
                    expect(data).toEqual(expectedresult);
                    done();
                });
            });
        })

    });


});
