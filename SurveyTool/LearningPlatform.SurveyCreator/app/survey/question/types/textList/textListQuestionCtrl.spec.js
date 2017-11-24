(function () {
    describe('Testing textListQuestionCtrl controller', function () {
        var ctrl, scope, instanceController, questionSvc, questionConst;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.question = {
                    $type: 'LongTextListQuestionDefinition',
                    optionList: {
                        options: [
                            { optionsMask: { questionId: 10 }, text: { items: [{ text: '' }] } },
                            { optionsMask: {}, text: { items: [{ text: '' }] } }
                        ]
                    }
                };

                questionConst = $injector.get('questionConst');

                questionSvc = jasmine.createSpyObj('questionSvc', ['getQuestionTitle']);

                instanceController = function () {
                    ctrl = $controller('textListQuestionCtrl', {
                        $scope: scope,
                        questionSvc: questionSvc,
                        questionConst: questionConst
                    });
                    scope.$digest();
                };
            });
        });
        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                instanceController();
                expect(ctrl.isLongTextListQuestion).toBeDefined();
                expect(ctrl.topics).toBeDefined();
            });
        });
    });
})();