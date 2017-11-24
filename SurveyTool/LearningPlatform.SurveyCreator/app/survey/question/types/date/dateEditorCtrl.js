(function () {
    angular
        .module('svt')
        .controller('dateEditorCtrl', DateEditorCtrl);

    DateEditorCtrl.$inject = ['$scope', 'questionPreviewerSvc'];

    function DateEditorCtrl($scope, questionPreviewerSvc) {
        var vm = this;

        init();

        function init() {
            questionPreviewerSvc.addReloadCommand($scope.question);

            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                callBack({
                    valid: true,
                    message: ''
                });
            });
        }
    }
})();