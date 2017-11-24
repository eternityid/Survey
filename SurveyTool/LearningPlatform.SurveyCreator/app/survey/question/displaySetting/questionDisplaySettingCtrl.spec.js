(function () {

    describe('Testing questionDisplaySettingCtrl controller', function () {
        var scope, ctrl, questionConst, settingConst,
            surveyEditorPageSvc, modal, skipCommandSvc, stringUtilSvc,
            questionPreviewerSvc, questionDisplaySettingSvc, serverValidationSvc;

        var UPDATING_COMMAND_TYPES = {
            questionTitle: 'QuestionTitle',
            questionDescription: 'QuestionDescription',
            displaySettings: {
                required: 'DisplaySetting_Required'
            },
            longText: {
                advancedSettings: 'LongText_DisplaySettings'
            },
            pictureSelection: {
                isPictureShowLabel: 'PictureSelection_IsPictureShowLabel',
                content: 'PictureSelection_Content'
            }
        };
        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $injector) {
                scope = $rootScope.$new();
                scope.question = {
                    questionMaskExpression: {},
                    displaySettings: {},
                    validations: [],
                    optionsMask: {
                        questionId: 1
                    },
                    advancedSettings: {}
                };

                settingConst = $injector.get('settingConst');
                questionConst = $injector.get('questionConst');

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', ['getQuestionsBeforePageId']);
                surveyEditorPageSvc.getQuestionsBeforePageId.and.returnValue([]);

                skipCommandSvc = jasmine.createSpyObj('skipCommandSvc', ['getDisplayedExpressionItems']);

                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty', 'isNotEmpty']);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', [
                    'addOrUpdateUpdatingCommand',
                    'addReloadCommand',
                    'getUpdatingCommandTypes'
                ]);
                questionPreviewerSvc.getUpdatingCommandTypes.and.returnValue(UPDATING_COMMAND_TYPES);

                questionDisplaySettingSvc = jasmine.createSpyObj('questionDisplaySettingSvc', [
                    'getDisplayOrientations',
                    'fillMissedValidations'
                ]);
                questionDisplaySettingSvc.fillMissedValidations.and.returnValue([]);

                serverValidationSvc = jasmine.createSpyObj('serverValidationSvc', ['getServerValidationTypes']);

                ctrl = $controller('questionDisplaySettingCtrl', {
                    $scope: scope,
                    settingConst: settingConst,
                    questionConst: questionConst,
                    surveyEditorPageSvc: surveyEditorPageSvc,
                    $modal: modal,
                    skipCommandSvc: skipCommandSvc,
                    stringUtilSvc: stringUtilSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    questionDisplaySettingSvc: questionDisplaySettingSvc,
                    serverValidationSvc: serverValidationSvc
                });
            });
        });

        describe('Testing onOptionsMaskChange function', function () {
            beforeEach(function () {
                scope.question.optionsMask.questionId = 1;
            });

            it('should change option mask when question does not use options mask', function () {
                scope.question.optionsMask.optionsMaskType = '';
                ctrl.onOptionsMaskChange();

                expect(scope.question.optionsMask.questionId).toEqual('');
            });

            it('should not change option mask when question uses options mask', function () {
                scope.question.optionsMask.optionsMaskType = 'dummy';

                ctrl.onOptionsMaskChange();

                expect(scope.question.optionsMask.questionId).not.toEqual('');
            });
        });


        describe('Testing onLongTextDisplaySettingsChange function', function () {
            it('should call question-previewer update data', function () {
                scope.question.cols = 100;
                scope.question.rows = 5;
                var data = {
                    cols: scope.question.cols,
                    rows: scope.question.rows
                };

                ctrl.onLongTextAdvancedSettingsChange();

                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalledWith(UPDATING_COMMAND_TYPES.longText.advancedSettings, data);
            });
        });

        describe('Testing onRenderOptionAsButtonChange function', function () {
            it('should call question-previewer update data', function () {
                ctrl.onRenderOptionAsButtonChange();

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalledWith(scope.question);
            });
        });

        describe('Testing onOptionsOrderChange function', function () {
            it('should call question-previewer update data', function () {
                ctrl.onOptionsOrderChange();

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalledWith(scope.question);
            });
        });

        describe('Testing onDisplayOrientationChange function', function () {
            it('should call question-previewer update data', function () {
                ctrl.onDisplayOrientationChange();

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalledWith(scope.question);
            });
        });

        describe('Testing onTransposedChange function', function () {
            it('should call question-previewer update data', function () {
                ctrl.onTransposedChange();

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalledWith(scope.question);
            });
        });

        describe('Testing onMaxPicturesInGridChange function', function () {
            it('should call question-previewer update data', function () {
                ctrl.onMaxPicturesInGridChange();

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalledWith(scope.question);
            });
        });

        describe('Testing onIsScalePictureToFitContainerChange function', function () {
            it('should call question-previewer update data', function () {
                ctrl.onIsScalePictureToFitContainerChange();

                expect(questionPreviewerSvc.addReloadCommand).toHaveBeenCalledWith(scope.question);
            });
        });

        describe('Testing onIsPictureShowLabelChange function', function () {
            it('should call question-previewer update data', function () {
                scope.question.isPictureShowLabel = true;

                ctrl.onIsPictureShowLabelChange();

                expect(questionPreviewerSvc.addOrUpdateUpdatingCommand).toHaveBeenCalledWith(UPDATING_COMMAND_TYPES.pictureSelection.isPictureShowLabel, scope.question.isPictureShowLabel);
            });
        });
    });
})();