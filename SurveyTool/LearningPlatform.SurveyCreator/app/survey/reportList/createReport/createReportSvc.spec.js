(function() {
    describe('Testing createReportSvc service', function() {
        beforeEach(function() {
            module('svt');
            module(function($provide) {
                var stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty']);
                stringUtilSvc.isEmpty.and.callFake(function(value) {
                    return value === '';
                });

                $provide.value('stringUtilSvc', stringUtilSvc);
            });
        });

        describe('Testing validate function', function () {
            var editor, placeHolder;
            beforeEach(function() {
                editor = { report: {} };
                placeHolder = {
                    reportName: {},
                    surveyId: {}
                };
            });

            it('should return false with empty report name and empty survey id', inject(function (createReportSvc) {
                editor.report.name = '';
                editor.report.surveyId = '';

                var result = createReportSvc.validate(editor, placeHolder);

                expect(result).toEqual(false);
                expect(placeHolder.reportName.valid).toEqual(false);
            }));

            it('should return true with valid report name and survey id', inject(function (createReportSvc) {
                editor.report.name = 'dummy';
                editor.report.surveyId = 'dummy';

                var result = createReportSvc.validate(editor, placeHolder);

                expect(result).toEqual(true);
                expect(placeHolder.reportName.valid).toEqual(true);
                expect(placeHolder.surveyId.valid).toEqual(true);
            }));
        });
    });
})();