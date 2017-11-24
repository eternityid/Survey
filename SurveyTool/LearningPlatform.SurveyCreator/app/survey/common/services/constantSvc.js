(function() {
    'use strict';

    angular
        .module('svt')
        .service('constantSvc', constantSvc);

    function constantSvc() {
        var messages = {
            deletePage: 'All questions in this page will be deleted too! Are you sure you want to delete it?',
            deleteReportPage: 'All items in this page will be deleted too! Are you sure you want to delete it?',
            deleteReportElement: 'Are you sure you want to delete this element?',
            deleteQuestion: 'Are you sure you want to delete this question?',
            deleteSurvey: 'Do you want to delete survey ',
            publishSurvey: 'Do you want to publish this survey?',
            deleteUser: 'Are you sure you want to delete the user(s)?',
            deleteRespondent: 'Are you sure you want to delete the respondent(s)?',
            cancelCreatingQuestion: 'Do you want to cancel creating new question?',
            cancelEditingQuestion: 'You have made some changes. Do you want to discard the changes?',
            cancelCreatingSkipAction: 'Do you want to cancel creating new skip action?',
            cancelEditingSkipAction: 'You have made some changes. Do you want to discard the changes?'
        };

        var service = {
            messages: messages
        };

        return service;
    }
})();