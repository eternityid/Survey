(function() {
    describe('Testing createUserSvc service', function () {
        beforeEach(function() {
            module('svt');
        });

        describe('Testing policyAccountChecking function', function () {
            var userRequest;
            it('should return true when password doesnt exist', inject(function (createUserSvc) {
                userRequest = { password: null };

                var result = createUserSvc.policyAccountChecking(userRequest);

                expect(result).toEqual(true);
            }));

            it('should return true when password have invalid length', inject(function (createUserSvc) {
                userRequest = { password: 'abc' };

                var result = createUserSvc.policyAccountChecking(userRequest);

                expect(result).toEqual(true);
            }));

            it('should return true when email address invalid', inject(function (createUserSvc) {
                spyOn(toastr, 'warning');
                userRequest = { password: '12345678', emailAddress: 'dummy' };

                var result = createUserSvc.policyAccountChecking(userRequest);

                expect(result).toEqual(true);
                expect(toastr.warning).toHaveBeenCalled();
            }));

            it('should return true when both email and password valid', inject(function (createUserSvc) {
                userRequest = { password: '12345678', emailAddress: 'dummy@yahoo.com' };

                var result = createUserSvc.policyAccountChecking(userRequest);

                expect(result).toEqual(false);
            }));
        });

        describe('Test emptyChecking function', function () {
            var items, messages, placeHolder;
            it('should return false when list of processing users is empty', inject(function (createUserSvc) {
                items = [];
                messages = [];
                placeHolder = [];

                var result = createUserSvc.emptyChecking(items, messages, placeHolder);

                expect(result).toEqual(false);
            }));

            it('should return false when list of processing users is valid', inject(function (createUserSvc) {
                items = ['dummy'];
                messages = [];
                placeHolder = [{}];

                var result = createUserSvc.emptyChecking(items, messages, placeHolder);

                expect(result).toEqual(false);
            }));


            it('should return true when list of processing users is invalid', inject(function (createUserSvc) {
                items = [''];
                messages = [];
                placeHolder = [{}];

                var result = createUserSvc.emptyChecking(items, messages, placeHolder);

                expect(result).toEqual(true);
            }));
        });
    });
})();