(function () {
    'use strict';

    angular
        .module('svt')
        .directive('addRespondent', addRespondent);

    function addRespondent() {
        var directive = {
            restrict: 'E',
            scope: {
                surveyId: '@',
                handleAfterSave: '&'
            },
            templateUrl: 'survey/respondentList/addRespondent/add-respondent.html',
            controller: 'addRespondentCtrl',
            controllerAs: 'vm',
            link: link
        };

        return directive;

        function link(scope) {
            scope.highlightEmailAddressesContainer = highlightEmailAddressesContainer;

            function highlightEmailAddressesContainer(emailAddressesContainer, emailAddressesSearchContainer) {
                if (emailAddressesContainer) emailAddressesContainer.addClass('input-required');
                if (emailAddressesSearchContainer) emailAddressesSearchContainer.addClass('input-required');
            }
        }
    }
})();