(function () {
    'use strict';
    describe('Testing exportResponsesSvc service', function () {
        beforeEach(function () {
            module('svt');
        });

        describe('Testing buildFile function', function () {
            it('should call to saveAs', inject(function (exportResponsesSvc) {
                var data = {},
                    exportResponsesSeparator = 0,
                    surveyName = 'dummy';
                var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
                spyOn(window, 'saveAs').and.callFake(function () { });

                exportResponsesSvc.buildFile(data, exportResponsesSeparator, surveyName);

                expect(saveAs).toHaveBeenCalledWith(blob, 'dummy_responses.csv');
            }));
        });
    });
})();