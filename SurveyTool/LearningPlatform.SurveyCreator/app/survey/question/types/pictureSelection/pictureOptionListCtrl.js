(function () {
    angular
        .module('svt')
        .controller('pictureOptionListCtrl', PictureOptionListCtrl);

    PictureOptionListCtrl.$inject = [
        '$scope', '$timeout', 'settingConst',
        'pictureOptionListSvc', 'questionPreviewerSvc', 'domUtilSvc'
    ];

    function PictureOptionListCtrl(
        $scope, $timeout, settingConst,
        pictureOptionListSvc, questionPreviewerSvc, domUtilSvc) {
        /* jshint -W040 */
        var vm = this;

        var isTopic = false;
        vm.options = $scope.options;
        vm.sortableOptions = {
            itemMoved: function () { },
            orderChanged: function () {
                questionPreviewerSvc.addReloadCommand($scope.question);
            },
            containment: 'body',
            accept: function (sourceItemHandleScope, sortableScope) {
                return sourceItemHandleScope.itemScope.option &&
                       sourceItemHandleScope.itemScope.$parent.$id === sortableScope.$id;
            }
        };
        vm.maximumOfOptions = settingConst.picture.maxOption;

        vm.isOverloadedOptions = isOverloadedOptions;
        vm.addOption = addOption;
        vm.onKeyDownOnOptionAliasField = onKeyDownOnOptionAliasField;

        function addOption() {
            if (vm.options.length === vm.maximumOfOptions) {
                return;
            }

            var newOption = pictureOptionListSvc.buildNewOptionBasedOnExistedOptions($scope.question.surveyId, vm.options);
            vm.options.push(newOption);

            selectOptionAliasField(newOption.guid);
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function onKeyDownOnOptionAliasField($event, optionIndex) {
            var keyCode = $event.which;
            if (!(/^(9|13|38|40)$/g.test(keyCode))) return;

            var isPressedShiftKey = $event.shiftKey;
            var integerValueOfOptionIndex = parseInt(optionIndex);

            switch (keyCode) {
                case 38:
                    jumpToPreviousOption();
                    break;
                case 13:
                case 40:
                    jumpToNextOptionOrAddNewOption();
                    break;
                case 9:
                    if (isPressedShiftKey) {
                        jumpToPreviousOption();
                    } else {
                        jumpToNextOptionOrAddNewOption();
                    }
                    break;
            }

            function jumpToPreviousOption() {
                var previousOption = vm.options[integerValueOfOptionIndex - 1];
                if (previousOption) selectOptionAliasField(previousOption.guid);
            }

            function jumpToNextOptionOrAddNewOption() {
                var isLastOption = vm.options.length === (integerValueOfOptionIndex + 1);
                if (isLastOption) {
                    vm.addOption();
                } else {
                    var nextOption = vm.options[integerValueOfOptionIndex + 1];
                    //TODO: Please check logic for if condition here
                    if (nextOption) selectOptionAliasField(nextOption.guid);
                }
            }
        }

        function isOverloadedOptions() {
            return vm.options.length >= vm.maximumOfOptions;
        }

        function selectOptionAliasField(optionGuid) {
            $timeout(function () {
                domUtilSvc.selectElementContent(optionGuid);
            }, 0);
        }
    }
})();