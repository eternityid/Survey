(function () {
    'use strict';
    describe('Testing generalSettingCtrl controller', function () {
        var ctrl,
            scope,
            modal, q,
            questionEditorSvc,
            questionCarryOverSvc,
            questionPreviewerSvc,
            questionAdvanceSettingSvc, questionConst, questionHistoryManagerSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q, $injector) {
                scope = $rootScope.$new();
                scope.pageId = 1;
                scope.questionType = 'dummy';
                scope.question = {
                    $type: ''
                };

                q = $q;

                questionEditorSvc = jasmine.createSpyObj('questionEditorSvc', [
                    'spinnerShow', 'spinnerHide',
                    'setSvtPlaceholderQuestionItems',
                    'getSvtPlaceholderQuestionItems',
                    'getValidationMessageWhenChangingQuestionType'
                ]);
                questionEditorSvc.getValidationMessageWhenChangingQuestionType.and.returnValue({
                    willBeAffectedOther : false
                });

                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', [
                    'getSelectionQuestionListForCarryOver',
                    'getAvailableCarryOverQuestions'
                ]);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', ['getUpdatingCommandTypes']);

                questionAdvanceSettingSvc = jasmine.createSpyObj('questionAdvanceSettingSvc', ['getDefaultAdvanceSettings']);
                questionAdvanceSettingSvc.getDefaultAdvanceSettings.and.returnValue({
                    name: 'a'
                });

                questionConst = $injector.get('questionConst');
                questionHistoryManagerSvc = jasmine.createSpyObj('questionHistoryManagerSvc', ['updateQuestionHistory', 'setupQuestionAfterChangingType']);

                ctrl = $controller('generalSettingCtrl', {
                    $scope: scope,
                    $modal: modal,
                    questionEditorSvc: questionEditorSvc,
                    questionCarryOverSvc: questionCarryOverSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    questionAdvanceSettingSvc: questionAdvanceSettingSvc,
                    questionConst: questionConst,
                    questionHistoryManagerSvc: questionHistoryManagerSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should initialize default properties by calling service successfully', function () {
                expect(questionPreviewerSvc.getUpdatingCommandTypes).toHaveBeenCalled();
            });
        });

        describe('Testing onQuestionTypeChange function', function () {
            it('should change question type', function () {
                questionHistoryManagerSvc.setupQuestionAfterChangingType.and.returnValue({});
                spyOn(angular, 'extend');

                ctrl.onQuestionTypeChange();

                expect(questionHistoryManagerSvc.updateQuestionHistory).toHaveBeenCalled();
                expect(questionHistoryManagerSvc.setupQuestionAfterChangingType).toHaveBeenCalled();
            });
        });
    });
})();