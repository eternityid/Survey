(function () {
    'use strict';

    angular.module('svt')
        .constant('surveyErrorConst', {
            errorTypes: {
                carryOver: 'CarryOver',
                displayLogic: 'DisplayLogic',
                optionsMask: 'OptionsMask',
                skipAction: 'SkipAction'
            }
        });
})();