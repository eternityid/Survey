(function () {
    angular
        .module('svt')
        .directive('webUploader', WebUploader);

    function WebUploader() {
        var directive = {
            restrict: 'E',
            scope: {
                libraries: '=',
                library: '=?',
                data: '=',
                config: '=',
                model: '=?',
                onCancel: '&',
                onSave: '&'
            },
            templateUrl: 'survey/fileLibrary/webUploader/web-uploader.html',
            controller: 'webUploaderCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();