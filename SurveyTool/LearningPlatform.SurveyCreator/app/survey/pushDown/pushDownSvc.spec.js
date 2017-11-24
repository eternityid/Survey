(function () {
    'use strict';
    describe('Testing pushDownSvc service', function () {
        var svc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {});
            inject(function ($injector) {
                svc = $injector.get('pushDownSvc');
            });
        });

        describe('Testing showLookAndFeel function', function () {
            it('should show look and feel dialog', inject(function () {
                var pushDownSettings = svc.getPushDownSettings();

                svc.showLookAndFeel();

                expect(pushDownSettings.isActive).toBe(true);
                expect(pushDownSettings.mode.lookAndFeel).toBe(true);
            }));
        });

        describe('Testing showImportRespondent function', function () {
            it('should show import respondent dialog', inject(function () {
                var pushDownSettings = svc.getPushDownSettings();

                svc.showImportRespondent();

                expect(pushDownSettings.isActive).toBe(true);
                expect(pushDownSettings.mode.importRespondent).toBe(true);
            }));
        });

        describe('Testing showExportResponses function', function () {
            it('should show export responses dialog', inject(function () {
                var pushDownSettings = svc.getPushDownSettings();

                svc.showExportResponses();

                expect(pushDownSettings.isActive).toBe(true);
                expect(pushDownSettings.mode.exportResponses).toBe(true);
            }));
        });

        describe('Testing showImportSurvey function', function () {
            it('should show import survey dialog', inject(function () {
                var pushDownSettings = svc.getPushDownSettings();

                svc.showImportSurvey();

                expect(pushDownSettings.isActive).toBe(true);
                expect(pushDownSettings.mode.importSurvey).toBe(true);
            }));
        });

        describe('Testing showExportSurvey function', function () {
            it('should show export survey dialog', inject(function () {
                var pushDownSettings = svc.getPushDownSettings();

                svc.showExportSurvey();

                expect(pushDownSettings.isActive).toBe(true);
                expect(pushDownSettings.mode.exportSurvey).toBe(true);
            }));
        });

        describe('Testing showGenerateRandomData function', function () {
            it('should show generate random data dialog', inject(function () {
                var pushDownSettings = svc.getPushDownSettings();

                svc.showGenerateRandomData();

                expect(pushDownSettings.isActive).toBe(true);
                expect(pushDownSettings.mode.generateRandomData).toBe(true);
            }));
        });

        describe('Testing showAddRespondent function', function () {
            it('should show add respondent dialog', inject(function () {
                var pushDownSettings = svc.getPushDownSettings();

                svc.showAddRespondent();

                expect(pushDownSettings.isActive).toBe(true);
                expect(pushDownSettings.mode.addRespondent).toBe(true);
            }));
        });

        describe('Testing showEmailRespondent function', function () {
            it('should show email respondent dialog', inject(function () {
                var pushDownSettings = svc.getPushDownSettings();

                svc.showEmailRespondent();

                expect(pushDownSettings.isActive).toBe(true);
                expect(pushDownSettings.mode.emailRespondent).toBe(true);
            }));
        });
    });
})();