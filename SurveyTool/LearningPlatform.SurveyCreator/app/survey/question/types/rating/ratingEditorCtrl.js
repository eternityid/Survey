(function () {
    angular
        .module('svt')
        .controller('ratingEditorCtrl', RatingEditorCtrl);

    RatingEditorCtrl.$inject = [
        '$scope', 'ratingQuestionSvc', 'questionPreviewerSvc', 'questionWithOptionsSvc'
    ];

    function RatingEditorCtrl($scope, ratingQuestionSvc, questionPreviewerSvc, questionWithOptionsSvc) {
        /* jshint -W040 */
        var vm = this;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        var existedOptions = null;
        var starShape = {
            value: 'glyphicon glyphicon-star',
            displayName: 'Stars'
        };
        var heartShape = {
            value: 'glyphicon glyphicon-heart',
            displayName: 'Hearts'
        };

        vm.question = $scope.question;
        vm.shapes = [starShape, heartShape];
        vm.steps = ratingQuestionSvc.getSteps();
        vm.numberOfSteps = 5;

        vm.getDisplayNameShape = getDisplayNameShape;
        vm.onShapeChange = onShapeChange;
        vm.onStepChange = onStepChange;
        vm.init = init;

        init();

        function init() {
            if(!vm.question.shapeName){
                vm.question.shapeName = starShape.value;
            }
            if (vm.question.optionList) {
                existedOptions = angular.copy(vm.question.optionList.options);
            } else {
                vm.question.optionList = {
                    $type: 'OptionList',
                    surveyId: vm.question.surveyId,
                    options: ratingQuestionSvc.buildOptions(vm.question.surveyId, vm.numberOfSteps),
                    optionGroups: []
                };
            }

            vm.numberOfSteps = vm.question.optionList.options.length;

            if (!vm.question.hasOwnProperty('optionsMask'))
                vm.question.optionsMask = questionWithOptionsSvc.getDefaultOptionsMask();
            if (!vm.question.hasOwnProperty('displayOrientation'))
                vm.question.displayOrientation = questionWithOptionsSvc.getOptionDisplayOrientationValues().horizontal;

            questionPreviewerSvc.addReloadCommand(vm.question);

            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                callBack({ valid: true, message: '' });
            });
        }

        function getDisplayNameShape() {
            switch (vm.question.shapeName) {
                case starShape.value:
                    return starShape.displayName;
                case heartShape.value:
                    return heartShape.displayName;
                default:
                    return starShape.displayName;
            }
        }

        function onShapeChange(shape) {
            vm.question.shapeName = shape.value;
            addOrUpdateUpdatingCommand();
        }

        function onStepChange() {
            vm.question.optionList.options = existedOptions ?
                ratingQuestionSvc.buildOptionsBasedOnExistedOptions(vm.question.surveyId, vm.numberOfSteps, existedOptions) :
                ratingQuestionSvc.buildOptions(vm.question.surveyId, vm.numberOfSteps);

            addOrUpdateUpdatingCommand();
        }

        function addOrUpdateUpdatingCommand() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.rating.content, {
                shape: vm.question.shapeName,
                steps: vm.numberOfSteps
            });
        }
    }
})();