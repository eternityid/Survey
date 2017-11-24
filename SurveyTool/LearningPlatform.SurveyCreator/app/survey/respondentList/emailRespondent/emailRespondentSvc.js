(function() {
    angular.module('svt').service('emailRespondentSvc', emailRespondentSvc);

    emailRespondentSvc.$inject = ['stringUtilSvc'];

    function emailRespondentSvc(stringUtilSvc) {

        var service = {
            getEmailMessage: getEmailMessage,
            getPlaceHolders: getPlaceHolders,
            validateEmail: validateEmail,
            getSendRespondentForm: getSendRespondentForm
        };
        return service;

        function getEmailMessage(numberOfRespondents) {
            return {
                emailAddress: numberOfRespondents + ' respondent(s) that match the filter',
                subject: 'Survey Invitation',
                content: '<p>We\'re conducting a survey and your input would be appreciated. Click the button below to start the survey. Thank you for your participation!</p><p><a href="{{surveyLink}}">Click here to take the survey</a></p>'
            };
        }

        function getPlaceHolders() {
            return {
                subject: {
                    value: 'Subject',
                    valid: true
                },
                content: {
                    value: 'Message',
                    valid: true
                }
            };
        }

        function validateEmail(emailMessage, placeHolders) {
            if (stringUtilSvc.isEmpty(emailMessage.subject)) {
                placeHolders.subject.value = 'Subject is required';
                placeHolders.subject.valid = false;
            } else {
                placeHolders.subject.value = '';
                placeHolders.subject.valid = true;
            }

            if (stringUtilSvc.isEmpty(emailMessage.content)) {
                placeHolders.content.value = 'Message is required';
                placeHolders.content.valid = false;
            } else {
                if (validContentSurveyLink(emailMessage.content)) {
                    placeHolders.content.value = '';
                    placeHolders.content.valid = true;
                }
                else {
                    placeHolders.content.valid = false;
                    placeHolders.content.value = 'Incorrect survey link. PLease check it again!';
                }
            }
            return placeHolders.subject.valid && placeHolders.content.valid;
        }

        function validContentSurveyLink(content) {
            var validPlaceHolders = ['{{surveylink}}'];
            var condition = /href=["']({{.*?}})["']/g;
            var matchedParts = content.match(condition);
            if (!matchedParts) return true;

            return matchedParts.every(function (part) {
                return validPlaceHolders.every(function (placeholder) {
                    return part && part.toLowerCase().indexOf(placeholder) >= 0;
                });
            });
        }

        function getSendRespondentForm(emailMessage, searchModel) {
            var searchModelCopy = angular.copy(searchModel);
            searchModelCopy.numberSent = searchModel.numberSent.numberFrom;
            searchModelCopy.numberSentTo = searchModel.numberSent.numberTo;
            searchModelCopy.numberSentOperator = searchModel.numberSent.conditionOperator;
            searchModelCopy.lastTimeSentOperator = searchModel.lastTimeSent.conditionOperator;
            searchModelCopy.lastTimeSent = searchModel.lastTimeSent.datetimeFrom;
            searchModelCopy.lastTimeSentTo = searchModel.lastTimeSent.datetimeTo;
            searchModelCopy.completedTimeSentOperator = searchModel.completedTimeSent.datetimeFrom;
            searchModelCopy.completedTimeSent = searchModel.completedTimeSent.conditionOperator;
            searchModelCopy.completedTimeSentTo = searchModel.completedTimeSent.datetimeTo;

            return {
                type$: "LearningPlatform.Models.SendRespondentForm, LearningPlatform.Api",
                searchModel: searchModelCopy,
                subject: emailMessage.subject,
                content: emailMessage.content
            };
        }
    }
})();