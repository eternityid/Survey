(function () {
    'use strict';

    angular
        .module('svt')
        .directive('libraryImagePreviewer', LibraryImagePreviewer);

    LibraryImagePreviewer.$inject = ['stringUtilSvc', 'fileLibrarySvc'];

    function LibraryImagePreviewer(stringUtilSvc, fileLibrarySvc) {
        var directive = {
            restrict: 'E',
            scope: {
                allowChangeImageDimension: '@',
                formDataSourceUriValid: '@?',
                imageUrl: '=?',
                imageData: '=?',
                imageSize: '=?'
            },
            templateUrl: 'survey/fileLibrary/libraryImagePreviewer/library-image-previewer.html',
            controller: 'libraryImagePreviewerCtrl',
            controllerAs: 'vm',
            link: libraryImagePreviewerLink
        };

        return directive;
    }


    function libraryImagePreviewerLink (scope, element, attrs) {
        var clicking = false;
        var previousX;
        var previousY;

        angular.element(".scrollable-image", element).mousedown(function (e) {
            e.preventDefault();
            previousX = e.clientX;
            previousY = e.clientY;
            clicking = true;
        });

        angular.element(".scrollable-image", element).mouseup(function (e) {
            clicking = false;
        });

        angular.element(".scrollable-image", element).mousemove(function (e) {
            if (clicking) {
                e.preventDefault();
                angular.element(".scrollable-image", element).scrollLeft(angular.element(".scrollable-image", element).scrollLeft() + (previousX - e.clientX));
                angular.element(".scrollable-image", element).scrollTop(angular.element(".scrollable-image", element).scrollTop() + (previousY - e.clientY));
                previousX = e.clientX;
                previousY = e.clientY;
            }
        });
    }

})();