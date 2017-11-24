(function () {
    angular
        .module('svt')
        .directive('questionPreviewer', questionPreviewer);

    function questionPreviewer() {
        var directive = {
            restrict: 'E',
            scope: {},
            templateUrl: 'survey/question/questionPreviewer/question-previewer.html',
            controller: 'questionPreviewerCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();