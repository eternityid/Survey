(function () {
    angular
        .module('svt')
        .directive('fileLibraryPicker', FileLibraryPicker);

    function FileLibraryPicker() {
        var directive = {
            restrict: 'E',
            scope: {
                config: '=',
                library: '=',
                blob: '=',
                selectedImageUrl: '=?',
                model:'=?',
                onCancel: '&',
                onSave: '&'
            },
            templateUrl: 'survey/fileLibrary/picker/file-library-picker.html',
            controller: 'fileLibraryPickerCtrl',
            controllerAs: 'vm'
        };

        return directive;
    }
})();