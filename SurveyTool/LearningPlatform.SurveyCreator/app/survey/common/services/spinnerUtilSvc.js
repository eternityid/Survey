(function() {
    angular
        .module('svt')
        .service('spinnerUtilSvc', spinnerUtilSvc);

    spinnerUtilSvc.$inject = ['$timeout', 'usSpinnerService'];

    function spinnerUtilSvc($timeout, usSpinnerService) {
        var svtOverlayElementId = '#svtOverlay';
        var svtSpinnerKey = 'svtSpinner';

        return {
            showSpinner: showSpinner,
            hideSpinner: hideSpinner
        };

        function showSpinner() {
            var svtOverlayElement = angular.element(document.querySelector(svtOverlayElementId));

            $timeout(function () {
                usSpinnerService.spin(svtSpinnerKey);
            }, 100);
            if (svtOverlayElement) {
                svtOverlayElement.show();
            }
        }

        function hideSpinner() {
            var svtOverlayElement = angular.element(document.querySelector(svtOverlayElementId));

            usSpinnerService.stop(svtSpinnerKey);
            if (svtOverlayElement) {
                svtOverlayElement.hide();
            }
        }
    }
})();