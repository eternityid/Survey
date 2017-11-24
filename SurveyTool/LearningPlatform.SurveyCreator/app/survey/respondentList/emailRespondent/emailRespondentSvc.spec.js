(function() {
    'use strict';
    describe('Testing emailRespondentSvc service', function () {
        var emailMessage, placeHolders;
        beforeEach(function() {
            module('svt');
        });

        describe('Testing validateEmail function', function () {
            beforeEach(function() {
                emailMessage = {};
                placeHolders = {
                    subject: {},
                    content: {}
                };
            });

            it('should validate email subject', inject(function(emailRespondentSvc) {
                emailMessage.subject = '';
                spyOn(toastr, 'warning');

                var result = emailRespondentSvc.validateEmail(emailMessage, placeHolders);
                expect(result).toBeFalsy();
            }));

            it('should validate email content', inject(function (emailRespondentSvc) {
                emailMessage.subject = 'dummy';
                emailMessage.content = '';
                spyOn(toastr, 'warning');

                var result = emailRespondentSvc.validateEmail(emailMessage, placeHolders);


                expect(result).toBeFalsy();
            }));
        });
    });
})();