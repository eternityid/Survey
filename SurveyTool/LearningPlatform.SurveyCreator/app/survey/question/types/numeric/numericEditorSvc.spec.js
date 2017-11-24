(function () {
    'use strict';
    describe('Testing numericEditorSvc service', function () {
        var svc,
          stringUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty']);

                $provide.value('stringUtilSvc', stringUtilSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('numericEditorSvc');
            });
        });

        describe('Testing getValidationByType function', function () {
            var result,
                validations,
                type;

            beforeEach(function () {
                validations = [{ $type: 'dummy1' }, { $type: 'dummy2' }];
            });

            it('should return the validation when it exists in the validation collection', function () {
                type = 'dummy1';

                result = svc.getValidationByType(validations, type);

                expect(result).not.toEqual(null);
                expect(result.$type).toEqual(type);
            });

            it('should return null when cannot find validation in validation collection', function () {
                type = 'dummy';

                result = svc.getValidationByType(validations, type);

                expect(result).toEqual(null);
            });
        });
    });
})();