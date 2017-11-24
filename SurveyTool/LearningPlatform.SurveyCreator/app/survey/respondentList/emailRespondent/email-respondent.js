(function () {
    'use strict';

    angular
        .module('svt')
        .directive('emailRespondent', emailRespondent);

    function emailRespondent() {
        var directive = {
            restrict: 'E',
            scope: {
                emailData: '=',
                handleAfterSend: '&'
            },
            templateUrl: 'survey/respondentList/emailRespondent/email-respondent.html',
            controller: 'emailRespondentCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();