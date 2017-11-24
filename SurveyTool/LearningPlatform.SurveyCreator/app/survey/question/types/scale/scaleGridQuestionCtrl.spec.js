(function () {
    'use strict';
    describe('Testing rating grid question controller', function () {
        var ctrl, scope;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                scope.question = {
                    optionList: {
                        options: [{
                            text: {
                                items: [{}]
                            }
                        },
                        {
                            optionsMask: { questionId: 1 }
                        }]
                    },
                    subQuestionDefinition: {
                        optionList: {
                            options: [
                                {
                                    optionsMask: { questionId: 1 }
                                },
                                {
                                    text: {
                                        items: [{}]
                                    }
                                }
                            ]
                        }
                    }
                };

                ctrl = $controller('scaleGridQuestionCtrl', {
                    $scope: scope
                });
                scope.$digest();
            });
        });

        describe('Testing init function', function () {
            it('should setup properties', function () {
                expect(ctrl.rowTitles).toBeDefined();
                expect(ctrl.rowTitles.length).toBeGreaterThan(0);
                expect(ctrl.columnTitles).toBeDefined();
                expect(ctrl.columnTitles.length).toBeGreaterThan(0);
            });
        });
    });
})();