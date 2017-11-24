'use strict';

(function () {
    CKEDITOR.plugins.add('svtquestionplaceholder', {
        requires: 'widget,dialog',

        onLoad: function () {
            CKEDITOR.addCss('.cke_svtquestionplaceholder{background-color:#ff0}');
        },

        init: function (editor) {
            CKEDITOR.dialog.add('svtquestionplaceholder', this.path + 'dialogs/placeholder.js');

            editor.widgets.add('svtquestionplaceholder', {
                dialog: 'svtquestionplaceholder',
                template: '<span class="cke_svtquestionplaceholder"></span>',
                draggable: false,

                downcast: function () {
                    return new CKEDITOR.htmlParser.text('{{' + this.data.name + '}}');
                },

                init: function () {
                    this.setData('name', this.element.getText().slice(2, -2));
                },

                data: function () {
                    this.element.setText('{{' + this.data.name + '}}');
                }
            });
        },

        afterInit: function (editor) {
            var placeholderReplaceRegex = /{{.*questions[^}}]*}}/g;

            editor.dataProcessor.dataFilter.addRules({
                text: function (text, node) {
                    var dtd = node.parent && CKEDITOR.dtd[node.parent.name];

                    if (dtd && !dtd.span) return;

                    return text.replace(placeholderReplaceRegex, function (match) {
                        var innerElement = new CKEDITOR.htmlParser.element('span', {
                            'class': 'cke_svtquestionplaceholder'
                        });

                        innerElement.add(new CKEDITOR.htmlParser.text(match));
                        var widgetWrapper = editor.widgets.wrapElement(innerElement, 'svtquestionplaceholder');

                        return widgetWrapper.getOuterHtml();
                    });
                }
            });
        }
    });

})();