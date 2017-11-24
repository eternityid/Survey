'use strict';

(function () {
    CKEDITOR.plugins.add('svtinsertfromfilelibrary', {
        init: function (editor) {
            editor.addCommand('svtinsertfromfilelibrary', {
                exec: openFileLibraryPicker
            });

            editor.ui.addButton('FileInsertCustomizeButton', {
                label: "Insert from library",
                command: 'svtinsertfromfilelibrary',
                toolbar: 'insert',
                icon: '../../assets/images/image_icon.png'
            });

            editor.on('doubleclick', function (event) {
                var element = CKEDITOR.plugins.link.getSelectedLink(editor) || event.data.element;

                if (!element.isReadOnly()) {
                    if (element.is('img')) {
                        openFileLibraryPicker(editor, element.$.src +  '?' + 'width=' + element.$.width + 'px&height=' + element.$.height + 'px');
                    }
                }
            });

            function openFileLibraryPicker(editor, imageSrc) {
                if (!editor.svtData || typeof editor.svtData.openFileLibraryPicker !== "function") return;
                editor.svtData.openFileLibraryPicker(editor, imageSrc);
            }
        }
    });

})();