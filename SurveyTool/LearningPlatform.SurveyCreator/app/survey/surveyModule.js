(function () {
    'use strict';

    angular.module('svt', [
            'angularModalService',
            'ngRoute',
            'ui.bootstrap',
            'ngResource',
            'ngSanitize',
            'ui.sortable', 'angularSpinner', 'highcharts-ng',
            'rzModule', 'angular-clipboard',
            'ui.select', 'colorpicker.module'
    ])
        .config([
            '$routeProvider', 'usSpinnerConfigProvider', '$httpProvider', function ($routeProvider, usSpinnerConfigProvider, $httpProvider) {
                var deletedSurveyValidatorState = {
                    templateUrl: 'survey/deletedSurveyValidator/deleted-survey-validator.html',
                    controller: 'deletedSurveyValidatorCtrl',
                    controllerAs: 'vm'
                };
                $routeProvider
                .when('/surveys', {
                    templateUrl: 'survey/surveyList/surveys.html',
                    controller: 'surveysCtrl',
                    controllerAs: 'vm'
                })
                .when('/reports', {
                    templateUrl: 'survey/reportList/reports.html',
                    controller: 'reportsCtrl',
                    controllerAs: 'vm'
                })
                .when('/login/:response', {
                    templateUrl: 'survey/auth/login.html',
                    controller: 'loginCtrl',
                    controllerAs: 'vm'
                })
                .when('/users', {
                    templateUrl: 'survey/user/users.html',
                    controller: 'usersCtrl',
                    controllerAs: 'vm'
                })
                .when('/change-password', {
                    templateUrl: 'survey/account/change-password.html',
                    controller: 'changePasswordCtrl',
                    controllerAs: 'vm'
                })
                .when('/surveys/:id/preview', {
                    templateUrl: 'survey/testSurvey/test-survey.html',
                    controller: 'testSurveyCtrl',
                    controllerAs: 'vm'
                })
                .when('/surveys/:id/dashboard', deletedSurveyValidatorState)
                .when('/surveys/:id/test', deletedSurveyValidatorState)
                .when('/surveys/:id/responses', deletedSurveyValidatorState)
                .when('/surveys/:id/designer', deletedSurveyValidatorState)
                .when('/surveys/:id/launch', deletedSurveyValidatorState)
                .when('/surveys/:id/results', deletedSurveyValidatorState)
                .when('/reports/:id/designer/:surveyId', deletedSurveyValidatorState)
                .when('/library/file-library-management', {
                    templateUrl: 'survey/fileLibraryManagement/file-library-management.html',
                    controller: 'fileLibraryManagementCtrl',
                    controllerAs: 'vm'
                })
                .when('/library/survey-library-management', {
                    templateUrl: 'survey/surveyLibraryManagement/survey-library-management.html',
                    controller: 'surveyLibraryManagementCtrl',
                    controllerAs: 'vm'
                })
                .when('/welcome', {
                    templateUrl: 'welcome.html',
                    controller: 'welcomeCtrl',
                    controllerAs: 'vm'
                })
                .when('/error', {
                    templateUrl: 'survey/page/errorPage/errorPage.html',
                    controller: 'errorPageCtrl',
                    controllerAs: 'vm'
                })
                .otherwise({ redirectTo: '/surveys' });

                usSpinnerConfigProvider.setDefaults({ color: '#337ab7' });
                $httpProvider.interceptors.push('authInterceptorSvc');
            }
        ])
        .run(function () {
            CKEDITOR.config.customConfig = false;
            CKEDITOR.config.defaultLanguage = "en";
            CKEDITOR.config.language = "en";
            CKEDITOR.config.image_previewText = CKEDITOR.tools.repeat(" ", 1);
            CKEDITOR.config.title = false;
            CKEDITOR.config.entities = false;
            CKEDITOR.config.basicEntities = false;
            CKEDITOR.config.dialog_noConfirmCancel = true;

            CKEDITOR.plugins.addExternal('svtinserthelper', CKEDITOR_CUSTOMPLUGINS_BASEPATH + 'svtinserthelper/');
            CKEDITOR.plugins.addExternal('svtquestionplaceholder', CKEDITOR_CUSTOMPLUGINS_BASEPATH + 'svtquestionplaceholder/');
            CKEDITOR.plugins.addExternal('svtrespondentplaceholder', CKEDITOR_CUSTOMPLUGINS_BASEPATH + 'svtrespondentplaceholder/');
            CKEDITOR.plugins.addExternal('svtsurveylink', CKEDITOR_CUSTOMPLUGINS_BASEPATH + 'svtsurveylink/');
            CKEDITOR.plugins.addExternal('svtinsertfromfilelibrary', CKEDITOR_CUSTOMPLUGINS_BASEPATH + 'svtinsertfromfilelibrary/');

            CKEDITOR.plugins.load('svtinserthelper');
            CKEDITOR.plugins.load('svtquestionplaceholder');
            CKEDITOR.plugins.load('svtrespondentplaceholder');
            CKEDITOR.plugins.load('svtsurveylink');
            CKEDITOR.plugins.load('svtinsertfromfilelibrary');

            CKEDITOR.config.removePlugins = 'magicline';

            CKEDITOR.disableAutoInline = true;
            CKEDITOR.appendTo('ck-editor-init');
        });
})();
