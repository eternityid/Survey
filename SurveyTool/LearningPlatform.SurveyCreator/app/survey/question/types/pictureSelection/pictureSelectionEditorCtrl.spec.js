(function () {
    describe('Testing pictureSelectionEditorCtrl controller', function () {
        var ctrl,
            $scope,
            arrayUtilSvc,
            guidUtilSvc,
            pictureOptionListSvc,
            questionPreviewerSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector) {
                $scope = $rootScope.$new();
                $scope.question = {
                    optionList: { options: [{}] },
                    advancedSettings: {}
                };

                arrayUtilSvc = $injector.get('arrayUtilSvc');
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);
                pictureOptionListSvc = jasmine.createSpyObj('pictureOptionListSvc', [
                    'buildDefaultOptions', 'validateOptions']);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', ['addReloadCommand']);

                ctrl = $controller('pictureSelectionEditorCtrl', {
                    $scope: $scope,
                    arrayUtilSvc: arrayUtilSvc,
                    guidUtilSvc: guidUtilSvc,
                    pictureOptionListSvc: pictureOptionListSvc,
                    questionPreviewerSvc: questionPreviewerSvc
                });
            });
        });

        describe('Testing default properties and actions', function () {
            it('should declare properties and call default services', function () {
                expect(ctrl.openningOption).toBeDefined();
                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalled();
            });
        });
    });
})();