(function () {
    'use trict';

    angular
        .module('svt')
        .controller('surveyLibraryManagementCtrl', surveyLibraryManagementCtrl);

    surveyLibraryManagementCtrl.$inject = [
        '$scope', 'surveyMenuSvc'
    ];

    function surveyLibraryManagementCtrl($scope, surveyMenuSvc) {
        var vm = this;

        vm.displayModes = {
            surveys: 'surveys',
            pages: 'pages',
            questions: 'questions'
        };
        vm.selectedDisplayMode = vm.displayModes.surveys;
        vm.surveysSearchTerm = '';
        vm.pagesSearchTerm = '';
        vm.questionsSearchTerm = '';

        vm.onSearchTermControlKeyPress = onSearchTermControlKeyPress;
        vm.broadcastSearchEvent = broadcastSearchEvent;

        init();

        function init() {
            surveyMenuSvc.updateMenuForSurveyLibrary();
        }

        function broadcastSearchEvent() {
            switch (vm.selectedDisplayMode) {
                case vm.displayModes.surveys:
                    $scope.$broadcast('event:surveyLibraryManagementOnSearch', function () { });
                    break;
                case vm.displayModes.pages:
                    $scope.$broadcast('event:pageLibraryManagementOnSearch', function () { });
                    break;
                case vm.displayModes.questions:
                    $scope.$broadcast('event:questionLibraryManagementOnSearch', function () { });
                    break;
                default:
                    break;
            }
        }

        function onSearchTermControlKeyPress(event) {
            var enterKeyCode = 13;
            if (event.keyCode === enterKeyCode) broadcastSearchEvent();
        }
    }
})();