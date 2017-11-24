(function () {
    angular.module('svt')
        .constant('fileLibraryConstants', {
            INVALID_FILE: {
                MAX_FILE_SIZE: { key: 0, value: 'Max file size is invalid' },
                ACCEPT_MIME_TYPES: { key: 1, value: 'File type is invalid' },
                IS_NOT_EXISTS: { key: 2, value: 'Hard drive file is not exists' }
            },
            DEFAULT_FOLDER: 'Uncategorised',
            MAX_FILE_SIZE: 5 * 1024 * 1024,
            IMAGE_MIME_TYPES: ['image/gif', 'image/jpeg', 'image/png'],
            DOCUMENT_MINE_TYPES: [],

            ALLOW_CHANGE_IMAGE_DIMENSION: true,

            INVALID_HARD_DRIVE_FILE: {
                FOLDER_NAME: { key: 0, value: 'Folder name is invalid' },
                FILE_NAME_WITHOUT_EXT: { key: 1, value: 'File name is invalid' }
            },    
            PICKER_UPLOADER_DISPLAY_MODES: {
                fromLibrary: 'FromLibrary',
                fromHardDrive: 'FromHardDrive',
                fromInternet: 'FromInternet'
            }
        });
})();