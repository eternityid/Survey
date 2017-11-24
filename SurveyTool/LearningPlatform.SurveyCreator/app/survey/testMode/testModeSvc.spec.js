(function () {
    describe('Testing testModeSvc service', function () {
        var testModeSvc;
        beforeEach(function () {
            module('svt');

            inject(function ($injector) {
                testModeSvc = $injector.get('testModeSvc');
            });
        });

        describe('Testing getTestModeSettings function', function () {
            it('should return testMode status when testMode status exist in session storage', function ( ) {
                var mock = (function () {
                    return {
                        getItem: function () {
                            return JSON.stringify({isActive: true, surveyId: 1});
                        }
                    };
                })();
                Object.defineProperty(window, 'sessionStorage', { value: mock });

                var surveyId = 1;
                var result =  testModeSvc.getTestModeSettings(surveyId);
                expect(result).toEqual({ isActive: true, surveyId: 1 });

            });
            it('should return testMode status when getItem return false', function () {
                var mock = (function () {
                    return {
                        getItem: function () {
                            return false;
                        }
                    };
                })();
                Object.defineProperty(window, 'sessionStorage', { value: mock });

                var surveyId = 1;
                var result = testModeSvc.getTestModeSettings(surveyId);
                expect(result).toEqual({ isActive: false, surveyId: 1 });
            });
        });

        describe('Testing toggleTestMode function', function () {
            it('should toggle test mode ', function () {
                var mock = (function () {
                    var store = {};
                    return {
                        setItem: function (key, undefined) {
                            store[key] = undefined;
                        },
                        removeItem: function () {
                            store = {};
                        }
                    };
                })();
                Object.defineProperty(window, 'sessionStorage', { value: mock, configurable: true, writable: true });

                var surveyId = 1;
                testModeSvc.toggleTestMode(surveyId);
                testModeSvc.toggleTestMode(surveyId);
            });
        });

    });
})();