(function () {
    'use strict';
    describe('Testing skipCommandCtrl controller', function () {
        var ctrl, scope, expressionBuilderSvc, skipCommandSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                scope.skipCommand = {};

                expressionBuilderSvc = jasmine.createSpyObj('expressionBuilderSvc', ['getQuestionById']);

                skipCommandSvc = jasmine.createSpyObj('skipCommandSvc', ['getDisplayedExpressionItems']);

                ctrl = $controller('skipCommandCtrl', {
                    $scope: scope,
                    expressionBuilderSvc: expressionBuilderSvc,
                    skipCommandSvc: skipCommandSvc
                });
                scope.$digest();
            });
        });

        describe('Testing init function', function() {
            it('should setup controller properties', function () {
                ctrl.init();

                expect(expressionBuilderSvc.getQuestionById).toHaveBeenCalled();
                expect(ctrl.skipQuestionTitle).toBeDefined();
            });
        });


    });
})();