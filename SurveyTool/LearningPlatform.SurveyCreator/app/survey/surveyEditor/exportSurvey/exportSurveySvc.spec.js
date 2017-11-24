(function () {
    'use strict';
    describe('Testing exportSurveySvc service', function () {
        beforeEach(function () {
            module('svt');
        });

        describe('Testing buildFile function', function () {
            it('should call to saveAs', inject(function (exportSurveySvc) {
                var data = {};
                var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
                spyOn(window, 'saveAs').and.callFake(function () { });
                exportSurveySvc.buildFile(data);

                expect(saveAs).toHaveBeenCalledWith(blob, 'survey.json');
            }));
        });
    });
})();