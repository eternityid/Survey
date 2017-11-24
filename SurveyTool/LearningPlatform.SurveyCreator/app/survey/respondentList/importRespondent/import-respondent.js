(function () {
    'use strict';

    angular
        .module('svt')
        .directive('importRespondent', importRespondent);

    function importRespondent() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                handleAfterSave: '&'
            },
            templateUrl: 'survey/respondentList/importRespondent/import-respondent.html',
            controller: 'importRespondentCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();