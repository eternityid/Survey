(function () {

    angular
        .module('svt')
        .directive('richTextInput', richTextInput);

    richTextInput.$inject = ['$modal', 'settingConst', 'fileLibrarySvc', 'fileLibraryConstants'];

    function richTextInput($modal, settingConst, fileLibrarySvc, fileLibraryConstants) {
        var directive = {
            restrict: 'A',
            require: ['ngModel'],
            scope:{
                richTextInput: '='
            },
            link: function (scope, element, attrs, ctrs) {
                var viewModel = ctrs[0];
                var ckeditorInstance, elementId, clientX, clientY;
                var BLOCKTAGS = ['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'li', 'blockquote', 'ul', 'ol',
                                'table', 'thead', 'tbody', 'tfoot', 'td', 'th'];

                init();

                function isActive(target) {
                    for (var i in CKEDITOR.instances) {
                        if (i === target.id) return true;
                    }
                    return false;
                }

                function init() {
                    element.wrap('<div class="rich-text-input__container"></div>');
                    elementId = getElementId();
                    element.attr('id', elementId);
                    element.addClass('rich-text-input');

                    element.on('mousedown', function (event) {
                        if (isActive(event.target)) {
                            return;
                        }
                        var evt = event || window.event;
                        clientX = evt.clientX;
                        clientY = evt.clientY;
                    }).on('focus', function (event) {
                        if (isActive(event.target)) {
                            clientX = undefined;
                            clientY = undefined;
                            return;
                        }
                        activeCkEditor();
                    });

                    viewModel.$render = function () {
                        element.html(viewModel.$viewValue);
                        handleValidationAndPlaceholder(viewModel.$viewValue);
                        registerPlaceholderStatusListener();

                        function registerPlaceholderStatusListener() {
                            if (!scope.richTextInput.placeholder) return;

                            scope.$watch(function () {
                                return scope.richTextInput.placeholder.valid;
                            }, function () {
                                handleValidationAndPlaceholder(viewModel.$viewValue);
                            });
                        }
                    };

                    scope.$on('$destroy', function handleElementDestroy() {
                        for (var instance in CKEDITOR.instances) {
                            if (!CKEDITOR.instances.hasOwnProperty(instance)) {
                                continue;
                            }
                            CKEDITOR.instances[instance].destroy();
                        }
                    });

                    function getElementId() {
                        var randomId = 'uid_' + Date.now() + '_' + Math.floor((Math.random() * 1000000) + 1);
                        var id = attrs.id;
                        return (!angular.isString(id) || id === '') ? randomId : id;
                    }
                }

                function handleValidationAndPlaceholder(value) {
                    var placeholderBaseClass = 'rich-text-input__placeholder-text';

                    if (!scope.richTextInput.placeholder) return;

                    removeRequired();
                    removePlaceholder();

                    if (value) return;

                    addRequired();
                    addPlaceholder();

                    return;

                    function addRequired() {
                        if (!scope.richTextInput.placeholder.valid && scope.richTextInput.required) element.addClass('input-required');
                    }

                    function removeRequired() {
                        if (scope.richTextInput.required) element.removeClass('input-required');
                    }

                    function removePlaceholder() {
                        var hiddenField = element.parent().find('.' + placeholderBaseClass);
                        if (hiddenField) hiddenField.remove();
                    }

                    function addPlaceholder() {
                        element.after(buildPlaceholder());
                        element.parent().find('.' + placeholderBaseClass).on('click', function () {
                            element.focus();
                        });
                    }

                    function buildPlaceholder() {
                        var placeholderClass = placeholderBaseClass;
                        placeholderClass += (!scope.richTextInput.placeholder.valid && scope.richTextInput.required) ? ' rich-text-input__placeholder-text--required' : ' rich-text-input__placeholder-text--default';
                        return '<span class="' + placeholderClass + '">' + scope.richTextInput.placeholder.value + '</span>';
                    }
                }

                function activeCkEditor() {
                    handleCkEditorInstance(elementId, clientX, clientY);
                    handleRegisterCkEditorEvent();

                    function handleRegisterCkEditorEvent() {
                        ['dataReady', 'change', 'blur', 'saveSnapshot'].forEach(function (event) {
                            ckeditorInstance.on(event, function synViewModel() {
                                var data = ckeditorInstance.getData() || '';

                                handleValidationAndPlaceholder(data);

                                scope.$apply(function () {
                                    viewModel.$setViewValue(data);
                                });
                            });
                        });
                    }


                    function handleCkEditorInstance(id, clientX, clientY) {
                        for (var i in CKEDITOR.instances) {
                            if (i !== id && CKEDITOR.instances[i].elementMode === CKEDITOR.ELEMENT_MODE_INLINE) {
                                CKEDITOR.instances[i].destroy();
                            }
                        }

                        ckeditorInstance = CKEDITOR.inline(id, getCkEditorConfig());
                        ckeditorInstance.svtData = scope.richTextInput.svtData;

                        if (CKEDITOR.plugins.get('svtinsertfromfilelibrary')) {
                            ckeditorInstance.svtData.openFileLibraryPicker = openFileLibraryPicker;
                        }

                        ckeditorInstance.on('instanceReady', function (instanceReadyEvent) {
                            if (clientX && clientY) createSelectionFromPoint(clientX, clientY, clientX, clientY);

                            for (var blockTagIndex = 0; blockTagIndex < BLOCKTAGS.length; blockTagIndex++) {
                                instanceReadyEvent.editor.dataProcessor.writer.setRules(BLOCKTAGS[blockTagIndex], {
                                    indent: false,
                                    breakBeforeOpen: true,
                                    breakAfterOpen: false,
                                    breakBeforeClose: false,
                                    breakAfterClose: false
                                });
                            }
                        });

                        function createSelectionFromPoint(startX, startY, endX, endY) {
                            var start, end, range = null;
                            if (typeof document.caretPositionFromPoint !== "undefined") {
                                start = document.caretPositionFromPoint(startX, startY);
                                end = document.caretPositionFromPoint(endX, endY);
                                range = document.createRange();
                                range.setStart(start.offsetNode, start.offset);
                                range.setEnd(end.offsetNode, end.offset);
                            } else if (typeof document.caretRangeFromPoint !== "undefined") {
                                start = document.caretRangeFromPoint(startX, startY);
                                end = document.caretRangeFromPoint(endX, endY);
                                range = document.createRange();
                                range.setStart(start.startContainer, start.startOffset);
                                range.setEnd(end.startContainer, end.startOffset);
                            }
                            if (range !== null && typeof window.getSelection !== "undefined") {
                                var sel = window.getSelection();
                                sel.removeAllRanges();
                                sel.addRange(range);
                            } else if (typeof document.body.createTextRange !== "undefined") {
                                range = document.body.createTextRange();
                                range.moveToPoint(startX, startY);
                                var endRange = range.duplicate();
                                endRange.moveToPoint(endX, endY);
                                range.setEndPoint("EndToEnd", endRange);
                                range.select();
                            }
                        }

                        function getCkEditorConfig() {
                            var config = {
                                language: 'en',
                                allowedContent: true,
                                entities: false,
                                removePlugins: 'image'
                            };
                            config.extraPlugins = scope.richTextInput.extraPlugins;

                            var toolbarSettings = getToolbarSettings(scope.richTextInput.toolbarType);
                            if (toolbarSettings) config.toolbar = toolbarSettings;

                            if (scope.richTextInput.oneLineMode) {
                                config.blockedKeystrokes = [13, 38, 40];
                                config.keystrokes = [[13, null]];
                                config.enterMode = CKEDITOR.ENTER_BR;
                            }

                            return config;

                            function getToolbarSettings(type) {
                                var toolbarConst = settingConst.ckeditor.toolbar;

                                switch (type) {
                                    case toolbarConst.type.short:
                                        return toolbarConst.items.filter(function (item) {
                                            return toolbarConst.shortItems.some(function (groupName) {
                                                return item.name === groupName;
                                            });
                                        });
                                    case toolbarConst.type.optionShort:
                                        return toolbarConst.items.filter(function (item) {
                                            return toolbarConst.optionShortItems.some(function (groupName) {
                                                return item.name === groupName;
                                            });
                                        });
                                    default:
                                        return null;
                                }
                            }
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