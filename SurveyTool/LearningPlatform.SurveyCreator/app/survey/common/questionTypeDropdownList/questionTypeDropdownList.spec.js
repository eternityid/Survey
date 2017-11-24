(function () {
    describe('Testing questionTypeDropdownListCtrl controller', function () {
        var ctrl,
            $scope,
            $timeout,
            stringUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector) {
                $scope = $rootScope.$new();
                $scope.items = [];

                $timeout = $injector.get('$timeout');
                stringUtilSvc = $injector.get('stringUtilSvc');

                ctrl = $controller('questionTypeDropdownListCtrl', {
                    $scope: $scope,
                    $timeout: $timeout,
                    stringUtilSvc: stringUtilSvc
                });
            });
        });

        describe('Testing onItemChanged function', function () {
            var item = 'OpenEndedLongTextQuestionDefinition';

            it('should change scope selected item', function () {
                $scope.onItemChanged = jasmine.createSpy();
                $scope.ngModal = 'NetPromoterScoreQuestionDefinition';

                ctrl.onItemChanged(item);

                expect($scope.ngModal).toEqual('OpenEndedLongTextQuestionDefinition');
                $timeout.flush();
                expect($scope.onItemChanged).toHaveBeenCalled();
            });
        });

        describe('Testing getQuestionTypeText function', function () {
            var questionItem = {
                text: 'Long Text',
                value: 'OpenEndedLongTextQuestionDefinition'
            };

            it('should return question type text', function () {

                result = ctrl.getQuestionTypeText(questionItem.value);

                expect(result).toEqual(questionItem.text);
            });
        });
    });
})();