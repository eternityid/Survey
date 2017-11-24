(function () {
    angular
        .module('svt')
        .controller('textEditorCtrl', TextEditorCtrl);

    TextEditorCtrl.$inject = ['$scope', 'settingConst', 'textQuestionSvc', 'questionPreviewerSvc'];

    function TextEditorCtrl($scope, settingConst, textQuestionSvc, questionPreviewerSvc) {
        var vm = this,
            questionTypes = settingConst.questionTypes;

        vm.isLongText = isLongText;

        init();

        function init() {
            if (vm.isLongText()) {
                var defaultRows = 4;
                $scope.question.rows = $scope.question.rows || defaultRows;
                $scope.question.advancedSettings.isShowSizeValidation = true;
            }
            $scope.question.advancedSettings.isShowLengthValidation = true;
            $scope.question.advancedSettings.isShowWordsAmountValidation = true;

            questionPreviewerSvc.addReloadCommand($scope.question);

            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                callBack(textQuestionSvc.validate($scope.question));
            });
        }

        function isLongText() {
            return $scope.question.$type === questionTypes.OpenEndedLongTextQuestionDefinition.value;
        }
    }
})();