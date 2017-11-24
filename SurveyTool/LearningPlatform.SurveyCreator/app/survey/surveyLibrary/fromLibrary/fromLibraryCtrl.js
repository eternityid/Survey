(function () {
    angular
        .module('svt')
        .controller('fromLibraryCtrl', FromLibraryCtrl);

    FromLibraryCtrl.$inject = [
        '$scope', 'errorHandlingSvc',
        'spinnerUtilSvc', 'fromLibraryDataSvc', '$q', 'questionTypeSvc',
        'arrayUtilSvc', '$modal'
    ];

    function FromLibraryCtrl(
        $scope, errorHandlingSvc,
        spinnerUtilSvc, fromLibraryDataSvc, $q, questionTypeSvc,
        arrayUtilSvc, $modal
        ) {
        var LIBRARY_TYPE = {
            PAGES: 'pages',
            QUESTIONS: 'questions'
        };

        var vm = this;

        vm.getQuestionTypeName = getQuestionTypeName;
        vm.changeLibraryType = changeLibraryType;
        vm.sortLibraryPages = sortLibraryPages;
        vm.sortLibraryQuestions = sortLibraryQuestions;
        vm.toggleLibraryPage = toggleLibraryPage;
        vm.toggleLibraryQuestion = toggleLibraryQuestion;
        vm.showPagePreviewDialog = showPagePreviewDialog;
        vm.showQuestionPreviewDialog = showQuestionPreviewDialog;

        init();

        function init() {
            vm.libraryType = LIBRARY_TYPE.PAGES;
            $scope.isImportedPage = vm.libraryType === LIBRARY_TYPE.PAGES;
            $scope.selectedPageIds.length = 0;
            $scope.selectedQuestionIds.length = 0;
            $scope.libraryId = null;

            loadLibraryData();
        }

        function loadLibraryData() {
            spinnerUtilSvc.showSpinner();
            $q.all([
                fromLibraryDataSvc.getLibraryPages().$promise,
                fromLibraryDataSvc.getLibraryQuestions().$promise
            ]).then(function (results) {
                spinnerUtilSvc.hideSpinner();
                vm.libraryPages = results[0];
                vm.libraryQuestions = results[1];
                //TODO now just have one library
                if (vm.libraryPages.length > 0) {
                    $scope.libraryId = vm.libraryPages[0].libraryId;
                } else if (vm.libraryQuestions.length > 0) {
                    $scope.libraryId = vm.libraryQuestions[0].libraryId;
                }
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Getting library data was not successful', error);
            });
        }

        function getQuestionTypeName(questionType) {
            return questionTypeSvc.getNameQuestionType(questionType);
        }

        function changeLibraryType() {
            $scope.isImportedPage = vm.libraryType === LIBRARY_TYPE.PAGES;
        }

        function sortLibraryPages() {
            vm.libraryPages.sort(function (page1, page2) {
                var selectedPoint1 = page1.isChecked ? 1 : 0;
                var selectedPoint2 = page2.isChecked ? 1 : 0;
                if (selectedPoint1 !== selectedPoint2) return selectedPoint2 - selectedPoint1;
                return page1.title.toLowerCase() - page2.title.toLowerCase();
            });
        }

        function sortLibraryQuestions() {
            vm.libraryQuestions.sort(function (question1, question2) {
                var selectedPoint1 = question1.isChecked ? 1 : 0;
                var selectedPoint2 = question2.isChecked ? 1 : 0;
                if (selectedPoint1 !== selectedPoint2) return selectedPoint2 - selectedPoint1;
                return question1.title.items[0].text.toLowerCase() - question2.title.items[0].text.toLowerCase();
            });
        }

        function toggleLibraryPage(libraryPage) {
            arrayUtilSvc.togglePrimitiveElement($scope.selectedPageIds, libraryPage.id);
        }

        function toggleLibraryQuestion(libraryQuestion) {
            arrayUtilSvc.togglePrimitiveElement($scope.selectedQuestionIds, libraryQuestion.id);
        }

        function showPagePreviewDialog(libraryPage) {
            $modal.open({
                size: 'lg',
                windowClass: 'from-library-modal-window',
                templateUrl: 'survey/page/previewDialog/preview-dialog.html',
                controller: 'previewDialogCtrl',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            pageLibraryId: libraryPage.id,
                            libraryId: $scope.libraryId
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
            });
        }

        function showQuestionPreviewDialog(libraryQuestion) {
            $modal.open({
                size: 'lg',
                windowClass: 'from-library-modal-window',
                templateUrl: 'survey/page/previewDialog/preview-dialog.html',
                controller: 'previewDialogCtrl',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            questionLibraryId: libraryQuestion.id,
                            libraryId: $scope.libraryId
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
            });
        }
    }
})();