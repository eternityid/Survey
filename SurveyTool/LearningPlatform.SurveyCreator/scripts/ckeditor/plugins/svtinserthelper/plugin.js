'use strict';
(function () {
    CKEDITOR.plugins.add('svtinserthelper', {
        requires: 'widget,dialog',
        icons: 'svtplaceholder',
        hidpi: true,
        init: function (editor) {
            var insertHelperGroup = 'InsertHelperGroup';
            var insertHelperItems = {};

            var commandTypes = {
                svtQuestionPlaceholder: 'svtquestionplaceholder',
                svtRespondentPlaceholder: 'svtrespondentplaceholder',
                svtSurveyLink: 'svtsurveylink'
            };

            var itemTypes = {
                insertQuestionPlaceholder: 'insertQuestionPlaceholder',
                insertRespondentPlaceholder: 'insertRespondentPlaceholder',
                insertSurveyLink: 'insertSurveyLink'
            };
            editor.addMenuGroup(insertHelperGroup);

            var extraPlugins = editor.config.extraPlugins.split(',') || [];

            if (extraPlugins.indexOf(commandTypes.svtQuestionPlaceholder) >= 0) {
                insertHelperItems[itemTypes.insertQuestionPlaceholder] = {
                    label: 'From Question',
                    group: insertHelperGroup,
                    command: commandTypes.svtQuestionPlaceholder,
                    order: 1,
                    icon: 'svtplaceholder'
                };
            }

            if (extraPlugins.indexOf(commandTypes.svtRespondentPlaceholder) >= 0) {
                insertHelperItems[itemTypes.insertRespondentPlaceholder] = {
                    label: 'From Respondent',
                    group: insertHelperGroup,
                    command: commandTypes.svtRespondentPlaceholder,
                    order: 2,
                    icon: 'svtplaceholder'
                };
            }

            if (extraPlugins.indexOf(commandTypes.svtSurveyLink) >= 0) {
                insertHelperItems[itemTypes.insertSurveyLink] = {
                    label: 'Survey Link',
                    group: insertHelperGroup,
                    command: commandTypes.svtSurveyLink,
                    order: 3,
                    icon: 'svtplaceholder'
                };
            }

            editor.addMenuItems(insertHelperItems);
            editor.ui.add(insertHelperGroup, CKEDITOR.UI_MENUBUTTON, {
                label: 'Insert',
                onMenu: function () {
                    var active = {};
                    for (var p in insertHelperItems) {
                        if (p === itemTypes.insertQuestionPlaceholder &&
                            (!editor.svtData.placeholderQuestionItems || editor.svtData.placeholderQuestionItems.length === 0)) {
                            active[p] = CKEDITOR.TRISTATE_DISABLED;
                            continue;
                        }
                        if (p === itemTypes.insertRespondentPlaceholder &&
                            (!editor.svtData.placeholderRespondentItems || editor.svtData.placeholderRespondentItems.length === 0)) {
                            active[p] = CKEDITOR.TRISTATE_DISABLED;
                            continue;
                        }
                        active[p] = CKEDITOR.TRISTATE_OFF;
                    }

                    return active;
                }
            });
        }
    });
})();