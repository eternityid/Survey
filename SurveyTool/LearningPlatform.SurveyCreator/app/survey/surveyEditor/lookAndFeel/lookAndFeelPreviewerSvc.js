(function () {
    angular
        .module('svt')
        .service('lookAndFeelPreviewerSvc', LookAndFeelPreviewerSvc);

    function LookAndFeelPreviewerSvc() {
        var UPDATING_COMMAND_TYPES = {
            pageTitle: 'PageTitle',
            pageDescription: 'PageDescription'
        };

        var updatingCommand = {
            type: 'Theme_Content',
            value: {},
            callback: function () {
                var iframe = $('#lookAndFeelPreviewer')[0];
                if (iframe) {
                    iframe.contentWindow.postMessage({ type: updatingCommand.type, value: updatingCommand.value }, '*');
                }
            }
        };
        var reloadCommands = [];

        var service = {
            getUpdatingCommandTypes: getUpdatingCommandTypes,
            getUpdatingCommand: getUpdatingCommand,
            updateUpdatingCommand: updateUpdatingCommand,
            excuteUpdatingCommands: excuteUpdatingCommands,
            getReloadCommands: getReloadCommands,
            addReloadCommand: addReloadCommand,
            getLatestReloadCommand: getLatestReloadCommand,
            updatePreviewThemeCommand: updatePreviewThemeCommand,
            clearData: clearData
        };

        return service;

        function updatePreviewThemeCommand(theme) {
            var parameters = {
                backgroundColor: theme.backgroundColor,
                pageContainerBackgroundColor: theme.pageContainerBackgroundColor,
                errorColor: theme.errorColor,
                errorBackgroundColor: theme.errorBackgroundColor,
                questionTitleColor: theme.questionTitleColor,
                questionDescriptionColor: theme.questionDescriptionColor,
                questionContentColor: theme.questionContentColor,
                primaryButtonBackgroundColor: theme.primaryButtonBackgroundColor,
                primaryButtonColor: theme.primaryButtonColor,
                defaultButtonBackgroundColor: theme.defaultButtonBackgroundColor,
                defaultButtonColor: theme.defaultButtonColor,
                pageContainerBackgroundOpacity: theme.pageContainerBackgroundOpacity,
                inactiveOpacity: theme.inactiveOpacity,
                font: theme.font,
                inputFieldBackgroundColor: theme.inputFieldBackgroundColor,
                inputFieldColor: theme.inputFieldColor,
                isRepeatBackground: theme.isRepeatBackground,
                backgroundStyle: theme.backgroundStyle
            };
            updateUpdatingCommand(parameters, 'Theme_Content');
        }

        function getUpdatingCommandTypes() {
            return UPDATING_COMMAND_TYPES;
        }

        function getUpdatingCommand() {
            return updatingCommand;
        }

        function updateUpdatingCommand(newValue, type) {
            if (type) {
                updatingCommand.type = type;
            }
            angular.extend(updatingCommand.value, newValue);
        }

        function excuteUpdatingCommands() {
            updatingCommand.callback();
        }

        function getReloadCommands() {
            return reloadCommands;
        }

        function addReloadCommand(lookAndFeelBindingModel) {
            reloadCommands.push({
                lookAndFeelBindingModel: lookAndFeelBindingModel
            });
        }

        function getLatestReloadCommand() {
            var numberOfReloadCommands = reloadCommands.length;
            if (numberOfReloadCommands === 0) {
                return null;
            } else {
                var latestReloadCommand = angular.copy(reloadCommands[numberOfReloadCommands - 1]);
                reloadCommands.splice(0, numberOfReloadCommands);
                return latestReloadCommand;
            }
        }

        function clearData() {
            updatingCommand.value = {};
            reloadCommands.splice(0, reloadCommands.length);
        }
    }
})();