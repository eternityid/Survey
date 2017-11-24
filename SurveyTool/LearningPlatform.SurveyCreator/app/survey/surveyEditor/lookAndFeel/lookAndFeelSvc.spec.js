(function () {
    describe('Testing lookAndFeelSvc service', function () {
        var svc;

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                svc = $injector.get('lookAndFeelSvc');
            });
        });
    });
})();