(function () {
    'use strict';
    describe('Testing testSurveyCtrl controller', function () {
        var ctrl, routeParams, sce, testHost;

        beforeEach(function () {
            module('svt');
            inject(function ($injector, $controller) {
                routeParams = $injector.get('$routeParams');
                routeParams.id = 1;

                sce = $injector.get('$sce');
                testHost = $injector.get('testHost');

                ctrl = $controller('testSurveyCtrl', {
                    $routeParams: routeParams,
                    $sce: sce,
                    $testHost: testHost
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                ctrl.init();

                expect(ctrl.surveyId).toBeDefined();
                expect(ctrl.url).toBeDefined();
            });
        });

    });
})();