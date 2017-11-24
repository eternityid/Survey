(function () {
    angular
        .module('svt')
        .controller('previewSurveyCtrl', previewSurveyCtrl);

    previewSurveyCtrl.$inject = ['$scope', '$sce', 'testHost', 'baseHost', 'spinnerUtilSvc'];

    function previewSurveyCtrl($scope, $sce, testHost, baseHost, spinnerUtilSvc) {
        var vm = this;
        vm.getIframeSrc = null;
        vm.activeIframe = false;

        $scope.$watch('selectSurveyId', function () {
            if (!$scope.selectSurveyId) return;

            vm.activeIframe = false;
            var src = $scope.libraryId ?
                baseHost + '/library/' + $scope.libraryId + '/survey/' + $scope.selectSurveyId + '?v=' + new Date().getTime() :
                testHost + '/' + $scope.selectSurveyId + '?v=' + new Date().getTime();
            vm.getIframeSrc = $sce.trustAsResourceUrl(src);

            angular.element('iframe#preview-frame').one('load', function () {
                $scope.$apply(function () {
                    vm.activeIframe = true;
                });
            });
        });
    }
})();