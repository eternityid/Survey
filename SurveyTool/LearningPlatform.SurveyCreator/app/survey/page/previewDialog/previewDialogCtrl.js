(function () {
    angular
        .module('svt')
        .controller('previewDialogCtrl', previewDialogCtrl);

    previewDialogCtrl.$inject = ['$scope', '$modalInstance', 'modalData', '$sce', 'testHost', 'baseHost'];

    function previewDialogCtrl($scope, $modalInstance, modalData, $sce, testHost, baseHost) {
        var vm = this;
        vm.$modalInstance = $modalInstance || {};
        modalData = modalData || false;

        openModal($scope, vm.$modalInstance, modalData, $sce, testHost, baseHost);
    }

    function openModal($scope, $modalInstance, modalData, $sce, testHost, baseHost) {
        $scope.modalTitle = modalData.modalTitle || 'Preview';

        if (modalData.sourcedLink) {
            $scope.getIframeSrc = $sce.trustAsResourceUrl(modalData.sourcedLink);
        } else if (modalData.libraryId && modalData.surveyLibraryId) {
            $scope.getIframeSrc = $sce.trustAsResourceUrl(
                baseHost + '/library/' + modalData.libraryId + '/survey/' + modalData.surveyLibraryId + '?v=' + new Date().getTime());
        } else if (modalData.libraryId && modalData.pageLibraryId) {
            $scope.getIframeSrc = $sce.trustAsResourceUrl(
                baseHost + '/library/' + modalData.libraryId + '/page/' + modalData.pageLibraryId + '?v=' + new Date().getTime());
        } else if (modalData.libraryId && modalData.questionLibraryId) {
            $scope.getIframeSrc = $sce.trustAsResourceUrl(
                baseHost + '/library/' + modalData.libraryId + '/question/' + modalData.questionLibraryId + '?v=' + new Date().getTime());
        } else if (modalData.pageId) {
            $scope.getIframeSrc = $sce.trustAsResourceUrl(
                testHost + '/' + modalData.selectSurveyId + '?v=' + new Date().getTime() + '&pageId=' + modalData.pageId);
        } else {
            $scope.getIframeSrc = $sce.trustAsResourceUrl(
                testHost + '/' + modalData.selectSurveyId + '?v=' + new Date().getTime());
        }

        $scope.closeMe = closeMe;

        function closeMe() {
            $modalInstance.dismiss('cancel');
        }
    }

})();