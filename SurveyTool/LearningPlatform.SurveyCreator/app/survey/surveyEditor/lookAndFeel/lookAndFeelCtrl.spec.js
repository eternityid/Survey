(function () {
    'use stric';
    describe('Testing lookAndFeelCtrl controller', function () {
        var ctrl,
            q,
            $scope,
            errorHandlingSvc,
            pushDownSvc,
            surveyEditorSvc,
            lookAndFeelDataSvc,
            settingConst,
            spinnerUtilSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q, $injector) {
                q = $q;

                $scope = $rootScope.$new();
                $scope.data = { survey: {} };
                $scope.handleAfterSave = jasmine.createSpy();

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['hidePushDown', 'setLoadingStatus']);
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getSurvey', 'setSurveyEditMode']);

                lookAndFeelDataSvc = jasmine.createSpyObj('lookAndFeelDataSvc', ['saveLookAndFeel']);
                lookAndFeelDataSvc.saveLookAndFeel.and.returnValue({ $promise: q.when({ status: true }) });

                settingConst = $injector.get('settingConst');
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                ctrl = $controller('lookAndFeelCtrl', {
                    $scope: $scope,
                    errorHandlingSvc: errorHandlingSvc,
                    pushDownSvc: pushDownSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    lookAndFeelDataSvc: lookAndFeelDataSvc,
                    settingConst: settingConst,
                    spinnerUtilSvc: spinnerUtilSvc
                });
            });
        });

        describe('Testing init function', function () {
            it('should initalize at beginning', function () {
                ctrl.init();

                expect(surveyEditorSvc.setSurveyEditMode).toHaveBeenCalledWith(true);
                expect(pushDownSvc.setLoadingStatus).toHaveBeenCalledWith(true);
            });
        });
    });
})();