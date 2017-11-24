(function () {
    angular
        .module('svt')
        .factory('surveyMenuSvc', surveyMenuSvc);

    surveyMenuSvc.$inject = ['hrToolConfig'];

    function surveyMenuSvc(hrToolConfig) {
        var topLevelMenuItems = {
            surveys: {
                id: 'surveys',
                name: 'Surveys',
                route: '#/surveys'
            },
            reports: {
                id: 'reports',
                name: 'Reports',
                route: '#/reports'
            },
            library: {
                id: 'library',
                name: 'Library',
                route: '#/library/survey-library-management'
            },
            recruitment: {
                id: 'recruitment',
                name: 'Recruitment',
                route: hrToolConfig.host
            }
        };
        var subMenuItems = {
            surveyList: {
                id: 'surveyList',
                name: 'My Surveys',
                route: '#/surveys'
            },
            surveyDashboard: {
                id: 'survey.dashboard',
                name: 'Dashboard',
                route: null
            },
            surveyDesigner: {
                id: 'survey.designer',
                name: 'Designer',
                route: null
            },
            surveyTest: {
                id: 'survey.test',
                name: 'Test',
                route: null
            },
            surveyResponses: {
                id: 'survey.responses',
                name: 'Responses',
                route: null
            },
            surveyLaunch: {
                id: 'survey.launch',
                name: 'Launch',
                route: null
            },
            surveyResults: {
                id: 'survey.results',
                name: 'Results',
                route: null
            },
            reportList: {
                id: 'reportList',
                name: 'My Reports',
                route: '#/reports'
            },
            fileLibrary: {
                id: 'library.file',
                name: 'File Library',
                route: '#/library/file-library-management'
            },
            surveyLibrary: {
                id: 'library.survey',
                name: 'Survey Library',
                route: '#/library/survey-library-management'
            }

        };
        var menuStatus = {
            activeTopLevelMenuItemId: null,
            activeSubMenuItemId: null,
            topLevelMenuItems: [
                topLevelMenuItems.surveys,
                topLevelMenuItems.library,
                topLevelMenuItems.reports
            ],
            subMenuItems: [],
            expandContainerWidth: false
        };
        if (hrToolConfig.showRecruitment) menuStatus.topLevelMenuItems.push(topLevelMenuItems.recruitment);

        var services = {
            getMenuStatus: getMenuStatus,
            updateMenuForSurveyList: updateMenuForSurveyList,
            updateMenuForReportList: updateMenuForReportList,
            updateMenuForReport: updateMenuForReport,
            updateMenuForFileLibrary: updateMenuForFileLibrary,
            updateMenuForSurveyLibrary: updateMenuForSurveyLibrary,
            updateMenuForUserList: updateMenuForUserList,
            updateMenuForChangePassword: updateMenuForChangePassword,
            updateMenuForSurveyDashboard: updateMenuForSurveyDashboard,
            updateMenuForSurveyDesigner: updateMenuForSurveyDesigner,
            updateMenuForSurveyTest: updateMenuForSurveyTest,
            updateMenuForSurveyResponses: updateMenuForSurveyResponses,
            updateMenuForSurveyLaunch: updateMenuForSurveyLaunch,
            updateMenuForSurveyResults: updateMenuForSurveyResults,
            updateMenuForSurveyPreview: updateMenuForSurveyPreview

    };
        return services;

        function getMenuStatus() {
            return menuStatus;
        }


        function updateMenuForSurveyList() {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = subMenuItems.surveyList.id;
            menuStatus.subMenuItems = [
                subMenuItems.surveyList
            ];
            menuStatus.expandContainerWidth = false;
        }

        function updateMenuForReportList() {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.reports.id;
            menuStatus.activeSubMenuItemId = subMenuItems.reportList.id;
            menuStatus.subMenuItems = [
                subMenuItems.reportList
            ];
            menuStatus.expandContainerWidth = false;
        }

        function updateMenuForReport() {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.reports.id;
            menuStatus.activeSubMenuItemId = subMenuItems.reportList.id;
            menuStatus.subMenuItems = [
                subMenuItems.reportList
            ];
            menuStatus.expandContainerWidth = false;
        }

        function updateMenuForFileLibrary() {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.library.id;
            menuStatus.activeSubMenuItemId = subMenuItems.fileLibrary.id;
            menuStatus.subMenuItems = [
                subMenuItems.surveyLibrary,
                subMenuItems.fileLibrary
            ];
            menuStatus.expandContainerWidth = true;
        }

        function updateMenuForSurveyLibrary() {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.library.id;
            menuStatus.activeSubMenuItemId = subMenuItems.surveyLibrary.id;
            menuStatus.subMenuItems = [
                subMenuItems.surveyLibrary,
                subMenuItems.fileLibrary
            ];
            menuStatus.expandContainerWidth = true;
        }

        function updateMenuForUserList() {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = null;
            menuStatus.subMenuItems = [
                subMenuItems.surveyList
            ];
            menuStatus.expandContainerWidth = false;
        }

        function updateMenuForChangePassword() {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = null;
            menuStatus.subMenuItems = [
                subMenuItems.surveyList
            ];
            menuStatus.expandContainerWidth = false;
        }

        function updateMenuForSurveyDashboard(surveyId) {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = subMenuItems.surveyDashboard.id;
            menuStatus.expandContainerWidth = false;
            setSurveyDetailsMenuItems(surveyId);
        }

        function updateMenuForSurveyDesigner(surveyId) {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = subMenuItems.surveyDesigner.id;
            menuStatus.expandContainerWidth = false;
            setSurveyDetailsMenuItems(surveyId);
        }

        function updateMenuForSurveyTest(surveyId) {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = subMenuItems.surveyTest.id;
            menuStatus.expandContainerWidth = false;
            setSurveyDetailsMenuItems(surveyId);
        }

        function updateMenuForSurveyResponses(surveyId) {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = subMenuItems.surveyResponses.id;
            menuStatus.expandContainerWidth = false;
            setSurveyDetailsMenuItems(surveyId);
        }

        function updateMenuForSurveyLaunch(surveyId) {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = subMenuItems.surveyLaunch.id;
            menuStatus.expandContainerWidth = false;
            setSurveyDetailsMenuItems(surveyId);
        }

        function updateMenuForSurveyResults(surveyId) {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = subMenuItems.surveyResults.id;
            menuStatus.expandContainerWidth = true;
            setSurveyDetailsMenuItems(surveyId);
        }

        function updateMenuForSurveyPreview(surveyId) {
            menuStatus.activeTopLevelMenuItemId = topLevelMenuItems.surveys.id;
            menuStatus.activeSubMenuItemId = null;
            menuStatus.expandContainerWidth = false;
            setSurveyDetailsMenuItems(surveyId);
        }

        function setSurveyDetailsMenuItems(surveyId) {
            subMenuItems.surveyDashboard.route = ['#/surveys', surveyId, 'dashboard'].join('/');
            subMenuItems.surveyDesigner.route = ['#/surveys', surveyId, 'designer'].join('/');
            subMenuItems.surveyTest.route = ['#/surveys', surveyId, 'test'].join('/');
            subMenuItems.surveyResponses.route = ['#/surveys', surveyId, 'responses'].join('/');
            subMenuItems.surveyLaunch.route = ['#/surveys', surveyId, 'launch'].join('/');
            subMenuItems.surveyResults.route = ['#/surveys', surveyId, 'results'].join('/');
            menuStatus.subMenuItems = [
                subMenuItems.surveyDashboard,
                subMenuItems.surveyDesigner,
                subMenuItems.surveyTest,
                subMenuItems.surveyResponses,
                subMenuItems.surveyLaunch,
                subMenuItems.surveyResults
            ];
        }
    }
})();