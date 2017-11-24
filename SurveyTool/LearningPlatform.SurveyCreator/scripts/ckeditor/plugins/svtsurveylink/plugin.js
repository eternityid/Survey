'use strict';

(function () {
    CKEDITOR.plugins.add('svtsurveylink', {
        init: function (editor) {
            editor.addCommand('svtsurveylink', {
                exec: function (editor) {
                    editor.insertHtml('<a href="{{surveyLink}}">Click here to take the survey</a>');
                }
            });
        }
    });

})();