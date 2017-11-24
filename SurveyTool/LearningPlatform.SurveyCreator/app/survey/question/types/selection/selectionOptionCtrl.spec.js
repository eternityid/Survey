(function() {
    describe('Testing selectionOptionCtrl controller', function () {
        var scope, ctrl, data, selectionOptionListSvc, selectionSvc, settingConst, carryOverQuestionConst, selectionGridQuestionSvc;

        beforeEach(function() {
            module('svt');

            data = {
                answers: [],
                activeOption: {
                    id: '',
                    settingId: ''
                }
            };

            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.carriedOverQuestions = {};

                selectionOptionListSvc = jasmine.createSpyObj('selectionOptionListSvc', [
                    'getData', 'getActiveOption']);
                selectionOptionListSvc.getData.and.returnValue(data);
                selectionSvc = jasmine.createSpyObj('selectionSvc', ['getOptions', 'getTopics', 'getSelectionTypes']);
                selectionSvc.getSelectionTypes.and.returnValue({});

                settingConst = $injector.get('settingConst');
                carryOverQuestionConst = jasmine.createSpyObj('carryOverQuestionConst', ['simpleSelectionQuestionOption', 'gridSelectionQuestionOption', 'gridSelectionQuestionTopic']);
                carryOverQuestionConst.gridSelectionQuestionTopic.and.returnValue({});
                selectionGridQuestionSvc = jasmine.createSpyObj('selectionGridQuestionSvc', ['getOptions', 'getTopics']);
                ctrl = $controller('selectionOptionCtrl', {
                    $scope: scope,
                    selectionOptionListSvc: selectionOptionListSvc,
                    selectionSvc: selectionSvc,
                    settingConst: settingConst,
                    carryOverQuestionConst: carryOverQuestionConst,
                    selectionGridQuestionSvc: selectionGridQuestionSvc
                });
            });
        });
    });
})();