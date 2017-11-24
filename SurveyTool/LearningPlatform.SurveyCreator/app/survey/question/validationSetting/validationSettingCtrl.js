(function () {
    'use strict';

    angular
        .module('svt')
        .controller('validationSettingCtrl', validationSettingCtrl);

    validationSettingCtrl.$inject = ['$scope', '$rootScope', 'serverValidationSvc', 'questionAdvanceSettingSvc',
        'questionPreviewerSvc', 'questionConst', 'settingConst', 'numericEditorSvc', '$timeout'];

    function validationSettingCtrl($scope, $rootScope, serverValidationSvc, questionAdvanceSettingSvc,
        questionPreviewerSvc, questionConst, settingConst, numericEditorSvc, $timeout) {
        /* jshint -W040 */
        var vm = this;
        var validationTypes = {};
        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();

        vm.onRequiredValidationChange = onRequiredValidationChange;
        vm.isMultipleSelection = false;
        vm.isNumberQuestion = false;

        vm.helpTextForStepNumber = '';
        vm.onChangeOptionDecimalPlaceOrStep = onChangeOptionDecimalPlaceOrStep;
        vm.onChangeNumericSettings = onChangeNumericSettings;

        init();

        $scope.$on('event:ReInitializeAdvancedSettings', function () {
            init();
        });

        function init() {
            validationTypes = serverValidationSvc.getServerValidationTypes();
            initQuestionValidations();
            getValidations();
            checkQuetionType();
            setDefaultValue();
        }

        function checkQuetionType() {
            if ($scope.question) {
                vm.isMultipleSelection = $scope.question.$type === questionConst.questionTypes.multipleSelection;
                vm.isNumberQuestion = $scope.question.$type === questionConst.questionTypes.numeric;
            }
        }

        function getValidations() {
            vm.requiredValidation = $scope.question.validations.filter(function (validation) {
                return validation.$type === validationTypes.required;
            })[0];
            vm.lengthValidation = $scope.question.validations.filter(function (validation) {
                return validation.$type === validationTypes.length;
            })[0];
            vm.wordsAmountValidation = $scope.question.validations.filter(function (validation) {
                return validation.$type === validationTypes.wordsAmount;
            })[0];
            vm.selectionValidation = $scope.question.validations.filter(function (validation) {
                return validation.$type === validationTypes.selection;
            })[0];
            vm.rangeNumberValidation = $scope.question.validations.filter(function (validation) {
                return validation.$type === validationTypes.rangeNumber;
            })[0];
            vm.decimalPlacesNumberValidation = $scope.question.validations.filter(function (validation) {
                return validation.$type === validationTypes.decimalPlacesNumber;
            })[0];
        }

        function initQuestionValidations() {
            if (!$scope.question.validations) {
                $scope.question.validations = [];
            }
            $scope.question.validations = questionAdvanceSettingSvc.fillMissedValidations($scope.question.validations, $scope.question.id);
        }

        function onRequiredValidationChange() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.advancedSettings.required, vm.requiredValidation.selected);
        }

        function setDefaultValue() {
            if (vm.isNumberQuestion) {
                $timeout(function () {
                    $rootScope.$broadcast('event:InitNumericQuestion', { validationSettingData: vm });
                }, 0);
            }
        }

        function onChangeNumericSettings() {
            $rootScope.$broadcast('event:ChangeHelpTextForStepNumber', { validationSettingData: vm });
        }

        function onChangeOptionDecimalPlaceOrStep(isStepNumberChanged) {
            $rootScope.$broadcast('event:ChangeOptionDecimalPlaceOrStep', {
                validationSettingData: vm,
                isStepNumberChanged: isStepNumberChanged
            });
        }
    }
})();
