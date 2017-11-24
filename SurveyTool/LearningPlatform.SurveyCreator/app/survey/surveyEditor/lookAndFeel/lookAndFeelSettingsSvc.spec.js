(function () {
    describe('Testing lookAndFeelSettingsSvc service', function () {
        var svc,
            fileStatus,
            lookAndFeelPreviewerSvc;
        beforeEach(function () {
            module('svt');
            module(function ($provide) {
            });
            inject(function ($injector) {
                svc = $injector.get('lookAndFeelSettingsSvc');
            });
        });

        describe('Testing validateLookAndFeelSettings serivce', function () {
            it('should call service to validate LookAndFeel settings', inject(function (lookAndFeelSettingsSvc) {
                var modelData = {
                    survey: {
                        themeId: '2',
                        layoutId: '2'
                    },
                    theme: {}
                };
                var expectedresult = svc.validateLookAndFeelSettings(modelData);

                expect(expectedresult).toEqual(false);
            }));

            it('should call service to validate LookAndFeel settings with invalid themeId and return false', inject(function (lookAndFeelSettingsSvc) {
                spyOn(toastr, 'error');
                var modelData = {
                    survey: {
                        themeId: null,
                        layoutId: '2'
                    },
                    theme: {},
                    themeId: null
                };
                var expectedresult = svc.validateLookAndFeelSettings(modelData);

                expect(expectedresult).toEqual(false);
                expect(toastr.error).toHaveBeenCalledWith('Please choose theme');
            }));

            it('should call service to validate LookAndFeel settings with invalid LayoutId and return false', inject(function (lookAndFeelSettingsSvc) {
                spyOn(toastr, 'error');
                var modelData = {
                    survey: {
                        themeId: '2',
                        layoutId: null
                    },
                    theme: {},
                    layoutId: null
                };
                var expectedresult = svc.validateLookAndFeelSettings(modelData);

                expect(expectedresult).toEqual(false);
            }));
        });

        describe('Testing buildLookAndFeelDataForBackend function', function () {
            it('should call service to build LookAndFeel data for backend', inject(function (lookAndFeelSettingsSvc) {
                var modelData = {
                    survey: {
                        themeId: '2',
                        layoutId: '2',
                        surveySettings: { rowVersion: {} },
                        rowVersion: {}
                    },
                    theme: {
                    },
                    newTheme: {
                        permitSave: false,
                        name: ''
                    }
                };

                svc.buildLookAndFeelDataForBackend(modelData);
                var result = svc.buildLookAndFeelDataForBackend(modelData);

                expect(result).toBeDefined();
            }));

            it('should call service to build LookAndFeel data for backend', inject(function (lookAndFeelSettingsSvc) {
                var modelData = {
                    survey: {
                        themeId: '2',
                        layoutId: '2',
                        surveySettings: { rowVersion: {} },
                        rowVersion: {}
                    },
                    theme: {
                        font: "dummy",
                        logo: 'dummy',
                        backgroundImage: 'dummy',
                        backgroundColor: 'dummy',
                        questionTitleColor: 'dummy',
                        questionDescriptionColor: 'dummy',
                        questionContentColor: 'dummy',
                        primaryButtonBackgroundColor: 'dummy',
                        primaryButtonColor: 'dummy',
                        defaultButtonBackgroundColor: 'dummy',
                        defaultButtonColor: 'dummy',
                        inputFieldBackgroundColor: 'dummy',
                        inputFieldColor: 'dummy',
                        errorColor: 'dummy',
                        errorBackgroundColor: 'dummy',
                        pageContainerBackgroundOpacity: 'dummy',
                        pageContainerBackgroundColor: 'dummy',
                        isRepeatBackground: 'dummy',
                        backgroundStyle: 'dummy'
                    },
                    newTheme: {
                        permitSave: true,
                        name: ''
                    }
                };
                var result = svc.buildLookAndFeelDataForBackend(modelData);

                expect(result).toBeDefined();
            }));
        });

        describe('Testing validateNewTheme function', function() {
            var modelData, placeHolder;

            beforeEach(function() {
                modelData = {
                    newTheme: {}
                };
                placeHolder = {
                    themeName: {
                        valid: true
                    }
                };
            });

            it('should validate new theme name', inject(function (lookAndFeelSettingsSvc) {
                modelData.newTheme.name = '';

                var result = svc.validateNewTheme(modelData, placeHolder);

                expect(placeHolder.themeName.valid).toEqual(false);
                expect(result).toEqual(false);
            }));

            it('should return true with valid data', inject(function(lookAndFeelSettingsSvc) {
                modelData.newTheme.name = 'dummy';

                var result = svc.validateNewTheme(modelData, placeHolder);

                expect(placeHolder.themeName.valid).toEqual(true);
                expect(result).toEqual(true);
            }));
        });
    });
})();