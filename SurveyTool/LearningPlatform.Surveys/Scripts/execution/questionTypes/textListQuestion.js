var TextListQuestion = (function () {
    return {
        createTabButtonAreaForInputs: createTabButtonAreaForInputs
    };

    function createTabButtonAreaForInputs(question) {
        var hasTabButton = question.questionElement.has(".tab-button").length;
        if (hasTabButton) return;

        question.options.forEach(function (option, index) {
            var tabButton = buildTabButton();
            var isLastOption = index === (question.options.length - 1);
            if (!isLastOption) {
                option.optionElement.parentElement.append(tabButton);
            }
        });
        return;

        function buildTabButton() {
            var tabButtonTitle = 'Click or press TAB to go next';
            var tabButton = document.createElement('span');
            tabButton.setAttribute('class', 'tab-button');
            tabButton.setAttribute('title', tabButtonTitle);
            tabButton.innerHTML = 'TAB <span class="tab-button__arrow">↓</span>';
            tabButton.addEventListener('click', function (event) {
                var isAutoSelectOption = false;
                GridQuestionNavigationDesktop.goToNextOptionInTextListOrQuestion(IndexModule.selectedQuestion.selectedOptionId, isAutoSelectOption);
            })
            return tabButton;
        }
    }
})();