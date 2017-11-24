(function () {
    angular
        .module('svt')
        .controller('libraryQuestionListCtrl', libraryQuestionListCtrl);

    libraryQuestionListCtrl.$inject = [
        '$scope', 'libraryDataSvc', 'spinnerUtilSvc', '$modal',
        'questionTypeSvc', 'stringUtilSvc'
    ];

    function libraryQuestionListCtrl($scope, libraryDataSvc, spinnerUtilSvc, $modal,
        questionTypeSvc, stringUtilSvc) {
        var vm = this;

        vm.totalQuestions = 0;
        vm.questions = null;
        vm.lastSearchTerm = null;
        vm.defaultLimit = 10;
        vm.defaultOffset = 0;

        vm.deleteQuestion = deleteQuestion;
        vm.duplicateQuestion = duplicateQuestion;
        vm.openQuestionEditor = openQuestionEditor;
        vm.loadMoreQuestions = loadMoreQuestions;
        vm.getQuestionTypeName = getQuestionTypeName;

        init();

        function init() {
            loadQuestionsWithNewSearchTerm();
            $scope.$on('event:questionLibraryManagementOnSearch', loadQuestionsWithNewSearchTerm);
        }

        function loadQuestionsWithNewSearchTerm() {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.searchQuestions($scope.searchTerm, vm.defaultLimit, vm.defaultOffset).$promise.then(function (response) {
                vm.lastSearchTerm = $scope.searchTerm;
                vm.totalQuestions = response.totalQuestions;
                vm.questions = response.questions;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading questions was not successful', error);
            });
        }

        function duplicateQuestion(question) {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.duplicateQuestion(question.id).$promise.then(function (response) {
                vm.questions.unshift(response);
                vm.totalQuestions++;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Duplicating question was not successful', error);
            });
        }

        function deleteQuestion(question, questionIndex) {
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    modalData: function () {
                        return {
                            message: 'Do you want to delete question <strong>"' + stringUtilSvc.getPlainText(question.title.items[0].text) + '"</strong>?'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                spinnerUtilSvc.showSpinner();
                libraryDataSvc.deleteQuestion(question.id).$promise.then(function () {
                    vm.questions.splice(questionIndex, 1);
                    vm.totalQuestions--;
                    spinnerUtilSvc.hideSpinner();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError('Deleting question was not successful', error);
                });
            });
        }

        function openQuestionEditor(question) {
            $modal.open({
                templateUrl: 'survey/surveyLibraryManagement/editLibraryQuestionModal/edit-library-question-modal.html',
                controller: 'editLibraryQuestionModalCtrl',
                size: 'lg',
                windowClass: 'edit-survey-library-modal',
                backdrop: 'static',
                resolve: {
                    modalData: function () {
                        return {
                            question: {
                                id: question.id,
                                title: question.title.items[0].text,
                                description: question.description.items[0].text,
                                alias: question.alias,
                                type: questionTypeSvc.getNameQuestionType(question.$type),
                                libraryId: question.libraryId
                            }
                        };
                    }
                }
            }).result.then(function (result) {
                question.title.items[0].text = result.title;
                question.description.items[0].text = result.description;
            });
        }

        function loadMoreQuestions() {
            spinnerUtilSvc.showSpinner();
            libraryDataSvc.searchQuestions(vm.lastSearchTerm, vm.defaultLimit, vm.questions.length).$promise.then(function (response) {
                vm.questions.push.apply(vm.questions, response.questions);
                vm.totalQuestions = response.totalQuestions;
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError('Loading questions was not successful', error);
            });
        }

        function getQuestionTypeName(questionType) {
            return questionTypeSvc.getNameQuestionType(questionType);
        }
    }
})();