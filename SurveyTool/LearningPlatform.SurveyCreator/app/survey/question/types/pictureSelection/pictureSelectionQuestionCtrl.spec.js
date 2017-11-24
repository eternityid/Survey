(function () {
    describe('Testing pictureSelectionQuestionCtrl controller', function () {
        var ctrl,
            $scope,
            $timeout,
            surveyEditorSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $injector) {
                $scope = $rootScope.$new();
                $scope.question = {
                    MaxPicturesInGrid: 6,
                    answers: [{}],
                    IsScalePictureToFitContainer: true,
                    optionList: { options: [{ pictureName: 'dummy.jpg' }] }
                };

                $timeout = $injector.get('$timeout');
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getPicturePath']);

                ctrl = $controller('pictureSelectionQuestionCtrl', {
                    $timeout: $timeout,
                    $scope: $scope,
                    surveyEditorSvc: surveyEditorSvc
                });
            });
        });

        describe('Testing default controller properties and actions', function () {
            it('should declare default properties and call services', function () {
                expect(ctrl.model).toBeDefined();
                expect(surveyEditorSvc.getPicturePath).toHaveBeenCalled();
            });
        });
    });
})();