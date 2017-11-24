(function () {
    angular.module('svt')
        .filter('directoryContainFileFilter', DirectoryContainFileFilter);

    function DirectoryContainFileFilter() {
        return function (directories, directoryName, searchTerm) {
            if (!directories) return directories;
            var term = searchTerm.toLowerCase();
            return directories.filter(function (directory) {
                var directoryFilter = directoryName.toLowerCase() === 'all' ||
                    directory.name === directoryName;
                var fileNameFilter = directory.blobs.some(function (blob) {
                    return blob.fileName.toLowerCase().indexOf(term) >= 0;
                });
                return directoryFilter && fileNameFilter;
            });
        };
    }
})();