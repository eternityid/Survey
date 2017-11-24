(function () {
    angular.module('svt').controller('numericEditorCtrl', NumericEditorCtrl);

    NumericEditorCtrl.$inject = ['$scope', 'questionPreviewerSvc', 'numberUtilSvc', 'stringUtilSvc',
        'numericEditorSvc', 'settingConst'];

    function NumericEditorCtrl($scope, questionPreviewerSvc, numberUtilSvc, stringUtilSvc,
        numericEditorSvc, settingConst) {

        var vm = this;

        init();

        function init() {
            questionPreviewerSvc.addReloadCommand($scope.question);
            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                var rangeNumberValidation = numericEditorSvc.getValidationByType(evt.currentScope.question.validations, 'RangeNumberValidation');
                var decimalPlacesNumberValidation = numericEditorSvc.getValidationByType(evt.currentScope.question.validations, 'DecimalPlacesNumberValidation');
                var isShowStepNumber = numericEditorSvc.getNumberSettings().isShowStepNumber;

                if (!rangeNumberValidation && !decimalPlacesNumberValidation) return { valid: true, message: '' };
                if (isShowStepNumber) {
                    if (stringUtilSvc.isEmpty(evt.currentScope.question.step)) {
                        evt.currentScope.question.step = settingConst.question.numericQuestion.stepDefault;
                    }
                    decimalPlacesNumberValidation.decimalPlaces = null;
                } else {
                    if (stringUtilSvc.isEmpty(decimalPlacesNumberValidation.decimalPlaces)) {
                        decimalPlacesNumberValidation.decimalPlaces = settingConst.question.numericQuestion.decimalPlaceDefault;
                    }
                    evt.currentScope.question.step = null;
                }

                var result = numericEditorSvc.validateNumberSetting(
                    rangeNumberValidation.min,
                    rangeNumberValidation.max,
                    decimalPlacesNumberValidation.decimalPlaces,
                    evt.currentScope.question.step);
                callBack(result);
            });

            $scope.$on('event:InitNumericQuestion', function (event, data) {
                var validationSettingCtrl = data.validationSettingData;

                numericEditorSvc.setIsShowStepNumber(event.currentScope.question.step);
                validationSettingCtrl.numberSettings = numericEditorSvc.getNumberSettings();

                if (!validationSettingCtrl.numberSettings.isShowStepNumber && stringUtilSvc.isEmpty(validationSettingCtrl.decimalPlacesNumberValidation.decimalPlaces)) {
                    validationSettingCtrl.decimalPlacesNumberValidation.decimalPlaces = settingConst.question.numericQuestion.decimalPlaceDefault;
                }
                if (validationSettingCtrl.numberSettings.isShowStepNumber && stringUtilSvc.isEmpty($scope.question.step)) {
                    event.currentScope.question.step = settingConst.question.numericQuestion.stepDefault;
                }
                renderHelpText(event, data);
            });

            $scope.$on('event:ChangeHelpTextForStepNumber', function (event, data) {
                renderHelpText(event, data);
            });

            $scope.$on('event:ChangeOptionDecimalPlaceOrStep', function (event, data) {
                var validationSettingCtrl = data.validationSettingData;
                validationSettingCtrl.numberSettings.isShowStepNumber = data.isStepNumberChanged;

                if (validationSettingCtrl.numberSettings.isShowStepNumber) {
                    event.currentScope.question.step = numericEditorSvc.convertDecimalPlaceIntoStep(validationSettingCtrl.decimalPlacesNumberValidation.decimalPlaces);
                    validationSettingCtrl.decimalPlacesNumberValidation.decimalPlaces = null;
                } else {
                    validationSettingCtrl.decimalPlacesNumberValidation.decimalPlaces = numericEditorSvc.convertStepIntoDecimalPlace(event.currentScope.question.step);
                    event.currentScope.question.step = null;
                }

                renderHelpText(event, data);
            });

            function renderHelpText(event, data) {
                var validationSettingCtrl = data.validationSettingData;
                var min = validationSettingCtrl.rangeNumberValidation.min;
                var max = validationSettingCtrl.rangeNumberValidation.max;
                var step = event.currentScope.question.step || settingConst.question.numericQuestion.stepDefault;
                var decimalPlace = validationSettingCtrl.decimalPlacesNumberValidation.decimalPlaces || settingConst.question.numericQuestion.decimalPlaceDefault;

                var validationMessage = numericEditorSvc.validateNumberSetting(min, max, decimalPlace, step);
                if (!validationMessage.valid) {
                    return;
                }

                if (!numericEditorSvc.getNumberSettings().isShowStepNumber) {
                    step = numericEditorSvc.convertDecimalPlaceIntoStep(decimalPlace);
                }

                validationSettingCtrl.helpTextForStepNumber = numericEditorSvc.renderHelpTextStepNumber(min, max, step);
            }
        }
    }
})();