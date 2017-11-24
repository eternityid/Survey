(function () {
    'use strict';

    angular
        .module('svt')
        .directive('fileBase', FileBase);

    FileBase.$inject = ['fileBaseValidation', 'angularScopeUtilSvc'];

    function FileBase(fileBaseValidation, angularScopeUtilSvc) {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                config: '=?',
                onChangedFile: '=?',
                fileList: '=?'
            },
            link: function (scope, element, attrs, ngModel) {
                var isFirstTime = true;

                ngModel.$render = function () {
                    if (isFirstTime) return;
                    ngModel.$setViewValue(getBlob(element));
                };

                element.bind('change', function (event) {
                    scope.fileList = event.target.files;

                    var blobFile = event.target.files[0];
                    var fileValidation = fileBaseValidation.validate(blobFile, scope.config);
                    if (fileValidation) {
                        scope.onChangedFile(null, fileValidation);
                        return;
                    }

                    angularScopeUtilSvc.safeApply(scope, function () {
                        isFirstTime = false;
                        ngModel.$render();
                    });

                    var render = new FileReader();
                    render.onload = function (fileLoadedEvent) {
                        if (!scope.onChangedFile) return;

                        fileLoadedEvent.name = blobFile.name;
                        scope.onChangedFile(fileLoadedEvent);
                    };
                    render.readAsDataURL(blobFile);
                });

                function getBlob(element) {
                    return element.context.files.length > 0 ? element.context.files[0] : null;
                }
            }
        };

        return directive;
    }
})();