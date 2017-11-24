(function () {
    'use strict';

    angular
        .module('svt')
        .directive('svtRespondentList', SvtRespondentList);

    function SvtRespondentList() {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/respondentList/respondent-list.html',
            controller: 'respondentListCtrl',
            controllerAs: 'vm',
            link: function ($scope, element) {
                setTimeout(function () {
                    var datePickerConfig = { autoclose: true, todayHighlight: true };
                    angular.element(document.querySelector('#respondent-last-sent-from-date')).datepicker(datePickerConfig);
                    angular.element(document.querySelector('#respondent-last-sent-to-date')).datepicker(datePickerConfig);
                    angular.element(document.querySelector('#respondent-completed-from-date')).datepicker(datePickerConfig);
                    angular.element(document.querySelector('#respondent-completed-to-date')).datepicker(datePickerConfig);
                }, 3000);
            }
        };

        return directive;
    }
})();