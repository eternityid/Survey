(function() {
    'use strict';
    angular
        .module('svt')
        .controller('pictureOptionCtrl', PictureOptionCtrl);

    PictureOptionCtrl.$inject = [
        '$scope', 'questionPreviewerSvc', 'pictureOptionListSvc', 'questionEditorSvc',
        'surveyEditorSvc', '$modal', 'fileLibraryConstants', 'settingConst'
    ];

    function PictureOptionCtrl(
        $scope, questionPreviewerSvc, pictureOptionListSvc, questionEditorSvc,
        surveyEditorSvc, $modal, fileLibraryConstants, settingConst) {
        /* jshint -W040 */
        var vm = this;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey && survey.customColumns;

        vm.option = $scope.options[$scope.index];
        vm.placeholderRespondentItems = surveyEditorSvc.getSvtPlaceholderRespondentItems(customColumns);
        vm.ckeditorConfig = {
            extraPlugins: 'sourcedialog,svtinserthelper,svtquestionplaceholder,svtrespondentplaceholder',
            oneLineMode: true,
            toolbarType: 'option-short',
            svtData: {
                placeholderQuestionItems: questionEditorSvc.getSvtPlaceholderQuestionItems(),
                placeholderRespondentItems: vm.placeholderRespondentItems
            }
        };

        vm.isOpenning = isOpenning;
        vm.canBeDeleted = canBeDeleted;
        vm.onClickToggleIcon = onClickToggleIcon;
        vm.onPictureChange = onPictureChange;
        vm.getOriginPictureName = getOriginPictureName;
        vm.onRemoveOption = onRemoveOption;
        vm.onOptionTitleChange = onOptionTitleChange;
        vm.onOptionAliasChange = onOptionAliasChange;
        vm.pickImage = pickImage;

        function isOpenning() {
            return vm.option.guid === $scope.openningOption.guid;
        }

        function canBeDeleted() {
            return $scope.options.length > 1;
        }

        function onClickToggleIcon() {
            $scope.openningOption.guid = vm.isOpenning() ? null : vm.option.guid;
        }

        function onPictureChange(blob) {
            vm.option.pictureName = blob.uri.replace(settingConst.surveyPictureBaseAzurePath + '/', '');
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function getOriginPictureName() {
            return vm.option.pictureName && vm.option.pictureName.indexOf('_') > 0 ?
                vm.option.pictureName.substring(vm.option.pictureName.indexOf('_') + 1) : '';
        }

        function onOptionTitleChange() {
            var optionTitles = $scope.question.optionList.options.map(function (o) {
                return o.text.items[0].text;
            });
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.pictureSelection.content, optionTitles);
            var optionTitlesValidationResult = pictureOptionListSvc.validateOptionTitles($scope.question.optionList.options);
            if (optionTitlesValidationResult.valid === true) {
                if (optionTitlesValidationResult.message) toastr.warning(optionTitlesValidationResult.message);
            } else {
                toastr.error(optionTitlesValidationResult.message);
            }
        }

        function onOptionAliasChange() {
            var optionAliasesValidationResult = pictureOptionListSvc.validateOptionAliases($scope.question.optionList.options);
            if (optionAliasesValidationResult.valid === false) {
                toastr.error(optionAliasesValidationResult.message);
            }
        }

        function onRemoveOption() {
            $scope.options.splice($scope.index, 1);
            questionPreviewerSvc.addReloadCommand($scope.question);
        }

        function pickImage() {
            $modal.open({
                templateUrl: 'survey/fileLibrary/pickerUploader/file-library-picker-uploader-dialog.html',
                controller: 'fileLibraryPickerUploaderDialogCtrl as vm',
                size: 'lg',
                windowClass: 'center-modal file-library',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        var fileConfig = {
                            config: {
                                maxFileSize: 500 * 1024,
                                acceptMimeTypes: fileLibraryConstants.IMAGE_MIME_TYPES,
                                allowChangeImageDimension: !fileLibraryConstants.ALLOW_CHANGE_IMAGE_DIMENSION
                            },
                            imageUrl: vm.option.pictureName ? settingConst.surveyPictureBaseAzurePath + '/' + vm.option.pictureName : null
                        };
                        return fileConfig;
                    }
                }
            }).result.then(function (blob) {
                if (!blob) return;
                onPictureChange(blob);
            });
        }
    }
})();