(function () {
    'use strict';
    describe('Testing selectionGridQuestionCtrl controller', function () {
        var ctrl, scope, questionConst;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.question = {};

                questionConst = $injector.get('questionConst');
                ctrl = $controller('selectionGridQuestionCtrl', {
                    $scope: scope,
                    questionConst: questionConst
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.isSingleSelectionGridQuestion).toBeDefined();
            });
        });
    });
})();