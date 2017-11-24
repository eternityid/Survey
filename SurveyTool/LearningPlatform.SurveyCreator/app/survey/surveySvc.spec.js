(function() {
    describe('Testing surveySvc service', function() {
        var svc;

        beforeEach(function() {
            module('svt');
            inject(function($injector) {
                svc = $injector.get('surveySvc');
            });
        });

        describe('Testing getStatusDisplay function', function() {
            it('should return survey status text by code', function() {
                var result = [];
                for (var code = 0; code <= 4; code ++) {
                    result.push(svc.getStatusDisplay(code));
                }

                expect(result.length).toEqual(5);
                expect(result[2]).toEqual('Temporarily closed');
            });
        });
    });
})();