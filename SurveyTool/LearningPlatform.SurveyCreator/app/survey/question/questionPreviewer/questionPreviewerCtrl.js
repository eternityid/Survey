(function () {
    angular
        .module('svt')
        .controller('questionPreviewerCtrl', questionPreviewerCtrl);

    questionPreviewerCtrl.$inject = [
        '$scope', 'questionPreviewerSvc', 'questionPreviewerDataSvc', 'surveyContentValidation', 'surveyErrorConst'
    ];

    function questionPreviewerCtrl(
        $scope, questionPreviewerSvc, questionPreviewerDataSvc, surveyContentValidation, surveyErrorConst) {
        var vm = this;

        var isLoading = false;

        vm.init = init;

        vm.init();

        function init() {
            vm.reloadCommands = questionPreviewerSvc.getReloadCommands();
            vm.updatingCommands = questionPreviewerSvc.getUpdatingCommands();

            $scope.$watch('vm.reloadCommands.length', function () {
                if (vm.reloadCommands.length === 0) return;
                excuteLatestReloadCommand();
            });

            $scope.$watch('vm.updatingCommands.length', function () {
                if (isLoading === false) {
                    questionPreviewerSvc.excuteUpdatingCommands();
                }
            });
        }

        function excuteLatestReloadCommand() {
            if (isLoading) return;
            var latestReloadCommand = questionPreviewerSvc.getLatestReloadCommand();
            if (latestReloadCommand) {
                questionPreviewerSvc.clearUpdatingCommands();
                questionPreviewerSvc.clearNullOptionGroups(latestReloadCommand.question);
                previewQuestion(latestReloadCommand.question, excuteLatestReloadCommand);
            } else {
                questionPreviewerSvc.excuteUpdatingCommands();
            }
        }

        function previewQuestion(question, callback) {
            var questionId = question.id;

            isLoading = true;
            questionPreviewerDataSvc.previewQuestion(question).$promise.then(function (response) {
                isLoading = false;
                var hasError = hasErrorOnClientValidation(questionId);
                if (hasError) response.data = customErrorMessage(response.data);

                updateContentForPreviewingIframe(response.data);
                callback();
            });

            function updateContentForPreviewingIframe(newData) {
                var iframe = document.getElementById('questionPreviewerIframe');
                if (!iframe) return;

                var iframeContent = iframe.contentWindow.document;
                iframeContent.open();
                iframeContent.write(newData);
                iframeContent.close();

                updateAlwaysHiddenMessage(iframe);
            }

            function updateAlwaysHiddenMessage(iframe) {
                iframe.onload = function () {
                    questionPreviewerSvc.updateAlwaysHiddenMessage(question.isAlwaysHidden);
                    questionPreviewerSvc.excuteUpdatingCommands();
                };
            }

            function hasErrorOnClientValidation(questionId) {
                var errors = surveyContentValidation.generalErrors;
                if (!errors) return false;

                return errors.some(function (error) {
                    return error.type === surveyErrorConst.errorTypes.carryOver && error.questionId === questionId;
                });
            }

            function customErrorMessage(responseData) {
                return responseData.replace(/<h2 id="error-message">.*<\/h2>/gi,
                        '<h2 id="error-message">Your question contains error(s). To preview your question you need to correct the error(s).<\/h2>');
            }
        }
    }
})();