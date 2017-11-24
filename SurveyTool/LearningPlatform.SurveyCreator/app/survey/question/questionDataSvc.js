(function () {
    'use strict';

    angular
        .module('svt')
        .factory('questionDataSvc', questionDataSvc);

    questionDataSvc.$inject = ['$resource', 'host'];

    function questionDataSvc($resource, host) {
        var dataService = {
            getAllById: getAllById,
            getById: getById,
            addNew: addNew,
            updateById: updateById,
            deleteById: deleteById,
            moveQuestion: moveQuestion
        };

        return dataService;

        function getAllById(surveyId, pageId) {
            return $resource(host + '/surveys/:surveyId/pages/:pageId/questions', { surveyId: '@surveyId', pageId: '@pageId' }, { 'GetAllById': { method: 'GET', isArray: true } })
                .GetAllById({ surveyId: surveyId, pageId: pageId });
        }

        function getById(surveyId, questionId) {
            return $resource(host + '/surveys/:surveyId/questions/:questionId', { surveyId: '@surveyId', questionId: '@questionId' }, { 'GetById': { method: 'GET', isArray: false } })
                .GetById({ surveyId: surveyId, questionId: questionId });
        }

        function getQuestionViewModel(question) {
            var pictureOptions = [];

            if (question.$type === 'PictureSingleSelectionQuestionDefinition' || question.$type === 'PictureMultipleSelectionQuestionDefinition') {
                question.optionList.options.forEach(function (o) {
                    if (o.picture) {
                        pictureOptions.push(o.picture);
                        delete o.picture;
                    }
                });
            }

            return pictureOptions.length !== 0 ? { question: question, pictureOptions: pictureOptions } : { question: question };
        }

        function addNew(question, questionIndex, pageId, pageVersion) {
            var questionViewModel = getQuestionViewModel(question);
            questionViewModel.questionIndex = questionIndex;
            return $resource(host + '/surveys/:surveyId/pages/:pageId/questions', { surveyId: '@surveyId', pageId: '@pageId' }, { 'AddNew': { method: 'POST', transformResponse: transformResponse, headers: { 'If-Match': pageVersion } } })
                .AddNew({ surveyId: question.surveyId, pageId: pageId }, JSON.stringify(questionViewModel));
        }

        function updateById(surveyId, pageId, question) {
            var etag = "";//'\"' + question.rowVersion.$value + '\"';
            return $resource(host + '/surveys/:surveyId/pages/:pageId/questions/:questionId', { surveyId: '@surveyId', pageId: '@pageId', questionId: '@questionId' }, { 'EditById': { method: 'PUT', transformResponse: transformResponse, headers: { 'If-Match': question.version } } })
                .EditById({ surveyId: surveyId, pageId: pageId, questionId: question.id }, JSON.stringify(getQuestionViewModel(question)));
        }

        function deleteById(surveyId, pageId, question, pageVersion) {
            return $resource(host + '/surveys/:surveyId/pages/:pageId/questions/:questionId', { surveyId: '@surveyId', pageId: '@pageId', questionId: '@questionId' }, { 'DeleteById': { method: 'DELETE', transformResponse: transformResponse, headers: { 'If-Match': pageVersion } } })
                .DeleteById({ surveyId: surveyId, pageId: pageId, questionId: question.id });
        }

        function moveQuestion(movingQuestion, pageVersion) {
            return $resource(host + '/surveys/:surveyId/pages/:pageId/questions/:questionId/move',
                { surveyId: '@surveyId', pageId: '@pageId', questionId: '@questionId' },
                { 'MoveQuestions': { method: 'POST', transformResponse: transformResponse, headers: { 'If-Match': pageVersion } } })
                .MoveQuestions({ surveyId: movingQuestion.surveyId, pageId: movingQuestion.departurePageId, questionId: movingQuestion.questionId }, JSON.stringify({
                    destinationPageId: movingQuestion.destinationPageId,
                    destinationPageEtag: movingQuestion.destinationPageVersion,
                    newQuestionIndex: movingQuestion.newIndexPosition
                }));
        }

        function transformResponse(data, headerGetters) {
            return {
                data: data,
                headers: headerGetters()
            };
        }
    }
})();