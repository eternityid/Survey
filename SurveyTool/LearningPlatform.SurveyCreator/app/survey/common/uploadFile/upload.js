(function () {
    'use strict';

    angular
        .module('svt')
        .directive('upload', upload);

    upload.$inject = [
        'settingConst', 'uploadFileDataSvc', 'errorHandlingSvc', 'angularScopeUtilSvc',
        'fileUtilSvc', 'stringUtilSvc', 'fileStatus'
    ];

    function upload(settingConst, uploadFileDataSvc, errorHandlingSvc, angularScopeUtilSvc,
        fileUtilSvc, stringUtilSvc, fileStatus) {

        var fileSelector = 'input[type=file]';
        var invalidFileMessage = 'Invalid file';
        var nofileMessage = 'No file chosen';
        var invalidFileTypeMessage = 'File type must be ({0})';
        var invalidFileSizeMessage = 'Max file size is {0} KB';
        var defaultFileType = 'png,jpeg,jpg,gif,bmp';
        var defaultFileSize = settingConst.picture.maxFileSize;
        var maxlengthFileNameDisplay = 10;

        var css = {
            valid: 'uploader__message--valid',
            invalid: 'uploader__message--invalid'
        };

        return {
            restrict: "E",
            scope: {
                basic: '@',
                handler: '&',
                file: '=',
                hasTimestamp: '@',
                alwaysShowRemove: '=?',
                removeIf: '=?',
                accept: '@',
                type: '@',
                size: '@',
                removeHandler: '&',
                initDisplayedName: '@',
                deletedTitle: '@',
                initButtonTitle: '@',
                isUseToastrMessage: '@',
                isUseShortenFilename: '@',
                isUploadOnAzure: '@'
            },
            templateUrl: 'survey/common/uploadFile/upload.html',
            link: function (scope, element) {
                scope.openUploadFileDialog = openUploadFileDialog;
                scope.deleteFileUploadSelected = deleteFileUploadSelected;
                var isUseToastrMessage = stringUtilSvc.convertStringToBool(scope.isUseToastrMessage) || false;
                var isUseShortenFilename = stringUtilSvc.convertStringToBool(scope.isUseShortenFilename) || false;
                var isUploadOnAzure = stringUtilSvc.convertStringToBool(scope.isUploadOnAzure) || false;

                scope.$watch('file', function (newValue, oldValue) {
                    if (scope.file && scope.file.status === fileStatus.remove) return;
                    if (newValue && newValue !== oldValue) {
                        resetValueOnScope();
                    }
                });

                init();

                function init() {
                    resetValueOnScope();
                    initDisplayName();
                    initLabels();
                    onLoadFile();
                    if (scope.isDefault) return;
                }

                function initDisplayName() {
                    if (scope.initDisplayedName) {
                        scope.invalidFile = false;
                        scope.displayedName = getDisplayedName(scope.initDisplayedName) || '';
                    }
                }

                function initLabels() {
                    scope.buttonTitle = '...';

                    if (scope.initButtonTitle) {
                        scope.buttonTitle = scope.initButtonTitle;
                    }
                }

                function resetValueOnScope() {
                    //TODO wrong original file name when upload and delete in multiple times
                    //need to separate original file (stored in db) and previous file (by previous upload)
                    scope.orginalFile = scope.file ? angular.copy(scope.file) : null;
                    scope.fileType = scope.type || defaultFileType;
                    scope.fileSize = scope.size || defaultFileSize;
                    scope.invalidFile = true;
                    scope.message = nofileMessage;
                    scope.messageCss = css.valid;

                    if (scope.orginalFile && scope.orginalFile.name) {
                        scope.invalidFile = false;
                        scope.fileName = scope.orginalFile.name;
                        scope.displayedName = getDisplayedName(scope.orginalFile.name);
                    }
                    scope.isDefault = (scope.basic === undefined) || (scope.basic !== undefined && scope.basic === 'true');
                }

                function onLoadFile() {
                    element.change(function (event) {
                        var file = getSelectedFile();
                        if (file === null || file === undefined) return;
                        if (scope.isDefault) {
                            angularScopeUtilSvc.safeApply(scope, function () {
                                var params = { event: event, file: file };
                                scope.handler({ params: params });
                            });
                            return;
                        }

                        var validateFileMessage = fileValidation(file, scope.fileType, scope.fileSize);
                        if (validateFileMessage !== '') {
                            if (scope.file) scope.file.invalidSize = true;
                            scope.invalidFile = true;
                            scope.message = validateFileMessage;
                            scope.messageCss = css.invalid;
                            if (isUseToastrMessage) {
                                scope.message = invalidFileMessage;
                                toastr.error(validateFileMessage);
                            }
                            scope.$digest();
                            return;
                        }

                        var render = new FileReader();
                        render.onload = function () {
                            scope.file = createFile(file, null);
                            scope.file.invalidSize = false;
                            if (scope.orginalFile) {
                                scope.file.orginalFile = scope.orginalFile;
                                scope.file.status = fileStatus.update;
                            }
                            scope.invalidFile = false;
                            scope.fileName = scope.file.name;
                            scope.displayedName = getDisplayedName(scope.file.name) || '';
                            scope.$digest();

                            $(element).find('.uploader__file-name').loading();
                            uploadFile(file);
                        };
                        render.readAsDataURL(file);
                    });
                }

                function getSelectedFile() {
                    var selectedFile = element.find(fileSelector)[0];
                    return selectedFile && selectedFile.files && selectedFile.files[0];
                }

                function uploadFile(file) {
                    uploadFileDataSvc.uploadFile(file, isUploadOnAzure).$promise.then(function (response) {
                        var name = response.fileName;
                        scope.file.uploadedFileName = name;
                        scope.file.name = name;
                        scope.fileName = name;
                        scope.handler({ params: { file: scope.file } });
                        angularScopeUtilSvc.safeApply(scope, function () {
                            if (scope.$parent.vm && scope.$parent.vm.disablebImportButton) {
                                scope.$parent.vm.disablebImportButton = false;
                            }
                        });
                    }, function (error) {
                        errorHandlingSvc.manifestError('Upload file error', error);
                    });

                }

                function openUploadFileDialog() {
                    element.find(fileSelector).click();
                }

                function deleteFileUploadSelected() {
                    //TODO loss binding data by this assignment code
                    //if (scope.orginalFile) {
                    //    scope.file = {
                    //        name: scope.orginalFile.name,
                    //        status: fileStatus.remove
                    //    };
                    //} else {
                    //    scope.file = null;
                    //}
                    //scope.file.orginalFile.name = scope.orginalFile ? scope.orginalFile.name : '';
                    scope.file.name = '';
                    scope.file.status = fileStatus.remove;

                    angularScopeUtilSvc.safeApply(scope, function () {
                        scope.removeHandler();
                    });

                    $(element).find(fileSelector).val('');
                    scope.invalidFile = true;
                    scope.message = nofileMessage;
                    scope.messageCss = css.valid;

                    angularScopeUtilSvc.safeApply(scope);
                }

                function getDisplayedName(fileName) {
                    if (convertBool(scope.hasTimestamp))
                        fileName = truncateTimestamp(fileName);
                    return isUseShortenFilename ? shortenFileName(fileName) : fileName;
                }

                function truncateTimestamp(fileName) {
                    var timestampValue = fileName.split('_')[0];
                    if (isTimestampNumber(timestampValue)) {
                        fileName = fileName.replace(timestampValue + '_', '');
                    }
                    return fileName;
                }

                function isTimestampNumber(timestamp) {
                    try {
                        var timestampNumber = parseInt(timestamp),
                            date = new Date(timestampNumber);
                        if (date.getYear !== undefined && typeof date.getYear === 'function') return true;
                        return false;
                    } catch (err) {
                        return false;
                    }
                }

                function fileValidation(file, type, size) {
                    var fileName = file.name;
                    var acceptedFileTypes = type.split(/[ ,]+/);
                    var fileExtension = fileName.replace(/^.*\./, '').toLowerCase();
                    var message = '';

                    if (fileExtension === '' || acceptedFileTypes.indexOf(fileExtension) < 0) {
                        message = invalidFileTypeMessage.replace('{0}', type);
                    }

                    if (parseInt(file.size / 1024) > parseInt(size)) {
                        message = (message ? message + '<br/>' : '') + invalidFileSizeMessage.replace('{0}', size);
                    }
                    return message;
                }

                function createFile(file, data) {
                    return {
                        orginalFile: null,
                        name: convertBool(scope.hasTimestamp) ? fileUtilSvc.getFileNameByTimestamp(file.name) : file.name,
                        content: data,
                        status: fileStatus.create
                    };
                }

                function shortenFileName(fileName) {
                    if (fileName.indexOf('/') >= 0) {
                        var fileNameInParts = fileName.split("/");
                        fileName = fileNameInParts[fileNameInParts.length - 1];
                    }

                    var fileExtension = fileName.replace(/^.*\./, '');
                    var extractedName = fileName.substr(0, fileName.length - fileExtension.length - 1);
                    if (extractedName.length > maxlengthFileNameDisplay) {
                        extractedName = extractedName.substr(0, maxlengthFileNameDisplay) + '...';
                    }
                    return extractedName + '.' + fileExtension;
                }

                function convertBool(value) {
                    if (!value) return null;
                    if (value === true || value.toLowerCase() === 'true' || value === '1') return true;
                    return false;
                }
            }
        };
    }
})();

(function ($) {
    'use strict';

    $.fn.loading = function (options) {
        var defaultOptions = {
            classCss: 'loading',
            delay: 2000
        };

        var option = $.extend(defaultOptions, options);
        var element = this;

        element.removeClass(option.classCss).addClass(option.classCss);
        setTimeout(function () {
            element.removeClass(option.classCss);
        }, option.delay);

        return element;
    };

})(jQuery);