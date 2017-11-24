(function () {
    'use strict';

    angular
        .module('svt')
        .controller('editConditionDialogCtrl', previewDialogCtrl);

    previewDialogCtrl.$inject = ['$scope', '$modalInstance', 'modalData', 'expressionBuilderSvc'];

    function previewDialogCtrl($scope, $modalInstance, modalData, expressionBuilderSvc) {
        $scope.modalTitle = modalData.modalTitle || 'Conditionally display this question';
        $scope.question = modalData.question;
        $scope.okTitle = modalData.okTitle || 'Done';

        $scope.cancel = cancel;
        $scope.doneEditCondition = doneEditCondition;

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function doneEditCondition() {
            if (!validate($scope.question)) {
                toastr.error('Invalid data in display logic');
                return;
            }

            $modalInstance.close({
                status: true,
                question: $scope.question
            });
        }

        function validate(checkingData) {
            var questionMarkExpression = checkingData.questionMaskExpression;

            if (!questionMarkExpression ||
                !expressionBuilderSvc.validateExpression(questionMarkExpression)) return false;

            return true;
        }
    }
})();