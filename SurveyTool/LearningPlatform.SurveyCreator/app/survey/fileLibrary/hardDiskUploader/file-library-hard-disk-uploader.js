(function () {
    angular
        .module('svt')
        .directive('fileLibraryHardDiskUploader', FileLibraryHardDiskUploader);

    function FileLibraryHardDiskUploader() {
        var directive = {
            restrict: 'E',
            scope: {
                config: '=',
                library: '=?',
                model: '=?',
                onCancel: '&',
                onSave: '&'
            },
            templateUrl: 'survey/fileLibrary/hardDiskUploader/file-library-hard-disk-uploader.html',
            controller: 'fileLibraryHardDiskUploaderCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();