(function () {
    'use strict';
    describe('Testing createNewSurveySvc service', function () {
        var svc;

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                svc = $injector.get('createNewSurveySvc');
            });
        });

        describe('Testing validateNewSurvey function', function () {
            var result,
                data;

            it('should validate existing survey id when creating survey from existing surveys', function () {
                data = { existingSurveyId: null };

                result = svc.validateNewSurvey(data);

                expect(result.valid).toEqual(false);
                expect(result.message).toEqual('Existing survey is required');
            });

            it('should validate library survey id when creating survey from library', function () {
                data = { librarySurveyId: null };

                result = svc.validateNewSurvey(data);

                expect(result.valid).toEqual(false);
                expect(result.message).toEqual('Survey from library is required');
            });

            it('should validate survey title', function () {
                data = { surveyTitle: ' ' };

                result = svc.validateNewSurvey(data);

                expect(result.valid).toEqual(false);
                expect(result.message).toEqual('Survey title is required');
            });

            it('should pass validation with valid survey data', function () {
                data = { existingSurveyId: '1', librarySurveyId: '2',  surveyTitle: 'dummy' };

                result = svc.validateNewSurvey(data);

                expect(result.valid).toEqual(true);
                expect(result.message).toEqual('');
            });
        });
    });
})();