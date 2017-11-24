(function() {
    'use strict';
    describe('Testing importRespondentSvc function', function () {
        beforeEach(function() {
            module('svt');
        });

        describe('Testing validateRespondentFile function', function () {
            var file;
            it('should return false when respondent file invalid', inject(function(importRespondentSvc) {
                file = null;
                spyOn(toastr, 'warning');

                var result = importRespondentSvc.validateRespondentFile(file);

                expect(toastr.warning).toHaveBeenCalled();
                expect(result).toEqual(false);
            }));

            it('should return true when respondent file valid', inject(function (importRespondentSvc) {
                file = 'dummy';

                var result = importRespondentSvc.validateRespondentFile(file);

                expect(result).toEqual(true);
            }));
        });
    });
})();