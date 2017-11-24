(function () {
    angular.module('svt').service('numericEditorSvc', numericEditorSvc);

    numericEditorSvc.$inject = ['numberUtilSvc', 'stringUtilSvc', 'settingConst'];

    function numericEditorSvc(numberUtilSvc, stringUtilSvc, settingConst) {
        var DIRECTION_MORE_TEXT = {
            LEFT: 1,
            RIGHT: 2,
            BOTH: 3
        };
        var HELPTEXT_COUNTER_NUMBER = 5;
        var PRE_HELPTEXT = 'Valid values: ';
        var MORE_TEXT = ' ... ';

        var numberSettings = {
            isShowStepNumber: false
        };

        var services = {
            getValidationByType: getValidationByType,
            validateNumberSetting: validateNumberSetting,
            setIsShowStepNumber: setIsShowStepNumber,
            getNumberSettings: getNumberSettings,
            convertStepIntoDecimalPlace: convertStepIntoDecimalPlace,
            convertDecimalPlaceIntoStep: convertDecimalPlaceIntoStep,
            renderHelpTextStepNumber: renderHelpTextStepNumber,
            isStepOver: isStepOver
        };

        return services;

        function getValidationByType(validations, type) {
            for (var i = 0; i < validations.length; i++) {
                var validation = validations[i];
                if (validation.$type === type) {
                    return validation;
                }
            }
            return null;
        }

        function validateNumberSetting(min, max, decimalPlaces, step) {
            if (!stringUtilSvc.isEmpty(min) && !stringUtilSvc.isEmpty(max) && min > max) {
                return { valid: false, message: 'Minimum value must be less than or equal Maximum value' };
            }

            var isShowStepNumber = getNumberSettings().isShowStepNumber;
            if (!isShowStepNumber) {
                if (!numberUtilSvc.isNumeric(decimalPlaces) || decimalPlaces < 0) {
                    return { valid: false, message: 'Decimal places value must be greater than or equal zero' };
                }
                if (decimalPlaces > settingConst.question.numericQuestion.decimalPlaceMaxValue) {
                    return { valid: false, message: 'Decimal Place must be less than ' + settingConst.question.numericQuestion.decimalPlaceMaxValue };
                }
            } else {
                if (!numberUtilSvc.isNumeric(step) || step <= 0) {
                    return { valid: false, message: 'Step value must be greater than zero' };
                }

                if (stringUtilSvc.isEmpty(min) && !stringUtilSvc.isEmpty(max) && step > max) {
                    return { valid: false, message: 'Step value must be among of Minimum and Maximum range' };
                }

                if (!stringUtilSvc.isEmpty(min) && !stringUtilSvc.isEmpty(max) && step > (max - min)) {
                    return { valid: false, message: 'Step value must be among of Minimum and Maximum range' };
                }

                if (isStepOver(step)) {
                    return { valid: false, message: 'Step must be less than ' + settingConst.question.numericQuestion.decimalPlaceMaxValue };
                }
            }

            return { valid: true, message: '' };
        }

        function setIsShowStepNumber(step) {
            numberSettings.isShowStepNumber = !stringUtilSvc.isEmpty(step);
        }

        function getNumberSettings() {
            return numberSettings;
        }

        function convertStepIntoDecimalPlace(step) {
            step = step + '';
            var stepAfterSplit = step.split('.');
            if (stepAfterSplit.length > 1) {
                return stepAfterSplit[1].length;
            }
            return 0;
        }

        function convertDecimalPlaceIntoStep(decimalPlace) {
            if (decimalPlace <= 0) return 1;

            var item = '0.';
            for (var i = 1; i <= decimalPlace; i++) {
                item += '0';
            }

            item = item.substr(0, item.length - 1) + '1';
            return Number(item);
        }

        function renderHelpTextStepNumber(min, max, step) {
            var numbers = [];
            var text = '';

            if (!stringUtilSvc.isEmpty(min) && !stringUtilSvc.isEmpty(max)) {
                numbers = getListNumberByStep(min, max, step);
                text = getText(numbers, DIRECTION_MORE_TEXT.BOTH);
            } else if (stringUtilSvc.isEmpty(min) && stringUtilSvc.isEmpty(max)) {
                numbers = getListNumberByStep(0, step * HELPTEXT_COUNTER_NUMBER, step);
                text = getText(numbers, DIRECTION_MORE_TEXT.BOTH);
            } else if (!stringUtilSvc.isEmpty(min) && stringUtilSvc.isEmpty(max)) {
                numbers = getListNumberByStep(min, min + step * HELPTEXT_COUNTER_NUMBER, step);
                text = getText(numbers, DIRECTION_MORE_TEXT.RIGHT);
            } else if (stringUtilSvc.isEmpty(min) && !stringUtilSvc.isEmpty(max)) {
                numbers = getListNumberByStep(max - step * HELPTEXT_COUNTER_NUMBER + step, max, step);
                text = getText(numbers, DIRECTION_MORE_TEXT.LEFT);
            }
            return text;

            function getListNumberByStep(min, max, step) {
                var list = [];
                var counter = 0;
                var fractionDigits = getFractionDigits(step);

                var i = min;
                while (true) {
                    if (counter >= HELPTEXT_COUNTER_NUMBER || i > max) break;

                    counter += 1;
                    list.push(i === 0 ? '0' : scientificToDecimal(i));

                    i = Math.round((i + step) * 1e12) / 1e12;
                }
                return list;
            }

            function getFractionDigits(value) {
                value = value + '';
                var m = value.split('.');
                if (m.length > 1) return m[1].length;
                return 0;
            }

            function getText(numbers, directionMoreText) {
                var result = '';
                var moreText = numbers.length < HELPTEXT_COUNTER_NUMBER ? '' : MORE_TEXT;

                if (directionMoreText === DIRECTION_MORE_TEXT.LEFT) {
                    result = PRE_HELPTEXT + moreText + numbers.join(', ');
                } else if (directionMoreText === DIRECTION_MORE_TEXT.RIGHT) {
                    result = PRE_HELPTEXT + numbers.join(', ') + moreText;
                } else if (directionMoreText === DIRECTION_MORE_TEXT.BOTH) {
                    result = PRE_HELPTEXT + moreText + numbers.join(', ') + moreText;
                }

                return result;
            }
        }

        function isStepOver(value) {
            value = scientificToDecimal(value) + '';

            var values = value.split('.');
            if (values.length > 1 && values[1].length > settingConst.question.numericQuestion.decimalPlaceMaxValue) {
                return true;
            }
            return false;
        }

        function scientificToDecimal(num) {
            if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
                var zero = '0',
                    parts = String(num).toLowerCase().split('e'),
                    e = parts.pop(),
                    l = Math.abs(e),
                    sign = e / l,
                    coeff_array = parts[0].split('.');
                if (sign === -1) {
                    num = zero + '.' + new Array(l).join(zero) + coeff_array.join('');
                } else {
                    var dec = coeff_array[1];
                    if (dec) l = l - dec.length;
                    num = coeff_array.join('') + new Array(l + 1).join(zero);
                }
            }

            return num;
        }
    }
})();