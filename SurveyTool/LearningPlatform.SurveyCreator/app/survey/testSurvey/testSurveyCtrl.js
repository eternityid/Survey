(function () {
    'use strict';

    angular
        .module('svt')
        .controller('testSurveyCtrl', testSurveyCtrl);

    testSurveyCtrl.$inject = [
        '$routeParams', '$sce', 'testHost', 'surveyMenuSvc'
    ];

    function testSurveyCtrl($routeParams, $sce, testHost, surveyMenuSvc) {
        /* jshint -W040 */
        var vm = this;

        vm.init = init;

        vm.init();

        function init() {
            vm.surveyId = $routeParams.id;
            vm.url = $sce.trustAsResourceUrl(testHost + '/' + $routeParams.id + '?v=' + new Date().getTime());
            surveyMenuSvc.updateMenuForSurveyPreview(vm.surveyId);
        }
    }
})();