(function() {
    'use strict';
    describe('Testing surveySettingsSvc service', function () {
        var svc;

        beforeEach(function () {
            module('svt');
            module(function($provide) {
                var spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                $provide.value('spinnerUtilSvc', spinnerUtilSvc);
            });

            inject(function ($injector) {
                svc = $injector.get('surveySettingsSvc');
            });
        });

        describe('Testing validateSurveyData function', function () {
            var surveySettings = {},
                placeHolder = { surveyName: {} };

            it('should return true with valid survey data', function() {
                surveySettings.surveyTitle = 'dummy';

                var validate = svc.validateSurveySettings(surveySettings, placeHolder);

                expect(validate).toEqual(true);
            });

            it('should return false with invalid survey name', function() {
                surveySettings.surveyTitle = '';

                var validate = svc.validateSurveySettings(surveySettings, placeHolder);

                expect(validate).toEqual(false);
            });
        });
    });
})();