(function () {
    'use trict';

    angular
        .module('svt')
        .controller('editLibraryQuestionModalCtrl', editLibraryQuestionModalCtrl);

    editLibraryQuestionModalCtrl.$inject = [
        '$scope', '$modalInstance', 'modalData',
        'baseHost', '$sce', 'spinnerUtilSvc',
        'libraryDataSvc', 'questionPreviewerSvc', 'stringUtilSvc',
        'surveyLibraryManagementSvc'
    ];

    function editLibraryQuestionModalCtrl($scope, $modalInstance, modalData,
        baseHost, $sce, spinnerUtilSvc,
        libraryDataSvc, questionPreviewerSvc, stringUtilSvc,
        surveyLibraryManagementSvc) {
        $scope.modalData = modalData;
        $scope.questionUri = $sce.trustAsResourceUrl(baseHost + '/library/' + modalData.question.libraryId + '/question/' + modalData.question.id + '?v=' + new Date().getTime());

        $scope.ckeditorConfig = {
            questionTitle: {
                extraPlugins: 'sourcedialog,svtinsertfromfilelibrary',
                required: true,
                toolbarType: 'short',
                placeholder: {
                    value: "Question title",
                    valid: true
                },
                svtData: {}
            },
            questionDescription: {
                extraPlugins: 'sourcedialog,svtinsertfromfilelibrary',
                toolbarType: 'short',
                svtData: {}
            }
        };
        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();

        $scope.closeModal = closeModal;
        $scope.saveChanges = saveChanges;
        $scope.liveUpdateTitleAndDescription = liveUpdateTitleAndDescription;

        function closeModal() {
            $modalInstance.dismiss('cancel');
        }

        function saveChanges() {
            var validationResult = surveyLibraryManagementSvc.validateLibraryQuestion(modalData.question.title);
            if (!validationResult.valid) {
                toastr.error(validationResult.message);
                return;
            }

            libraryDataSvc.updateQuestion(modalData.question.id, modalData.question.title, modalData.question.description).$promise.then(function () {
            }, function () {
                toastr.error('Updating question was not successful');
            });
            $modalInstance.close(modalData.question);
        }

        function liveUpdateTitleAndDescription() {
            var libraryQuestionPreviewer = $('#libraryQuestionPreviewer')[0];
            if (libraryQuestionPreviewer) {
                libraryQuestionPreviewer.contentWindow.postMessage({ type: updatingCommandTypes.questionTitle, value: modalData.question.title }, '*');
                libraryQuestionPreviewer.contentWindow.postMessage({ type: updatingCommandTypes.questionDescription, value: modalData.question.description }, '*');
            }
        }
    }
})();