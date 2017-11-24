(function () {
    'use strict';

    angular
        .module('svt')
        .controller('updateSurveyStatusDialogCtrl', updateSurveyStatusDialogCtrl);

    updateSurveyStatusDialogCtrl.$inject = ['$scope', '$modalInstance', 'message', 'title', 'type'];

    function updateSurveyStatusDialogCtrl($scope, $modalInstance, message, title, type) {
        $scope.title = title;
        $scope.message = message;
        $scope.type = type;
        $scope.status = {isTemporarilyClosed : false};
        $scope.update = update;
        $scope.cancel = cancel;

        function update(result) {
            $modalInstance.close({ status: result, isTemporarilyClosed: $scope.status.isTemporarilyClosed });
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();