(function () {
    'use strict';

    angular
        .module('svt')
        .directive('addButton', AddButton);
    AddButton.$inject = ['$document', 'surveyEditorSvc'];
    function AddButton($document, surveyEditorSvc) {
        var directive = {
            restrict: 'E',
            scope: {
                pageObj: '=',
                pageCtrl: '='
            },
            templateUrl: 'survey/page/addButton/add-button.html',
            link: function (scope, element, attributes, ctrl) {
                var isFirstClick = true;
                var $dropDownBtn = element.find('.btn-add-question');

                scope.clickDropdown = function click(event) {
                    event.stopPropagation();

                    surveyEditorSvc.setAddMenuVisible(true);
                    var documentHeight = $(document).innerHeight();
                    var $dropdownMenu = element.find('.dropdown-menu');

                    if (isFirstClick) {
                        $dropDownBtn.dropdown('toggle');
                        isFirstClick = false;
                    } else {
                        $dropDownBtn.dropdown();
                    }

                    var dropDownMenuOffset = $dropdownMenu.offset();

                    if ($dropdownMenu.height() + dropDownMenuOffset.top >= documentHeight) {
                        window.scroll(0, dropDownMenuOffset.top);
                    }

                    angular.element(angular.element(event.target).parent()).on("hidden.bs.dropdown", function (event) {
                        scope.$apply(function () {
                            surveyEditorSvc.setAddMenuVisible(false);
                        });
                    });
                };

                $('.add-btn-container').click(function () {
                    event.stopPropagation();
                });
            }
        };

        return directive;
    }
})();