(function () {
    angular
        .module('svt')
        .directive('fileLibraryWebUploader', FileLibraryWebUploader);

    function FileLibraryWebUploader() {
        var directive = {
            restrict: 'E',
            scope: {
                library: '=?',                
                config: '=',
                model:'=?',
                onCancel: '&',
                onSave: '&'
            },
            templateUrl: 'survey/fileLibrary/webUploader/file-library-web-uploader.html',
            controller: 'fileLibraryWebUploaderCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();