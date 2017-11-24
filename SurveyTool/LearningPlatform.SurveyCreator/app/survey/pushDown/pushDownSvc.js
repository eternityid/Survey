(function() {
    angular.module('svt').factory('pushDownSvc', pushDownSvc);

    function pushDownSvc() {

        var settings = {
            isActive: false,
            isLoaded: false,
            mode: {
                lookAndFeel: false,
                surveySettings: false,
                createNewSurvey: false,
                exportSurvey: false,
                importRespondent: false,
                exportResponses: false,
                emailRespondent: false,
                createReport: false,
                importSurvey: false,
                generateRandomData: false,
                addRespondent: false,
                accessRights: false
            }
        };

        var MODE_NAMES = {
            lookAndFeel: 'lookAndFeel',
            surveySettings: 'surveySettings',
            createNewSurvey: 'createNewSurvey',
            exportSurvey: 'exportSurvey',
            importRespondent: 'importRespondent',
            exportResponses: 'exportResponses',
            emailRespondent: 'emailRespondent',
            createReport: 'createReport',
            importSurvey: 'importSurvey',
            generateRandomData: 'generateRandomData',
            addRespondent: 'addRespondent',
            accessRights: 'accessRights'
        };

        var service = {
            hidePushDown: hidePushDown,
            getPushDownSettings: getPushDownSettings,
            showCreateSurvey: showCreateSurvey,
            showCreateNewSurvey: showCreateNewSurvey,
            showLookAndFeel: showLookAndFeel,
            showImportRespondent: showImportRespondent,
            showExportResponses: showExportResponses,
            showEmailRespondent: showEmailRespondent,
            showCreateReport: showCreateReport,
            showImportSurvey: showImportSurvey,
            showExportSurvey: showExportSurvey,
            showGenerateRandomData: showGenerateRandomData,
            showAddRespondent: showAddRespondent,
            showAccessRights: showAccessRights,
            setLoadingStatus: setLoadingStatus,
            showMode: showMode,
            showHideMode: showHideMode
        };
        return service;

        function hidePushDown() {
            settings.isActive = false;
            for (var mode in settings.mode) {
                settings.mode[mode] = false;
            }
        }

        function getPushDownSettings() {
            return settings;
        }

        function showCreateSurvey() {
            showHideMode(MODE_NAMES.surveySettings);
        }

        function showCreateNewSurvey() {
            showHideMode(MODE_NAMES.createNewSurvey);
        }

        function showLookAndFeel(waitingPromise) {
            showHideMode(MODE_NAMES.lookAndFeel);
        }

        function showImportRespondent() {
            showHideMode(MODE_NAMES.importRespondent);
        }

        function showExportResponses() {
            showHideMode(MODE_NAMES.exportResponses);
        }

        function showEmailRespondent() {
            showHideMode(MODE_NAMES.emailRespondent);
        }

        function showCreateReport() {
            showHideMode(MODE_NAMES.createReport);
        }

        function showImportSurvey() {
            showHideMode(MODE_NAMES.importSurvey);
        }

        function showExportSurvey() {
            showHideMode(MODE_NAMES.exportSurvey);
        }

        function showGenerateRandomData() {
            showHideMode(MODE_NAMES.generateRandomData);
        }

        function showAddRespondent() {
            showHideMode(MODE_NAMES.addRespondent);
        }

        function showAccessRights() {
            showHideMode(MODE_NAMES.accessRights);
        }

        function setLoadingStatus(value) {
            settings.isLoaded = value;
        }

        function showMode(modeName) {
            settings.isActive = true;
            for (var item in settings.mode) {
                settings.mode[item] = item === modeName ? true : false;
            }
        }

        function showHideMode(modeName) {
            if (settings.mode[modeName]) {
                hidePushDown();
            } else {
                showMode(modeName);
            }
        }
    }
})();