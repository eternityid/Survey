(function () {

    angular
        .module('svt')
        .directive('svtCkeditor', SvtCkeditor);

    SvtCkeditor.$inject = ['$modal', 'fileLibrarySvc', 'fileLibraryConstants'];

    function SvtCkeditor($modal, fileLibrarySvc, fileLibraryConstants) {
        var directive = {
            restrict: 'A',
            scope: {
                id: '@',
                svtCkeditor: '='
            },
            require: ['ngModel'],
            link: function (scope, element, attrs, ctrs) {
                var viewModel = ctrs[0];
                var ckeditorInstance;
                var defaultConfig = {
                    language: 'en',
                    allowedContent: true,
                    entities: false,
                    removePlugins: 'sourcedialog, image'
                };

                init();

                function init() {
                    viewModel.$render = function () {
                        element.html(viewModel.$viewValue);
                    };

                    setupCkeditorConfig(defaultConfig);
                    ckeditorInstance = CKEDITOR.replace(scope.id, defaultConfig);

                    setupSvtDataToCkeditor(ckeditorInstance);

                    ['dataReady', 'change', 'blur', 'saveSnapshot'].forEach(function (event) {
                        ckeditorInstance.on(event, function synViewModel() {
                            scope.$apply(function () {
                                viewModel.$setViewValue(ckeditorInstance.getData() || '');
                            });
                        });
                    });

                    function setupCkeditorConfig(config) {
                        if (!scope.svtCkeditor) return;
                        config.extraPlugins = scope.svtCkeditor.extraPlugins;
                    }

                    function setupSvtDataToCkeditor(editor) {
                        if (!scope.svtCkeditor) return;
                        editor.svtData = scope.svtCkeditor.svtData;

                        if (CKEDITOR.plugins.get('svtinsertfromfilelibrary')) {
                            editor.svtData.openFileLibraryPicker = openFileLibraryPicker;
                        }
                    }
                }

                function openFileLibraryPicker(ckeditorInstance, imageSrc) {
                    $modal.open({
                        templateUrl: 'survey/fileLibrary/pickerUploader/file-library-picker-uploader-dialog.html',
                        controller: 'fileLibraryPickerUploaderDialogCtrl as vm',
                        size: 'lg',
                        windowClass: 'center-modal file-library',
                        backdrop: 'static',
                        resolve: {
                            modalData: function () {
                                return {
                                    config: {
                                        maxFileSize: 500 * 1024,
                                        fileMimeTypes: ['image/*'],
                                        activeImageSrc: imageSrc,
                                        allowChangeImageDimension: fileLibraryConstants.ALLOW_CHANGE_IMAGE_DIMENSION
                                    },
                                    imageUrl: imageSrc !== undefined ? imageSrc : null
                                };
                            }
                        }
                    }).result.then(function (data) {
                        var imageStyle = fileLibrarySvc.parseToImageStyle(data.uri);
                        var uri = data.uri.split('?')[0];
                        if (data) ckeditorInstance.insertHtml('<img src="' + uri + '"' + (imageStyle ? ' style="' + imageStyle + '"' : '') + '>');
                    });
                }
            }
        };

        return directive;
    }
})();