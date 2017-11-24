(function() {
    'use strict';
    describe('Testing launchSvc service', function () {
        beforeEach(function() {
            module('svt');
        });

        describe('Testing validateEmail function', function () {
            var respondent = {},
                result,
                highlightEmailAddressesContainer = jasmine.createSpy('highlightEmailAddressesContainer');
            it('should return false with empty email addresses', inject(function(launchSvc) {
                respondent.emailTo = [];
                result = launchSvc.validateEmail(respondent, highlightEmailAddressesContainer);

                expect(result).toEqual(false);
            }));

            it('should return false with invalid email address', inject(function (launchSvc) {
                respondent.emailTo = ['dummy'];
                result = launchSvc.validateEmail(respondent, highlightEmailAddressesContainer);

                expect(result).toEqual(false);
            }));

            it('should return false with empty subject', inject(function (launchSvc) {
                respondent.emailTo = ['dummy@dummy.com'];
                respondent.subject = ' ';
                result = launchSvc.validateEmail(respondent, highlightEmailAddressesContainer);

                expect(result).toEqual(false);
            }));

            it('should return false with empty body', inject(function (launchSvc) {
                respondent.emailTo = ['dummy@dummy.com'];
                respondent.subject = 'dummy';
                respondent.body = ' ';
                result = launchSvc.validateEmail(respondent, highlightEmailAddressesContainer);

                expect(result).toEqual(false);
            }));

            it('should return true with valid data', inject(function (launchSvc) {
                respondent.emailTo = ['dummy@dummy.com'];
                respondent.subject = 'dummy';
                respondent.body = 'dummy';
                result = launchSvc.validateEmail(respondent, highlightEmailAddressesContainer);

                expect(result).toEqual(true);
            }));
        });
    });
})();