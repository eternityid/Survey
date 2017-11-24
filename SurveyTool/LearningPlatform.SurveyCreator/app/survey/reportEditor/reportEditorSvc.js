(function() {
    angular.module('svt').factory('reportEditorSvc', reportEditorSvc);

    function reportEditorSvc() {
        var reportData = {},
            showedMarginPage = {
                id: 0
            },
            workingScreen = {
            };

        var service = {
            setReportData: setReportData,
            getReportData: getReportData,
            getElementTypes: getElementTypes,
            buildMovingPage: buildMovingPage,
            mapReportPages: mapReportPages,
            mapReportQuestions: mapReportQuestions,
            isNoData: isNoData,
            getShowedMarginPage: getShowedMarginPage,
            setShowedMarginPageId: setShowedMarginPageId,
            getWorkingScreen: getWorkingScreen,
            setWorkingScreenOnPage: setWorkingScreenOnPage
        };
        return service;

        function setReportData(data) {
            reportData.dataRespondents = data.dataRespondents;
            reportData.openTextRespondents = data.openTextRespondents;
            reportData.questions = data.questions;
        }

        function getReportData() {
            return reportData;
        }

        function isNoData() {
            return reportData.dataRespondents === null;
        }

        function getElementTypes() {
            return {
                chart: 1,
                table: 2,
                freeText: 3
            };
        }

        function buildMovingPage(event) {
            var page = event.source.itemScope.page;
            return {
                pageId: page.id,
                reportId: page.reportId,
                newIndexPosition: event.dest.index,
                oldIndexPosition: event.source.index
            };
        }

        function mapReportPages(reportPages) {
            var pages = { data: [] };
            reportPages.forEach(function (page) {
                pages.data.push(page);
            });
            return pages;
        }

        function mapReportQuestions(reportQuestions) {
            var questions = [];
            reportQuestions.forEach(function (question) {
                questions.push({
                    id: question.id,
                    name: question.name,
                    type: question.type,
                    questionAlias: question.questionAlias,
                    options: question.options,
                    topics: question.topics
                });
            });
            return questions;
        }

        function getShowedMarginPage() {
            return showedMarginPage;
        }

        function setShowedMarginPageId(pageId) {
            showedMarginPage.id = pageId;
        }

        function getWorkingScreen() {
            return workingScreen;
        }

        function setWorkingScreenOnPage(value) {
            workingScreen.onPage = value;
        }
    }
})();