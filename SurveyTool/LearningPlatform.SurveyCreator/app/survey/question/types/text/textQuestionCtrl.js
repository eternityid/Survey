(function () {
    angular.module('svt').controller('textQuestionCtrl', TextQuestionCtrl);
    TextQuestionCtrl.$inject = ['$scope', 'questionConst'];

    function TextQuestionCtrl($scope, questionConst) {
        var vm = this,
            questionTypes = questionConst.questionTypes;

        vm.isLongText = isLongText;

        function isLongText() {
            return $scope.question.$type === questionTypes.longText;
        }
    }
})();