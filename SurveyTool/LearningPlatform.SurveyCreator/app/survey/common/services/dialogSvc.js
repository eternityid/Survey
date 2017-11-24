(function () {
    angular.module('svt').service('dialogSvc', dialogSvc);

    dialogSvc.$inject = ['$modal'];

    function dialogSvc($modal) {
        var service = {
            openDialog: openDialog
        };
        return service;

        function openDialog(modalTitle, message, okTitle) {
            return $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            modalTitle: modalTitle,
                            message: message || '',
                            okTitle: okTitle
                        };
                    }
                }
            }).result;
        }
    }
})();