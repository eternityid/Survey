(function () {
    angular.module('svt').controller('informationEditorCtrl', InformationEditorCtrl);

    InformationEditorCtrl.$inject = ['$scope', 'questionPreviewerSvc', 'surveyEditorPageSvc'];

    function InformationEditorCtrl($scope, questionPreviewerSvc, surveyEditorPageSvc) {
        var vm = this;

        init();

        function init() {
            $scope.question.advancedSettings.isShowRequired = false;
            if (surveyEditorPageSvc.isThankYouPageById($scope.question.pageId)) {
                $scope.question.advancedSettings.isShowKeepFixedPosition = false;
                $scope.question.advancedSettings.isShowAlwaysHidden = false;
            }
            questionPreviewerSvc.addReloadCommand($scope.question);

            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                callBack({ valid: true, message: '' });
            });
        }
    }
})();