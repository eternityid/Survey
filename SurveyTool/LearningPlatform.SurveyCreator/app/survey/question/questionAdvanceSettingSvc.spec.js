(function () {
    'use strict';
    describe('Testing questionAdvanceSettingSvc service', function () {
        var svc, serverValidationSvc, questionWithOptionsSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                serverValidationSvc = jasmine.createSpyObj('serverValidationSvc', [
                    'getServerValidationTypes'
                ]);
                $provide.value('serverValidationSvc', serverValidationSvc);

                questionWithOptionsSvc = jasmine.createSpyObj('questionWithOptionsSvc', [
                    'getOptionDisplayOrientationValues'
                ]);
                $provide.value('questionWithOptionsSvc', questionWithOptionsSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('questionAdvanceSettingSvc');
            });
        });

        describe('Testing getDisplayOrientations function', function () {
            beforeEach(function () {
                questionWithOptionsSvc.getOptionDisplayOrientationValues.and.returnValue({
                    vertical: {},
                    horizontal: {},
                    dropdown: {}
                });
            });

            it('should return display orientations for single selection question', inject(function () {
                var isSingleSelection = true;

                var result = svc.getDisplayOrientations(isSingleSelection);

                expect(result).toBeDefined();
                expect(result.length).toEqual(4);
            }));

            it('should return display orientations for multiple selection question', inject(function () {
                var isSingleSelection = false;

                var result = svc.getDisplayOrientations(isSingleSelection);

                expect(result).toBeDefined();
                expect(result.length).toEqual(2);
            }));
        });

        describe('Testing fillMissedValidations function', function () {
            it('should fill missed validations for question', inject(function () {
                var validationTypes = {
                    required: 'RequiredValidation',
                    length: 'LengthValidation',
                    wordsAmount: 'WordsAmountValidation',
                    selection: 'SelectionValidation'
                };
                var validation = [
                    {
                        $type: validationTypes.required
                    }
                ];
                var questionId = 1;
                serverValidationSvc.getServerValidationTypes.and.returnValue(validationTypes);

                svc.fillMissedValidations(validation, questionId);
            }));
        });
    });
})();