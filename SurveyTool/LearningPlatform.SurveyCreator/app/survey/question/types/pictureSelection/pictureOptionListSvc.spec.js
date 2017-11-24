(function () {
    'use strict';
    describe('Testing pictureOptionListSvc service', function () {
        var svc,
            languageStringUtilSvc,
            guidUtilSvc,
            stringUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                languageStringUtilSvc = jasmine.createSpyObj('languageStringUtilSvc', ['buildLanguageString']);
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['isEmpty', 'isEquals', 'getPlainText']);

                $provide.value('languageStringUtilSvc', languageStringUtilSvc);
                $provide.value('guidUtilSvc', guidUtilSvc);
                $provide.value('stringUtilSvc', stringUtilSvc);
            });

            inject(function ($injector) {
                svc = $injector.get('pictureOptionListSvc');
            });
        });

        describe('Testing buildDefaultOptions function', function () {
            var result,
                surveyId = 1;

            it('should build topic option', function () {

                result = svc.buildDefaultOptions(surveyId);

                expect(languageStringUtilSvc.buildLanguageString).toHaveBeenCalledWith(
                    surveyId, 'Option 1');
            });
        });

        describe('Testing buildNewOptionBasedOnExistedOptions function', function () {
            var result,
                surveyId = 1,
                existedOptions;

            it('should build Option', function () {
                var existedAliases = [{}];
                var newOptionAlias = 1;
                existedOptions = [{ alias: 'q1' }, { alias: 11 }];

                result = svc.buildNewOptionBasedOnExistedOptions(surveyId, existedOptions);

                expect(languageStringUtilSvc.buildLanguageString).toHaveBeenCalled();
            });
        });

        describe('Testing validateOptions function', function () {
            var options = [{}];

            it('should validate option title', function () {
                spyOn(svc, 'validateOptionTitles');
                svc.validateOptionTitles.and.returnValue({ valid: false });

                svc.validateOptions(options);

                expect(svc.validateOptionTitles).toHaveBeenCalled();
            });

            it('should validate option alias', function () {
                spyOn(svc, 'validateOptionTitles').and.returnValue({ valid: true });
                spyOn(svc, 'validateOptionAliases').and.returnValue({ valid: false });

                svc.validateOptions(options);

                expect(svc.validateOptionAliases).toHaveBeenCalled();
            });

            it('should validate picture options', function () {
                spyOn(svc, 'validateOptionTitles').and.returnValue({ valid: true });
                spyOn(svc, 'validateOptionAliases').and.returnValue({ valid: true });
                spyOn(svc, 'validateOptionPictures');

                svc.validateOptions(options);

                expect(svc.validateOptionPictures).toHaveBeenCalled();
            });
        });

        describe('Testing validateOptionAliases function', function () {
            var result,
                   options = [
                   {
                       alias: 'Alias here',
                       guid: 'guid here'
                   }
                   ];
            it('should return Option at position message when there are alias', function () {
                stringUtilSvc.isEmpty.and.returnValue(true);
                result = svc.validateOptionAliases(options);

                expect(result.valid).toEqual(false);
                expect(result.message.indexOf('Option at position')).toBeGreaterThan(-1);
            });

            it('should not return Option at position message when there are not alias', function () {
                stringUtilSvc.isEmpty.and.returnValue(false);
                result = svc.validateOptionAliases(options);

                expect(result.valid).toEqual(true);
            });

            it('should return Option Title message due to Options is exited', function () {
                options = [
                    {
                        alias: 'Alias 1',
                        guid: 'guid 1'
                    },
                    {
                        alias: 'Alias 1',
                        guid: 'guid 2'
                    }
                ];
                stringUtilSvc.isEquals.and.returnValue(true);

                result = svc.validateOptionAliases(options);

                expect(result.message.indexOf('Option alias ')).toBeGreaterThan(-1);
                expect(result.valid).toEqual(false);
            });
        });

        describe('Testing validateOptionPictures function', function () {
            var result,
                options = [
                   {
                       alias: 'Alias here',
                       guid: 'guid here',
                       pictureName: 'Picture 1'
                   }
                ];
            it('should validation Option position when missing picture', function () {
                stringUtilSvc.isEmpty.and.returnValue(true);

                result = svc.validateOptionPictures(options);

                expect(result.message.indexOf('Option at position ')).toBeGreaterThan(-1);
                expect(result.valid).toEqual(false);
            });

            it('should not validation Option position when missing picture', function () {
                stringUtilSvc.isEmpty.and.returnValue(false);

                result = svc.validateOptionPictures(options);

                expect(result.valid).toEqual(true);
            });
        });

        describe('Testing validateOptionTitles function', function () {
            var result,
                options = [
                    {
                        text: {
                            items: [{ text: 'option 1' }]
                        }
                    }
                ];
            it('should validation Option at position when missing title', function () {
                stringUtilSvc.isEmpty.and.returnValue(true);

                result = svc.validateOptionTitles(options);

                expect(result.message.indexOf('Option at position ')).toBeGreaterThan(-1);
                expect(result.valid).toEqual(false);
            });

            it('should not validation Option at position when dont miss title', function () {
                stringUtilSvc.isEmpty.and.returnValue(false);

                result = svc.validateOptionTitles(options);

                expect(result.valid).toEqual(true);
            });

            it('should validation Option title when have already existed in question', function () {
                options = [
                   {
                       text: {
                           items: [{ text: 'option 1' }]
                       },
                       guid: 'guid 1'
                   },
                   {
                       text: {
                           items: [{ text: 'option 1' }]
                       },
                       guid: 'guid 2'
                   }
                ];
                stringUtilSvc.isEquals.and.returnValue(true);

                expect(result.valid).toEqual(true);
                expect(result.message).toEqual('');
            });
        });
    });
})();