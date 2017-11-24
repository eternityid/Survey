(function () {
    angular.module('svt').controller('dateQuestionCtrl', DateQuestionCtrl);
    DateQuestionCtrl.$inject = ['$scope', 'questionConst'];

    function DateQuestionCtrl($scope, questionConst) {
        var vm = this,
            questionTypes = questionConst.questionTypes;

    }
})();