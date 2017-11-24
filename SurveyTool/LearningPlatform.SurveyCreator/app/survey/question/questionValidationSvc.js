(function() {
    angular.module('svt').service('questionValidationSvc', questionValidationSvc);
    questionValidationSvc.$inject = [
        'settingConst', 'stringUtilSvc', 'surveyEditorSvc'
    ];

    function questionValidationSvc(
        settingConst, stringUtilSvc, surveyEditorSvc) {
        var service = {
            validateQuestionTitle: validateQuestionTitle,
            validateQuestionAlias: validateQuestionAlias,
            validateQuestionTitleAndAlias: validateQuestionTitleAndAlias
        };

        return service;

        function validateQuestionTitle(question) {
            var validationResult = {
                valid: true,
                message: ''
            };
            var acceptedHtmlTags = ['img', 'video'];
            var questionTitle = question.title.items[0].text;
            var isInvalidQuestionTitle = stringUtilSvc.isEmptyFromHtml(questionTitle) && !stringUtilSvc.haveAnyHtmlTagFrom(questionTitle, acceptedHtmlTags);
            if (isInvalidQuestionTitle) {
                validationResult.valid = false;
                validationResult.message = 'Question title is required.';
            }
            return validationResult;
        }

        function validateQuestionAlias(question) {
            var validationResult = {
                valid: true,
                message: ''
            };

            if (stringUtilSvc.isEmptyFromHtml(question.alias)) {
                validationResult.valid = false;
                validationResult.message = 'Question alias is required.';
                return validationResult;
            }

            if (stringUtilSvc.containsSpecialCharacters(question.alias)) {
                validationResult.valid = false;
                validationResult.message = 'Question alias cannot contains special characters.';
                return validationResult;
            }

            if (question.alias.length > settingConst.question.alias.maxlength) {
                validationResult.valid = false;
                validationResult.message = 'Maximum characters of question alias cannot over ' + settingConst.question.alias.maxlength + '.';
                return validationResult;
            }

            var questionsInSurvey = surveyEditorSvc.getQuestions();
            var questionHaveDuplicatedAlias = questionsInSurvey.some(function (q) {
                return q.id !== question.id && stringUtilSvc.isEquals(q.alias, question.alias);
            });
            if (questionHaveDuplicatedAlias) {
                validationResult.valid = false;
                validationResult.message = 'Question alias "' + question.alias + '" have already existed in survey.';
                return validationResult;
            }

            var optionGroups = [];

            if (question.optionList) {
                optionGroups = question.optionList.optionGroups.filter(function (group) {
                    return group.alias !== null;
                });

                optionGroups.forEach(function (item) {
                    if (!item.hideHeading && stringUtilSvc.isEmptyFromHtml(item.heading.items[0].text)) {
                        validationResult.valid = false;
                        validationResult.message = 'Option Group header is required.';
                        return validationResult;
                    }
                });
            }

            return validationResult;
        }

        function validateQuestionTitleAndAlias(question) {
            var questionTitleValidationResult = service.validateQuestionTitle(question);
            return questionTitleValidationResult.valid === false ? questionTitleValidationResult : service.validateQuestionAlias(question);
        }
    }
})();