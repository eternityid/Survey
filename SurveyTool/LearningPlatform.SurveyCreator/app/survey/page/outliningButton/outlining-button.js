(function () {
    'use strict';
    angular
        .module('svt')
        .directive('outliningButton', OutliningButton);
    function OutliningButton() {
        var directive = {
            restrict: 'E',
            scope: {
                collapseQuestions: '&',
                expandQuestions: '&'
            },
            templateUrl: 'survey/page/outliningButton/outlining-button.html',
            link: function (scope, element) {
                var isFirstClick = true;
                var $dropDownBtn = element.find('.outlining-page__dropdown-btn');
                scope.onOutliningClick = onOutliningClick;
                scope.onOptionClick = onOptionClick;
                
                function onOutliningClick(event) {
                    event.stopPropagation();
                    if (isFirstClick) {
                        $dropDownBtn.dropdown('toggle');
                        isFirstClick = false;
                    } else {
                        $dropDownBtn.dropdown();
                    }
                }

                function onOptionClick(event) {
                    event.stopPropagation();
                    $dropDownBtn.dropdown('toggle');                    
                }
            }
        };

        return directive;
    }
})();