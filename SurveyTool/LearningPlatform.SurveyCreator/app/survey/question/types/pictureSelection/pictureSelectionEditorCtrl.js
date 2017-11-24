(function () {
    angular
        .module('svt')
        .controller('pictureSelectionEditorCtrl', PictureSelectionEditorCtrl);

    PictureSelectionEditorCtrl.$inject = [
        '$scope', 'arrayUtilSvc', 'guidUtilSvc',
        'pictureOptionListSvc', 'questionPreviewerSvc'
    ];

    function PictureSelectionEditorCtrl(
        $scope, arrayUtilSvc, guidUtilSvc,
        pictureOptionListSvc, questionPreviewerSvc) {
        var vm = this;

        vm.openningOption = { guid: null };

        init();

        function init() {
            if (!$scope.question.optionList || !arrayUtilSvc.isArrayHasElement($scope.question.optionList.options)) {
                $scope.question.optionList = {
                    $type: 'OptionList',
                    surveyId: $scope.question.surveyId,
                    options: pictureOptionListSvc.buildDefaultOptions($scope.question.surveyId),
                    optionGroups: []
                };
            } else {
                $scope.question.optionList.options.forEach(function(option) {
                    if (!option.picture) {
                        option.picture = {};
                    }
                });
            }

            if (!$scope.question.hasOwnProperty('isPictureShowLabel')) $scope.question.isPictureShowLabel = true;
            if (!$scope.question.hasOwnProperty('isScalePictureToFitContainer')) $scope.question.isScalePictureToFitContainer = false;
            if (!$scope.question.maxPicturesInGrid) $scope.question.maxPicturesInGrid = 2;
            if (!$scope.question.orderType) $scope.question.orderType = 0;
            $scope.question.advancedSettings.maxPictureOptions = getMaxPictureOptions();

            setupGuidForOptions();
            $scope.question.advancedSettings.isShowPictureSetting = true;
            questionPreviewerSvc.addReloadCommand($scope.question);
            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                var validationResult = pictureOptionListSvc.validateOptions($scope.question.optionList.options);
                if (validationResult.valid === false) {
                    vm.openningOption.guid = validationResult.optionGuid;
                }
                callBack(validationResult);
            });

            function getMaxPictureOptions() {
                return [{ value: 1, text: '1' }, { value: 2, text: '2' }, { value: 3, text: '3' }, { value: 4, text: '4' }, { value: 6, text: '6' }];
            }
        }

        function setupGuidForOptions() {
            $scope.question.optionList.options.forEach(function (option) {
                if (!option.guid) option.guid = 'Option' + guidUtilSvc.createGuid();
            });
        }
    }
})();