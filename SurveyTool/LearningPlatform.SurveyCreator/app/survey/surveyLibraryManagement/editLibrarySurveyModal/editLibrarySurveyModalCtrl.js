(function () {
    'use trict';

    angular
        .module('svt')
        .controller('editLibrarySurveyModalCtrl', editLibrarySurveyModalCtrl);

    editLibrarySurveyModalCtrl.$inject = [
        '$scope', '$modalInstance', 'modalData',
        'baseHost', '$sce', 'spinnerUtilSvc',
        'libraryDataSvc'
    ];

    function editLibrarySurveyModalCtrl($scope, $modalInstance, modalData,
        baseHost, $sce, spinnerUtilSvc,
        libraryDataSvc) {
        $scope.modalData = modalData;
        $scope.surveyUri = $sce.trustAsResourceUrl(baseHost + '/library/' + modalData.survey.libraryId + '/survey/' + modalData.survey.id + '?v=' + new Date().getTime());

        $scope.closeModal = closeModal;
        $scope.saveChanges = saveChanges;

        function closeModal() {
            $modalInstance.dismiss('cancel');
        }

        function saveChanges() {
            libraryDataSvc.updateSurvey(modalData.survey.id, modalData.survey.title).$promise.then(function () {
            }, function () {
                toastr.error('Updating survey was not successful');
            });
            $modalInstance.close(modalData.survey);
        }
    }
})();