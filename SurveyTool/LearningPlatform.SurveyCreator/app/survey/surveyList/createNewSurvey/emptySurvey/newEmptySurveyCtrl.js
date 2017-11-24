(function () {
    angular
        .module('svt')
        .controller('newEmptySurveyCtrl', NewEmptySurveyCtrl);

    NewEmptySurveyCtrl.$inject = [
        '$scope', 'createNewSurveySvc'
    ];

    function NewEmptySurveyCtrl(
        $scope, createNewSurveySvc
        ) {
        var vm = this;
        vm.surveyTitle = $scope.surveyTitle ? $scope.surveyTitle : '';

        vm.onEnterTitle = onEnterTitle;

        init();

        function init() {
            $scope.$on('event:DoneCreateNewSurvey', function (event, callBack) {
                callBack(createNewSurveySvc.validateNewSurvey({
                    surveyTitle: vm.surveyTitle
                }), {
                    surveyTitle: vm.surveyTitle
                });
            });
        }

        function onEnterTitle() {
            $scope.$parent.$parent.defaultTabsValue.empty.title = vm.surveyTitle;
        }
    }
})();