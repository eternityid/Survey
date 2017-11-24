(function () {
    'use trict';

    angular
        .module('svt')
        .controller('editLibraryPageModalCtrl', editLibraryPageModalCtrl);

    editLibraryPageModalCtrl.$inject = [
        '$scope', '$modalInstance', 'modalData',
        'lookAndFeelPreviewerSvc', 'spinnerUtilSvc', 'libraryDataSvc', 'baseHost',
        '$sce', 'stringUtilSvc', 'surveyLibraryManagementSvc'
    ];

    function editLibraryPageModalCtrl($scope, $modalInstance, modalData,
        lookAndFeelPreviewerSvc, spinnerUtilSvc, libraryDataSvc, baseHost,
        $sce, stringUtilSvc, surveyLibraryManagementSvc) {

        var vm = this;
        vm.ckeditorConfig = {
            extraPlugins: 'sourcedialog,svtinsertfromfilelibrary',
            toolbarType: 'short',
            svtData: {}
        };

        vm.onPageTitleChange = onPageTitleChange;
        vm.onPageDescriptionChange = onPageDescriptionChange;
        vm.page = modalData;
        vm.cancel = cancel;
        vm.saveLibraryPage = saveLibraryPage;

        init();

        function init() {
            vm.iframePreviewerSrc = $sce.trustAsResourceUrl(
               baseHost + '/library/' + vm.page.libraryId + '/page/' + vm.page.id + '?v=' + new Date().getTime());


            vm.updatingCommand = lookAndFeelPreviewerSvc.getUpdatingCommand();
            angular.extend(vm.updatingCommand.value, lookAndFeelPreviewerSvc.getPageInfo && lookAndFeelPreviewerSvc.getPageInfo());

            $scope.$watch('vm.updatingCommand.value', function () {
                lookAndFeelPreviewerSvc.excuteUpdatingCommands();
            }, true);

            $scope.$on('$destroy', lookAndFeelPreviewerSvc.clearData);
        }

        function onPageTitleChange() {
            lookAndFeelPreviewerSvc.updateUpdatingCommand({ pageTitle: vm.page.title }, 'PageTitle');
        }

        function onPageDescriptionChange() {
            lookAndFeelPreviewerSvc.updateUpdatingCommand({ pageDescription: vm.page.description }, 'PageDescription');
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        function saveLibraryPage() {
            var validationResult = surveyLibraryManagementSvc.validateLibraryPage(vm.page.title);
            if (!validationResult.valid) {
                toastr.error(validationResult.message);
                return;
            }

            spinnerUtilSvc.showSpinner();
            libraryDataSvc.updatePage(vm.page.id, vm.page.title, vm.page.description).$promise.then(function (response) {
                $modalInstance.close(response);
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                toastr.error('Updating page was not successful');
                spinnerUtilSvc.hideSpinner();
            });
        }
    }
})();