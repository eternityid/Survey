(function() {
    describe('Testing testModeButtonCtrl controller', function () {
        var scope, testModeSvc, q, ctrl;

        beforeEach(function() {
            module('svt');
            inject(function ($controller, $rootScope, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.testModeSettings = {surveyId: 1};

                testModeSvc = jasmine.createSpyObj('testModeSvc', ['toggleTestMode']);

                ctrl = $controller('testModeButtonCtrl', {
                    $scope: scope,
                    testModeSvc: testModeSvc
                });
                scope.$digest();
            });
        });

        describe('Testing toggleTestMode function', function () {
            it('should change testMode status', function () {
                ctrl.toggleTestMode();
                scope.$digest();

                expect(testModeSvc.toggleTestMode).toHaveBeenCalled();
            });
        });

    });
})();