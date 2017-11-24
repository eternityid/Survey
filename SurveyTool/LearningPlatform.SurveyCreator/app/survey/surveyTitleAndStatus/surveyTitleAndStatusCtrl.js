(function () {
    angular
        .module('svt')
        .controller('surveyTitleAndStatusCtrl', surveyTitleAndStatusCtrl);

    surveyTitleAndStatusCtrl.$inject = ['$scope', 'surveySvc', 'surveyDataSvc', 'stringUtilSvc', 'errorHandlingSvc',
        'surveyTitleAndStatusSvc'];

    function surveyTitleAndStatusCtrl($scope, surveySvc, surveyDataSvc, stringUtilSvc, errorHandlingSvc,
        surveyTitleAndStatusSvc) {
        var vm = this;

        vm.surveyId = $scope.surveyId;
        vm.surveyStatuses = surveySvc.surveyStatus;
        vm.titleAndStatus = {};
        vm.settings = surveyTitleAndStatusSvc.getSettings();

        vm.truncateNumberOfWord = 7;
        vm.appendValue = '...';

        vm.setupTitleAndStatus = setupTitleAndStatus;

        init();

        function init() {
            $scope.$watch('vm.settings.latestChangedTimestamp', function () {
                vm.setupTitleAndStatus();
            });
        }

        function setupTitleAndStatus() {
            surveyDataSvc.getSurveyInfo(vm.surveyId).$promise.then(function (response) {
                vm.titleAndStatus.statusCode = response.surveyStatus;
                vm.titleAndStatus.title = stringUtilSvc.truncateByWordAmount(response.name, vm.truncateNumberOfWord, vm.appendValue);
                vm.titleAndStatus.status = surveySvc.getStatusDisplay(response.surveyStatus);
            }, function (error) {
                errorHandlingSvc.manifestError('Loading survey info was not successful.', error);
            });
        }

    }
})();