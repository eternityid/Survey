(function () {
    angular
        .module('svt')
        .controller('libraryImagePreviewerCtrl', libraryImagePreviewerCtrl);

    libraryImagePreviewerCtrl.$inject = [
        '$scope', 'libraryConst', 'stringUtilSvc', 'fileLibrarySvc', 'libraryImagePreviewerSvc'
    ];

    function libraryImagePreviewerCtrl(
        $scope, libraryConst, stringUtilSvc, fileLibrarySvc, libraryImagePreviewerSvc) {

        var vm = this;
        vm.scale = { min: 0.1, max: 2 };

        vm.onChangeWidth = onChangeWidth;
        vm.onChangeHeight = onChangeHeight;
        vm.onChangeScale = onChangeScale;

        onInit();

        function onInit() {
            if (!angular.isObject($scope.imageSize)) {
                $scope.imageSize = {
                    width: undefined,
                    height: undefined
                };
            }
            vm.dimension = { scale: 1 };

            $scope.$watch('imageData', function () {
                if (!$scope.hasOwnProperty('imageData')) return;
                $scope.imageUrl = $scope.imageData;
            });

            $scope.$watch('imageUrl', function (newData, oldData) {
                if ($scope.imageUrl) {
                    var image = new Image();
                    image.onload = function () {
                        $scope.$apply(function () {
                            vm.realWidth = image.width;
                            vm.realHeight = image.height;

                            if ($scope.imageSize.width !== undefined) {
                                onChangeWidth();
                            } else {
                                if ($scope.imageSize.height !== undefined) {
                                    onChangeHeight();
                                } else {
                                    vm.dimension.scale = 1;
                                    onChangeScale();
                                }
                            }
                        });
                    };
                    image.src = $scope.imageUrl;

                    vm.formDataSourceUriValid = $scope.formDataSourceUriValid !== undefined ?
                        $scope.formDataSourceUriValid: true;
                    vm.enableScaleImageDimension = $scope.allowChangeImageDimension === 'true' &&
                        $scope.imageUrl !== null && vm.formDataSourceUriValid;
                } else {
                    vm.realWidth = undefined;
                    vm.realHeight = undefined;
                    $scope.imageSize.width = undefined;
                    $scope.imageSize.height = undefined;
                    vm.dimension.scale = 1;
                }
            });
        }

        function onChangeWidth() {
            if ($scope.imageSize.width > vm.realWidth * vm.scale.max) {
                $scope.imageSize.width = Math.floor(vm.realWidth * vm.scale.max);
            } else if ($scope.imageSize.width < vm.realWidth * vm.scale.min) {
                $scope.imageSize.width = Math.floor(vm.realWidth * vm.scale.min);
            }
            vm.dimension.scale = $scope.imageSize.width / vm.realWidth;
            $scope.imageSize.height = Math.floor(vm.realHeight * vm.dimension.scale);
        }

        function onChangeHeight() {
            if ($scope.imageSize.height > vm.realHeight * vm.scale.max) {
                $scope.imageSize.height = Math.floor(vm.realHeight * vm.scale.max);
            } else if ($scope.imageSize.height < vm.realHeight * vm.scale.min) {
                $scope.imageSize.height = Math.floor(vm.realHeight * vm.scale.min);
            }
            vm.dimension.scale = $scope.imageSize.height / vm.realHeight;
            $scope.imageSize.width = Math.floor(vm.realWidth * vm.dimension.scale);
        }

        function onChangeScale() {
            $scope.imageSize.width = Math.floor(vm.realWidth * $scope.$$childHead.rzSliderModel);
            $scope.imageSize.height = Math.floor(vm.realHeight * $scope.$$childHead.rzSliderModel);

            if (!vm.enableScaleImageDimension) return;
        }
    }
})();