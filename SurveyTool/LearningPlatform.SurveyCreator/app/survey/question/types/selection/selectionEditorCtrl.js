(function () {
    angular
        .module('svt')
        .controller('selectionEditorCtrl', SelectionEditorCtrl);

    SelectionEditorCtrl.$inject = [
        '$scope', 'arrayUtilSvc', 'guidUtilSvc', 'selectionOptionListSvc',
        'questionPreviewerSvc', 'questionSvc', 'questionCarryOverSvc', 'selectionEditorSvc'
    ];

    function SelectionEditorCtrl(
        $scope, arrayUtilSvc, guidUtilSvc, selectionOptionListSvc,
        questionPreviewerSvc, questionSvc, questionCarryOverSvc, selectionEditorSvc) {
        /* jshint -W040 */
        var vm = this;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        vm.openningOption = { guid: null };
        vm.displayLogic = {
            isTopic: false,
            canBeAddedOtherQuestion: true,
            maximumOfOptions: null
        };

        vm.onOptionTitleChange = onOptionTitleChange;
        vm.onOptionGroupHeaderChange = onOptionGroupHeaderChange;

        init();

        function init() {
            if (!$scope.question.optionList || !arrayUtilSvc.isArrayHasElement($scope.question.optionList.options)) {
                $scope.question.optionList = {
                    $type: 'OptionList',
                    surveyId: $scope.question.surveyId,
                    options: selectionOptionListSvc.buildDefaultOptions($scope.question.surveyId, vm.displayLogic.isTopic),
                    optionGroups: []
                };
            }

            setupRender();
            setupGuidAndTypeForOptions();
            questionPreviewerSvc.addReloadCommand($scope.question);
            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                var validationResult = selectionEditorSvc.validate($scope.question);

                if (validationResult.valid === false && validationResult.hasOwnProperty('optionGuid')) {
                    vm.openningOption.guid = validationResult.optionGuid;
                }
                callBack(validationResult);
            });
        }

        function setupRender() {
            if (!$scope.question.displayOrientation) {
                $scope.question.displayOrientation = 0;
            }

            if (!$scope.question.orderType) {
                $scope.question.orderType = 0;
            }
            $scope.question.advancedSettings.isShowOptionSection = true;
            if (!$scope.question.hasOwnProperty('optionsMask'))
                $scope.question.optionsMask = questionSvc.getDefaultOptionsMask();
        }

        function setupGuidAndTypeForOptions() {
            $scope.question.optionList.options.forEach(function (option) {
                if (!option.guid) {
                    option.guid = 'Option' + guidUtilSvc.createGuid();
                }
                if (option.optionsMask && option.optionsMask.questionId) {
                    option.isCarryOverOption = true;
                }
            });
        }

        function onOptionTitleChange() {
            var expandOptions = questionCarryOverSvc.getExpandOptions($scope.question.id, $scope.question.optionList.options);
            var optionTitles = expandOptions.map(function (o) {
                return o.text.items[0].text;
            });

            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.simpleSelection.content, {
                optionTitles: optionTitles,
                displayOrientation: $scope.question.displayOrientation
            });
        }

        function onOptionGroupHeaderChange() {
            var realOptionHeaderTitles = selectionOptionListSvc.getRealOptionHeaderTitles($scope.question.optionList);
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.simpleOptionGroupHeader.content, {
                optionGroupHeaderTitles: realOptionHeaderTitles
            });
        }
    }
})();