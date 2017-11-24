(function () {
    angular.module('svt').filter('questionTitleDescriptionFilter', QuestionTitleDescriptionFilter);

    function QuestionTitleDescriptionFilter() {
        return function (questions, searchTerm) {
            if (!questions || !searchTerm) return questions;
            var term = searchTerm.toLowerCase();
            return questions.filter(function (question) {
                return question.isChecked ||
                    question.title.items[0].text.toLowerCase().indexOf(term) >= 0 ||
                    question.description.items[0].text.toLowerCase().indexOf(term) >= 0 ||
                    question.alias.toLowerCase().indexOf(term) >= 0;
            });
        };
    }
})();