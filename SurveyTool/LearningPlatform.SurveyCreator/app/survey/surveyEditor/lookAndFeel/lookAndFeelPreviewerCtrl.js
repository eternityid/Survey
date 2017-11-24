(function() {
    angular
        .module('svt')
        .controller('lookAndFeelPreviewerCtrl', lookAndFeelPreviewerCtrl);

    lookAndFeelPreviewerCtrl.$inject = [
        '$scope', 'lookAndFeelPreviewerSvc', 'lookAndFeelDataSvc'
    ];

    function lookAndFeelPreviewerCtrl($scope, lookAndFeelPreviewerSvc, lookAndFeelDataSvc) {
        var vm = this;

        var isLoading = false;
        vm.init = init;
        vm.isLookAndFeelByPage = false;

        vm.init();

        function init() {
            vm.reloadCommands = lookAndFeelPreviewerSvc.getReloadCommands();
            vm.updatingCommand = lookAndFeelPreviewerSvc.getUpdatingCommand();
            angular.extend(vm.updatingCommand.value, lookAndFeelPreviewerSvc.getPageInfo && lookAndFeelPreviewerSvc.getPageInfo());

            $scope.$watch('vm.reloadCommands.length', excuteLatestReloadCommand);

            $scope.$watch('vm.updatingCommand.value', function () {
                if (isLoading === false) lookAndFeelPreviewerSvc.excuteUpdatingCommands();
            }, true);

            $scope.$on('$destroy', lookAndFeelPreviewerSvc.clearData);

            var iframe = document.getElementById('lookAndFeelPreviewer');
            if (iframe) iframe.onload = lookAndFeelPreviewerSvc.excuteUpdatingCommands;
        }

        function excuteLatestReloadCommand() {
            var latestReloadCommand = lookAndFeelPreviewerSvc.getLatestReloadCommand();

            if (latestReloadCommand) {
                previewLookAndFeel(latestReloadCommand.lookAndFeelBindingModel, excuteLatestReloadCommand);
            } else {
                lookAndFeelPreviewerSvc.excuteUpdatingCommands();
            }
        }

        function previewLookAndFeel(lookAndFeelBindingModel, callback) {
            isLoading = true;
            vm.isLookAndFeelByPage = lookAndFeelBindingModel.pageId ? true : false;
            var promise = vm.isLookAndFeelByPage ?
                lookAndFeelDataSvc.previewLookAndFeelByPage(lookAndFeelBindingModel).$promise :
                lookAndFeelDataSvc.previewLookAndFeel(lookAndFeelBindingModel).$promise;

            promise.then(function (response) {
                isLoading = false;
                updateContentForPreviewingIframe(response.data);
                callback();
            });

            function updateContentForPreviewingIframe(newData) {
                var iframe = document.getElementById('lookAndFeelPreviewer');
                if (!iframe) return;

                var iframeContent = iframe.contentWindow.document;
                iframeContent.open();
                iframeContent.write(newData);
                iframeContent.close();
            }
        }
    }
})();