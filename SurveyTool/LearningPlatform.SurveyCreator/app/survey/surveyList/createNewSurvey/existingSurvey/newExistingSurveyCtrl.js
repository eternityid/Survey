(function () {
    angular
        .module('svt')
        .controller('newExistingSurveyCtrl', NewExistingSurveyCtrl);

    NewExistingSurveyCtrl.$inject = [
        '$scope', 'createNewSurveySvc', 'surveyDataSvc',
        'errorHandlingSvc'
    ];

    function NewExistingSurveyCtrl(
        $scope, createNewSurveySvc, surveyDataSvc,
        errorHandlingSvc
        ) {
        var vm = this;
        vm.existingSurveyName = 'Select a survey';
        vm.surveyTitle = '';

        vm.selectSurvey = selectSurvey;
        vm.onEnterTitle = onEnterTitle;

        init();

        function init() {
            loadExistingSurveys();

            if ($scope.selectedSurvey) {
                vm.existingSurveyName = $scope.selectedSurvey.title;
                vm.surveyId = $scope.selectedSurvey.id;
            }

            if ($scope.newSurveyCurrentName !== '') vm.surveyTitle = $scope.newSurveyCurrentName;

            $scope.$on('event:DoneCreateNewSurvey', function (event, callBack) {
                callBack(createNewSurveySvc.validateNewSurvey({
                    surveyTitle: vm.surveyTitle,
                    existingSurveyId: vm.surveyId
                }), {
                    surveyTitle: vm.surveyTitle,
                    existingSurveyId: vm.surveyId
                });
            });
        }

        function loadExistingSurveys() {
            surveyDataSvc.getSurveyList().$promise.then(function (response) {
                vm.existingSurveys = response;
            }, function (error) {
                errorHandlingSvc.manifestError('Loading surveys was not successful', error);
            });
        }

        function selectSurvey(survey) {
            vm.surveyTitle = 'Copy of ' + survey.title;
            vm.existingSurveyName = survey.title;
            vm.surveyId = survey.id;

            $scope.$parent.$parent.defaultTabsValue.existing.defaultSurvey = survey;
            $scope.$parent.$parent.defaultTabsValue.existing.title = vm.surveyTitle;
        }

        function onEnterTitle() {
            $scope.$parent.$parent.defaultTabsValue.existing.title = vm.surveyTitle;
        }
    }
})();