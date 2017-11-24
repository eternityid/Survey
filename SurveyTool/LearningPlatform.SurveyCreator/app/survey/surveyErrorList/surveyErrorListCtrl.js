(function () {
    angular
        .module('svt')
        .controller('surveyErrorListCtrl', SurveyErrorListCtrl);

    SurveyErrorListCtrl.$inject = [
        '$scope', 'surveyErrorListSvc', 'surveyContentValidation',
        'surveyErrorConst', 'questionSvc', '$window'];

    function SurveyErrorListCtrl(
        $scope, surveyErrorListSvc, surveyContentValidation,
        surveyErrorConst, questionSvc, $window) {
        var ERROR_TYPES = surveyErrorConst.errorTypes;
        var vm = this;
        vm.getDisplayErrorMessage = surveyErrorListSvc.getDisplayErrorMessage;
        vm.goToSourceError = goToSourceError;
        vm.removeErrorMessage = removeErrorMessage;

        init();

        function init() {
            $scope.$on('$destroy', function () {
                surveyContentValidation.resetGeneralErrors();
            });

            vm.generalErrors = surveyContentValidation.generalErrors;
        }

        function goToSourceError(error) {
            switch (error.type) {
                case ERROR_TYPES.carryOver:
                case ERROR_TYPES.displayLogic:
                case ERROR_TYPES.optionsMask:
                    questionSvc.setActiveQuestion(error.questionId);
                    scrollToItem('question-' + error.questionId);
                    break;
                case ERROR_TYPES.skipAction:
                    questionSvc.setActiveQuestion(error.skipClientId);
                    scrollToItem('skip-' + error.skipClientId);
                    break;
                default:
                    break;
            }
        }

        function scrollToItem(anchorId) {
            var divElement = angular.element(document).find('#' + anchorId);
            angular.element('html,body').animate({
                scrollTop: divElement.offset().top - ($window.innerHeight / 2) + (divElement.innerHeight() / 2)
            }, 'slow');
        }

        function removeErrorMessage(guid) {
            if (!$scope.messages || $scope.messages.length <= 0) return;

            for (var i = 0; i < $scope.messages.length; i++) {
                var message = $scope.messages[i];
                if (message.guid === guid) {
                    $scope.messages.splice(i, 1);
                }
            }
        }

    }
})();