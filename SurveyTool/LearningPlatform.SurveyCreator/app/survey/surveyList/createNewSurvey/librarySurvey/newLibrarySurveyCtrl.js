(function () {
    angular
        .module('svt')
        .controller('newLibrarySurveyCtrl', NewLibrarySurveyCtrl);

    NewLibrarySurveyCtrl.$inject = [
        '$scope', 'createNewSurveySvc', 'libraryDataSvc',
        'errorHandlingSvc', '$modal'
    ];

    function NewLibrarySurveyCtrl(
        $scope, createNewSurveySvc, libraryDataSvc,
        errorHandlingSvc, $modal
        ) {
        var vm = this;
        vm.librarySurveyName = 'Select a survey';
        vm.surveyTitle = '';

        vm.selectSurvey = selectSurvey;
        vm.onEnterTitle = onEnterTitle;

        init();

        function init() {
            loadLibrarySurveys();

            if ($scope.selectedSurvey) {
                vm.librarySurveyName = $scope.selectedSurvey.title;
                vm.librarySurveyId = $scope.selectedSurvey.id;
                vm.libraryId = $scope.selectedSurvey.libraryId;
            }

            if ($scope.newSurveyCurrentName !== '') vm.surveyTitle = $scope.newSurveyCurrentName;

            $scope.$on('event:DoneCreateNewSurvey', function (event, callBack) {
                callBack(createNewSurveySvc.validateNewSurvey({
                    surveyTitle: vm.surveyTitle,
                    librarySurveyId: vm.librarySurveyId
                }), {
                    surveyTitle: vm.surveyTitle,
                    librarySurveyId: vm.librarySurveyId,
                    libraryId: vm.libraryId
                });
            });
        }

        function loadLibrarySurveys() {
            libraryDataSvc.getSurveys().$promise.then(function (response) {
                vm.librarySurveys = response;
            }, function (error) {
                errorHandlingSvc.manifestError('Loading library surveys was not successful', error);
            });
        }

        function selectSurvey(survey) {
            vm.surveyTitle = 'Copy of ' + survey.title;
            vm.librarySurveyName = survey.title;
            vm.librarySurveyId = survey.id;
            vm.libraryId = survey.libraryId;

            $scope.$parent.$parent.defaultTabsValue.library.defaultSurvey = survey;
            $scope.$parent.$parent.defaultTabsValue.library.libraryId = survey.libraryId;
            $scope.$parent.$parent.defaultTabsValue.library.title = vm.surveyTitle;
        }

        function onEnterTitle() {
            $scope.$parent.$parent.defaultTabsValue.library.title = vm.surveyTitle;
        }
    }
})();