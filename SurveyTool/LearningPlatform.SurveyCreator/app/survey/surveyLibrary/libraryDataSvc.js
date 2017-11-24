(function () {
    'use strict';

    angular
        .module('svt')
        .factory('libraryDataSvc', libraryDataSvc);

    libraryDataSvc.$inject = ['$resource', 'host'];

    function libraryDataSvc($resource, host) {
        var dataService = {
            addPage: addPage,
            addQuestion: addQuestion,
            addSurvey: addSurvey,
            getSurveys: getSurveys,
            searchSurveys: searchSurveys,
            deleteSurvey: deleteSurvey,
            duplicateSurvey: duplicateSurvey,
            updateSurvey: updateSurvey,

            searchPages: searchPages,
            deletePage: deletePage,
            duplicatePage: duplicatePage,
            updatePage: updatePage,

            searchQuestions: searchQuestions,
            deleteQuestion: deleteQuestion,
            duplicateQuestion: duplicateQuestion,
            updateQuestion: updateQuestion

        };

        return dataService;

        function addPage(pageId) {
            return $resource(host + '/library/pages', {}, { 'addPage': { method: 'POST' } })
                .addPage({}, JSON.stringify({
                    sourcePageId: pageId
                }));
        }

        function addQuestion(questionId) {
            return $resource(host + '/library/questions', {}, { 'addQuestions': { method: 'POST' } })
                .addQuestions({}, JSON.stringify({
                    sourceQuestionId: questionId
                }));
        }

        function addSurvey(surveyId) {
            return $resource(host + '/library/surveys', {}, { 'addSurvey': { method: 'POST' } })
                .addSurvey({}, JSON.stringify({
                    sourceSurveyId: surveyId
                }));
        }

        function getSurveys() {
            return $resource(host + '/library/surveys', {}, { 'getSurveys': { method: 'GET', isArray: true } })
                .getSurveys({});
        }

        function searchSurveys(query, limit, offset) {
            return $resource(host + '/library/surveys/search', {}, { 'searchSurveys': { method: 'POST' } })
                .searchSurveys({}, JSON.stringify({
                    query: query,
                    limit: limit,
                    offset: offset
                }));
        }

        function deleteSurvey(surveyId) {
            return $resource(host + '/library/surveys/:surveyId', { surveyId: '@surveyId' }, { 'deleteSurvey': { method: 'DELETE' } })
                .deleteSurvey({
                    surveyId: surveyId
                });
        }

        function duplicateSurvey(surveyId) {
            return $resource(host + '/library/surveys/:surveyId/duplicate', { surveyId: '@surveyId' }, { 'duplicateSurvey': { method: 'POST' } })
                .duplicateSurvey({
                    surveyId: surveyId
                });
        }

        function updateSurvey(surveyId, surveyTitle) {
            return $resource(host + '/library/surveys/:surveyId', { surveyId: '@surveyId' }, { 'updateSurvey': { method: 'PUT' } })
                .updateSurvey({ surveyId: surveyId }, JSON.stringify({ title: surveyTitle }));
        }


        function searchPages(query, limit, offset) {
            return $resource(host + '/library/pages/search', {}, { 'searchPages': { method: 'POST' } })
                .searchPages({}, JSON.stringify({
                    query: query,
                    limit: limit,
                    offset: offset
                }));
        }

        function deletePage(pageId) {
            return $resource(host + '/library/pages/:pageId', { pageId: '@pageId' }, { 'deletePage': { method: 'DELETE' } })
                .deletePage({
                    pageId: pageId
                });
        }

        function duplicatePage(pageId) {
            return $resource(host + '/library/pages/:pageId/duplicate', { pageId: '@pageId' }, { 'duplicatePage': { method: 'POST' } })
                .duplicatePage({
                    pageId: pageId
                });
        }

        function updatePage(pageId, pageTitle, pageDescription) {
            return $resource(host + '/library/pages/:pageId', { pageId: '@pageId' }, { 'updatePage': { method: 'PUT' } })
                .updatePage({ pageId: pageId }, JSON.stringify({ title: pageTitle, description: pageDescription }));
        }

        function searchQuestions(query, limit, offset) {
            return $resource(host + '/library/questions/search', {}, { 'searchQuestions': { method: 'POST' } })
                .searchQuestions({}, JSON.stringify({
                    query: query,
                    limit: limit,
                    offset: offset
                }));
        }

        function deleteQuestion(questionId) {
            return $resource(host + '/library/questions/:questionId', { questionId: '@questionId' }, { 'deleteQuestion': { method: 'DELETE' } })
                .deleteQuestion({
                    questionId: questionId
                });
        }

        function duplicateQuestion(questionId) {
            return $resource(host + '/library/questions/:questionId/duplicate', { questionId: '@questionId' }, { 'duplicateQuestion': { method: 'POST' } })
                .duplicateQuestion({
                    questionId: questionId
                });
        }

        function updateQuestion(questionId, newTitle, newDescription) {
            return $resource(host + '/library/questions/:questionId', { questionId: '@questionId' }, { 'updateQuestion': { method: 'PUT' } })
                .updateQuestion({ questionId: questionId }, JSON.stringify({ title: newTitle, description: newDescription }));
        }
    }
})();