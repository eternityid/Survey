(function () {
    'use strict';
    describe('Testing rating Question controller', function () {
        var ctrl, scope, ratingQuestionSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller) {
                scope = $rootScope.$new();
                scope.question = {
                    $type: ''
                };


                ratingQuestionSvc = jasmine.createSpyObj('ratingQuestionSvc', [ ]);

                ctrl = $controller('ratingEditorCtrl', {
                    $scope: scope,
                    ratingQuestionSvc: ratingQuestionSvc
                });
            });
        });
    });
})();