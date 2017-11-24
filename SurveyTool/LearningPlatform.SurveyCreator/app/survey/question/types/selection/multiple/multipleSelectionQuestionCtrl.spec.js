(function () {
    'use strict';

    describe('Testing multipleSelectionQuestionCtrl controller', function () {
        var ctrl, scope, questionSvc;
        var carriedOverQuestionName = 'dummy';

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                scope.question = {
                    optionList: {
                        options: [
                            {
                                optionsMask: { questionId: 1 }
                            }
                        ]
                    }
                };

                questionSvc = jasmine.createSpyObj('questionSvc', ['getQuestionTitle']);
                questionSvc.getQuestionTitle.and.returnValue(carriedOverQuestionName);

                ctrl = $controller('multipleSelectionQuestionCtrl', {
                    $scope: scope,
                    questionSvc: questionSvc
                });
            });
        });

        describe('Testing ctrl properties', function () {

            it('should check properties', function () {

                expect(ctrl.answers.length).toEqual(1);
                expect(ctrl.answers[0].isCarryOver).toEqual(true);
                expect(ctrl.answers[0].carryOverFromQuestionName).toEqual(carriedOverQuestionName);
            });
        });
    });
})();