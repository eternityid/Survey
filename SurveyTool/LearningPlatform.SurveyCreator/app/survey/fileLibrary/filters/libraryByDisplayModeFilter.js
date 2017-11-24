(function () {
    angular.module('svt')
        .filter('libraryByDisplayModeFilter', LibraryByDisplayModeFilter);
    LibraryByDisplayModeFilter.$inject = [
        'fileLibraryConstants', 'libraryConst'];

    function LibraryByDisplayModeFilter(
        fileLibraryConstants, libraryConst) {
        return function (libraries, displayMode) {
            if (!libraries) return libraries;
            return libraries.filter(function (library) {
                return displayMode === fileLibraryConstants.PICKER_UPLOADER_DISPLAY_MODES.fromLibrary ?
                    true :
                    library.type === libraryConst.libraryTypes.user;
            });
        };
    }
})();