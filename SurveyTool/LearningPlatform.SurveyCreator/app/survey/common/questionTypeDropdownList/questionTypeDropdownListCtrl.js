(function () {
    angular.module('svt').controller('questionTypeDropdownListCtrl', questionTypeDropdownListCtrl);

    questionTypeDropdownListCtrl.$inject = ['$scope', '$timeout', 'stringUtilSvc', 'questionTypeSvc', 'questionConst'];

    function questionTypeDropdownListCtrl($scope, $timeout, stringUtilSvc, questionTypeSvc, questionConst) {
        var vm = this;

        vm.questionTypes = questionConst.questionTypes;
        vm.defaultText = 'Select question type';
        vm.onItemChanged = onItemChanged;
        vm.itemSeleted = $scope.ngModal;
        vm.isDisabled = $scope.isDisabled;
        vm.getQuestionTypeText = getQuestionTypeText;
        vm.displayedCharacterNumber = 40;

        init();

        function init() {
            if (!vm.itemSeleted) {
                vm.itemSeleted = vm.questionTypes.shortText;
            }
            $scope.$on('questionTypeChange', function (event, type) {
                onItemChanged(type);
            });
        }

        function getQuestionTypeText(questionTypeKey) {
            return questionTypeSvc.getNameQuestionType(questionTypeKey);
        }

        function onItemChanged(questionTypeKey) {
            vm.itemSeleted = questionTypeKey;
            $scope.ngModal = questionTypeKey;
            $timeout(function () {
                $scope.onItemChanged();
            }, 0);
        }
    }
})();