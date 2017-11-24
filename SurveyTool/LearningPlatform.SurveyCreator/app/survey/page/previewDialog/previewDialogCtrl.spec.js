(function() {
    'use stric';
    describe('Testing previewDialogCtrl controller', function () {
        var previewDialogCtrl, scope, modalInstance, modalData, testHost, $sce;

        beforeEach(function() {
            module('svt');
            inject(function($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                $sce = $injector.get('$sce');
                testHost = $injector.get('testHost');
                modalInstance = jasmine.createSpyObj('modalInstance', ['dismiss']);
                modalData = {
                    selectSurveyId: 1,
                    pageId:1
                };

                previewDialogCtrl = $controller('previewDialogCtrl', {
                    $scope: scope,
                    $modalInstance: modalInstance,
                    modalData: modalData,
                    $sce: $sce,
                    testHost: testHost
                });
            });
        });

        describe('Testing cancel function', function() {
            it('should close the preview dialog', function() {
                scope.closeMe();

                expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
            });
        });
    });
})();