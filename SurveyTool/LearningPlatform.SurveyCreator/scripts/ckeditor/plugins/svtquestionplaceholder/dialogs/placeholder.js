﻿'use strict';

(function () {
    CKEDITOR.dialog.add('svtquestionplaceholder', function (editor) {
        var placeholderQuestionItems = editor.svtData.placeholderQuestionItems;
        var defaultItem = (placeholderQuestionItems && placeholderQuestionItems.length > 0) ?
            placeholderQuestionItems[0][1] : '';
        var selectElementStyle = 'min-width: 350px; max-width: 350px;';
        var textinputElementStyle = 'margin-bottom: 15px; min-width: 350px; max-width: 350px;';
        var currentCkeditor, okButton;

        var handleDisableEnableOkButton = function () {
            if (!this.getValue()) {
                okButton.disable();
            } else {
                okButton.enable();
            }
        }

        var textinputElementPointer;
        var textinputElement = {
            id: 'svt-question-placeholder-textbox',
            type: 'text',
            style: textinputElementStyle,
            label: 'Result',
            'default': defaultItem,
            setup: function (widget) {
                this.setValue(widget.data.name || selectElementPointer.getValue());
                textinputElementPointer = this;
                if (!this.getValue()) okButton.disable();
            },
            commit: function (widget) {
                widget.setData('name', this.getValue());
            },
            onKeyUp: handleDisableEnableOkButton,
            onChange: handleDisableEnableOkButton
        };



        var selectElementPointer;
        var selectElement = {
            id: 'svt-question-placeholder-dropdown',
            type: 'select',
            style: selectElementStyle,
            label: 'Available questions',
            items: placeholderQuestionItems,
            'default': defaultItem,
            setup: function (widget) {
                currentCkeditor = CKEDITOR.dialog.getCurrent();
                okButton = currentCkeditor._.buttons['ok'];

                this.setValue(getSelectElementValue());
                selectElementPointer = this;

                function getSelectElementValue() {
                    var selectElementValue = '';
                    var componentList = widget.data.name.split('.');

                    if (componentList.length < 2) return selectElementValue;

                    var patternValue = componentList[0] + '.' + componentList[1];
                    for (var itemIndex = 0; itemIndex < placeholderQuestionItems.length; itemIndex++) {
                        var itemValue = placeholderQuestionItems[itemIndex][1];
                        if (patternValue === itemValue) {
                            selectElementValue = itemValue;
                            break;
                        }
                    }

                    return selectElementValue;
                }
            },
            onChange: function () {
                if (!textinputElementPointer) return;
                textinputElementPointer.setValue(selectElementPointer.getValue());
            }
        };

        return {
            title: 'Insert the answer from a question',
            minWidth: 350,
            minHeight: 70,
            resizable: CKEDITOR.DIALOG_RESIZE_NONE,
            buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
            contents: [
                {
                    id: 'svt-question-placeholder',
                    label: 'Question alias',
                    title: 'Question alias',
                    elements: [selectElement, textinputElement]
                }
            ]
        };
    });
})();