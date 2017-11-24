(function() {
    'use strict';
    describe('Testing addRespondentSvc service', function () {
        beforeEach(function() {
            module('svt');
        });

        describe('Testing validateEmailAddresses function', function () {

            it('should return false with empty email addresses', inject(function(addRespondentSvc) {
                var emails = [];
                var result = addRespondentSvc.validateEmailAddresses(emails);

                expect(result).toEqual(false);
            }));

            it('should return false with invalid email address', inject(function (addRespondentSvc) {
                var emails = ['dummy'];
                var result = addRespondentSvc.validateEmailAddresses(emails);

                expect(result).toEqual(false);
            }));

            it('should return true with valid data', inject(function (addRespondentSvc) {
                var emails = ['abc@yahoo.com'];
                var result = addRespondentSvc.validateEmailAddresses(emails);

                expect(result).toEqual(true);
            }));
        });
    });
})();