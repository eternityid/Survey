(function () {
    angular
        .module('svt')
        .controller('createNewSurveyCtrl', CreateNewSurveyCtrl);

    CreateNewSurveyCtrl.$inject = [
        '$rootScope', '$scope', '$window', 'errorHandlingSvc',
        'surveyEditorSvc', 'pushDownSvc', 'spinnerUtilSvc', 'surveyDataSvc'
    ];

    function CreateNewSurveyCtrl(
        $rootScope, $scope, $window, errorHandlingSvc,
        surveyEditorSvc, pushDownSvc, spinnerUtilSvc, surveyDataSvc) {

        $scope.defaultTabsValue = {
            'empty': {
                'title': ''
            },
            'library': {
                'title': '',
                'defaultSurvey': null,
                'libraryId': null
            },
            'existing': {
                'title': '',
                'defaultSurvey': null
            }
        };

        var vm = this;
        vm.createType = 'empty';

        vm.save = save;
        vm.close = closeMe;

        init();

        function init() {
            setupOnDestroy();
            surveyEditorSvc.setSurveyEditMode(true);
            pushDownSvc.setLoadingStatus(true);
            return;

            function setupOnDestroy() {
                $scope.$on('$destroy', function () {
                    surveyEditorSvc.setSurveyEditMode(false);
                });
            }
        }

        function save() {
            $rootScope.$broadcast('event:DoneCreateNewSurvey', function (validationResult, data) {
                if (validationResult.valid === false) {
                    toastr.error(validationResult.message);
                    return;
                }

                switch (vm.createType) {
                    case 'empty':
                        addNewSurvey(data.surveyTitle);
                        break;
                    case 'existing':
                        duplicateExistingSurvey(data.existingSurveyId, data.surveyTitle);
                        break;
                    case 'library':
                        duplicateLibrarySurvey(data.librarySurveyId, data.surveyTitle, data.libraryId);
                        break;
                }
            });


            function addNewSurvey(surveyTitle) {
                var createMessages = {
                    fail: 'Creating survey was not successful.'
                };

                spinnerUtilSvc.showSpinner();
                surveyDataSvc.addSurvey(surveyTitle).$promise.then(function (response) {
                    spinnerUtilSvc.hideSpinner();

                    handleAfterSave();
                    vm.close();
                    $window.location.href = '#/surveys/' + response.surveyId + '/designer';
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError(createMessages.fail, error);
                });
            }

            function duplicateExistingSurvey(existingSurveyId, surveyTitle) {
                duplicateSurvey(existingSurveyId, surveyTitle, null);
            }

            function duplicateLibrarySurvey(librarySurveyId, surveyTitle, libraryId) {
                duplicateSurvey(librarySurveyId, surveyTitle, libraryId);
            }

            function duplicateSurvey(surveyId, surveyTitle, libraryId) {
                spinnerUtilSvc.showSpinner();
                surveyDataSvc.duplicateSurvey(surveyId, surveyTitle, libraryId).$promise.then(function (response) {
                    handleAfterSave();
                    vm.close();
                    spinnerUtilSvc.hideSpinner();
                    $window.location.href = '#/surveys/' + response.id + '/designer';
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status !== errorCode.Unauthorized) {
                        errorHandlingSvc.manifestError(error.data || 'Duplicate survey was not successful', error);
                    }
                });
            }

        }

        function closeMe() {
            pushDownSvc.hidePushDown();
        }

        function handleAfterSave() {
            $scope.handleAfterSave();
        }
    }
})();