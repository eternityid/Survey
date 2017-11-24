(function () {
    'use stric';
    describe('Testing lookAndFeelSettingsCtrl controller', function () {
        var ctrl,
            scope,
            $modal,
            errorHandlingSvc,
            lookAndFeelSettingsSvc,
            surveyEditorSvc,
            layoutDataSvc,
            themeDataSvc,
            surveyDataSvc,
            q,
            lookAndFeelPreviewerSvc,
            fileStatus,
            rootScope,
            surveyLookAndFeelSettingsSvc,
            pageLookAndFeelSettingsSvc,
            fileLibraryConstants;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q, $injector) {
                q = $q;

                scope = $rootScope.$new();
                scope.data = { survey: {} };
                scope.handleAfterSave = jasmine.createSpy();

                $modal = jasmine.createSpyObj('$modal', ['open']);

                layoutDataSvc = jasmine.createSpyObj('layoutDataSvc', ['getAllLayouts']);
                layoutDataSvc.getAllLayouts.and.returnValue({ $promise: q.when([{ id: 1 }]) });

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                themeDataSvc = jasmine.createSpyObj('themeDataSvc', ['getSystemThemes', 'getTheme', 'getSystemUserThemes', 'getAvailableThemesForSurvey']);
                themeDataSvc.getSystemThemes.and.returnValue({ $promise: q.when([{ id: 2 }]) });
                themeDataSvc.getSystemUserThemes.and.returnValue({ $promise: q.when([{ id: 2 }]) });
                themeDataSvc.getTheme.and.returnValue({ $promise: q.reject('error2') });
                themeDataSvc.getAvailableThemesForSurvey.and.returnValue({ $promise: q.when() });

                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', ['getSurveyBrief']);
                surveyDataSvc.getSurveyBrief.and.returnValue({ $promise: q.when() });

                lookAndFeelSettingsSvc = jasmine.createSpyObj('lookAndFeelSettingsSvc', [
                    'getPlaceHolders', 'setCurrentSurvey', 'getBasedLookAndFeel',
                    'keepSurveyCustomTheme', 'updateModelByChangingTheme',
                    'initLookAndFeelPreviewModel',
                    'buildLookAndFeelDataForBackend', 'validateLookAndFeelSettings',
                    'setDefaultBackGroundSettings'
                ]);
                lookAndFeelSettingsSvc.getPlaceHolders.and.returnValue({ themeName: {} });
                lookAndFeelSettingsSvc.buildLookAndFeelDataForBackend.and.returnValue({});
                lookAndFeelSettingsSvc.validateLookAndFeelSettings.and.returnValue(true);

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getSurvey']);
                surveyEditorSvc.getSurvey.and.returnValue({ LayoutId: 1, ThemeId: 1 });

                lookAndFeelPreviewerSvc = jasmine.createSpyObj('lookAndFeelPreviewerSvc', [
                    'addReloadCommand', 'updatePreviewThemeCommand'
                ]);

                fileStatus = $injector.get('fileStatus');

                surveyLookAndFeelSettingsSvc = jasmine.createSpyObj('surveyLookAndFeelSettingsSvc', [
                    'getLookAndFeelBindingModel', 'ensureHaveCustomTheme', 'initSurveyLookAndFeelPreviewModel'
                ]);
                surveyLookAndFeelSettingsSvc.getLookAndFeelBindingModel.and.returnValue({ model: {} });

                pageLookAndFeelSettingsSvc = jasmine.createSpyObj('pageLookAndFeelSettingsSvc', [
                    'getLookAndFeelBindingModel', 'isPageLookAndFeelOverridden',
                    'detectTrackingChanges', 'parsePageThemeOverrides', 'getBasedThemePerPage',
                    'initPageLookAndFeelPreviewModel'
                ]);
                pageLookAndFeelSettingsSvc.getLookAndFeelBindingModel.and.returnValue({ model: {} });

                fileLibraryConstants = $injector.get('fileLibraryConstants');

                ctrl = $controller('lookAndFeelSettingsCtrl', {
                    $scope: scope,
                    $modal: $modal,
                    errorHandlingSvc: errorHandlingSvc,
                    lookAndFeelSettingsSvc: lookAndFeelSettingsSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    layoutDataSvc: layoutDataSvc,
                    themeDataSvc: themeDataSvc,
                    lookAndFeelPreviewerSvc: lookAndFeelPreviewerSvc,
                    fileStatus: fileStatus,
                    surveyLookAndFeelSettingsSvc: surveyLookAndFeelSettingsSvc,
                    pageLookAndFeelSettingsSvc: pageLookAndFeelSettingsSvc,
                    surveyDataSvc: surveyDataSvc,
                    fileLibraryConstants: fileLibraryConstants
                });
                scope.$digest();
            });
        });

        describe('Testing lookAndFeelCtrl controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.model).toBeDefined();
            });
        });

        describe('Testing init function', function () {
            it('should initalize at beginning', function () {
                layoutDataSvc.getAllLayouts.and.returnValue({ $promise: q.reject('error') });
                themeDataSvc.getSystemUserThemes.and.returnValue({ $promise: q.reject('error1') });
                themeDataSvc.getTheme.and.returnValue({ $promise: q.when(['dummy']) });

                ctrl.init();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing onChangeTheme function', function () {
            it('should not change theme with invalid data', function () {
                ctrl.model.theme = {};

                ctrl.onChangeTheme();

                expect(ctrl.model.theme).toEqual(jasmine.any(Object));
            });

            it('should update theme with valid data', function () {
                ctrl.model.theme = {};
                ctrl.model.themes = [{ id: '1' }, { id: '2' }];
                ctrl.model.survey = {
                    themeId: '2'
                };

                ctrl.onChangeTheme();
            });
        });
    });
})();