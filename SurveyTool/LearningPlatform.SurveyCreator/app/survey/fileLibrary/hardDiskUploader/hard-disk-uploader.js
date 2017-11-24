(function () {
    angular
        .module('svt')
        .directive('hardDiskUploader', HardDiskUploader);

    function HardDiskUploader() {
        var directive = {
            restrict: 'E',
            scope: {
                config: '=',
                libraries: '=?',
                library: '=?',                
                model: '=?',
                onCancel: '&',
                onSave: '&'
            },
            templateUrl: 'survey/fileLibrary/hardDiskUploader/hard-disk-uploader.html',
            controller: 'hardDiskUploaderCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();