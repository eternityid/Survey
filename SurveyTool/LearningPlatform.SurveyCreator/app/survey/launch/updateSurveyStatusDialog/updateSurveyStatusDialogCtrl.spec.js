(function() {
    'use stric';
    describe('Testing updateSurveyStatusDialogCtrl controller', function () {
        var updateSurveyStatusDialogCtrl, scope, modalInstance, message, title, type;

        beforeEach(function() {
            module('svt');
            inject(function($rootScope, $controller) {
                scope = $rootScope.$new();
                modalInstance = jasmine.createSpyObj('modalInstance', ['close', 'dismiss']);
                message = 'dummy';

                updateSurveyStatusDialogCtrl = $controller('updateSurveyStatusDialogCtrl', {
                    $scope: scope,
                    $modalInstance: modalInstance,
                    message: message,
                    title: title,
                    type: type
                });
            });
        });

        describe('Testing close function', function() {
            it('should close the result', function() {
                scope.update(true);
                expect(modalInstance.close).toHaveBeenCalledWith({ status: true, isTemporarilyClosed: false });
            });
        });
    });
})();