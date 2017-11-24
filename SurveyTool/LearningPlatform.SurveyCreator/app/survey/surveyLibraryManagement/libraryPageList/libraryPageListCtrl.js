(function () {
    angular
        .module('svt')
        .controller('libraryPageListCtrl', libraryPageListCtrl);

    libraryPageListCtrl.$inject = [
        '$scope', 'libraryDataSvc', 'spinnerUtilSvc', '$modal', 'stringUtilSvc'
    ];

    function libraryPageListCtrl($scope, libraryDataSvc, spinnerUtilSvc, $modal, stringUtilSvc) {
        var vm = this;

        vm.totalPages = 0;
        vm.pages = null;
        vm.lastSearchTerm = null;
        vm.defaultLimit = 10;
        vm.defaultOffset = 0;

        vm.deletePage = deletePage;
        vm.duplicatePage = duplicatePage;
        vm.loadMorePages = loadMorePages;
        vm.previewPageForEditing = previewPageForEditing;

        init();

        function init() {
            loadPagesWithNewSearchTerm();
            $scope.$on('event:pageLibraryManagementOnSearch', loadPagesWithNewSearchTerm);
        }

        function loadPagesWithNewSearchTerm() {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.searchPages($scope.searchTerm, vm.defaultLimit, vm.defaultOffset).$promise.then(function (response) {
                vm.lastSearchTerm = $scope.searchTerm;
                vm.totalPages = response.totalPages;
                vm.pages = response.pages;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading pages was not successful', error);
            });
        }

        function duplicatePage(page) {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.duplicatePage(page.id).$promise.then(function (response) {
                vm.pages.unshift(response);
                vm.totalPages++;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Duplicating page was not successful', error);
            });
        }

        function deletePage(page, pageIndex) {
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            message: 'Do you want to delete page <strong>"' +  stringUtilSvc.getPlainText(page.title) + '"</strong>?'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
                libraryDataSvc.deletePage(page.id).$promise.then(function () {
                    vm.pages.splice(pageIndex, 1);
                    vm.totalPages--;
                    spinnerUtilSvc.hideSpinner();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError('Deleting page was not successful', error);
                });
            });
        }

        function previewPageForEditing(page) {
            $modal.open({
                size: 'lg',
                windowClass: 'edit-survey-library-modal',
                templateUrl: 'survey/surveyLibraryManagement/editLibraryPageModal/edit-library-page-modal.html',
                controller: 'editLibraryPageModalCtrl as vm',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            libraryId: page.libraryId,
                            id: page.id,
                            title: page.title,
                            description: page.description,
                            numberOfQuestions: page.numberOfQuestions
                        };
                    }
                }
            }).result.then(function (modifiedPage) {
                page.title = modifiedPage.title.items[0].text;
                page.description = modifiedPage.description.items[0].text;
            });
        }

        function loadMorePages() {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.searchPages(vm.lastSearchTerm, vm.defaultLimit, vm.pages.length).$promise.then(function (response) {
                vm.pages.push.apply(vm.pages, response.pages);
                vm.totalPages = response.totalPages;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading pages was not successful', error);
            });
        }
    }
})();