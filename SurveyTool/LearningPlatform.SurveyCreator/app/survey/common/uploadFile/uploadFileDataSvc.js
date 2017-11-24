(function () {

    'use strict';

    angular.module('svt').factory('uploadFileDataSvc', uploadFileDataSvc);

    uploadFileDataSvc.$inject = ['$resource', 'host'];

    function uploadFileDataSvc($resource, host) {
        return {
            uploadFile: uploadFile
        };

        function uploadFile(fileUpload, isUploadOnAzure) {
            var uploadForm = new FormData();
            uploadForm.append('file', fileUpload);

            return $resource(host + '/upload/file', {}, { 'upload': { method: 'POST', transformRequest: angular.identity, headers: { 'Content-Type': undefined, 'isUploadOnAzure': isUploadOnAzure } } })
                        .upload({ }, uploadForm);
        }
    }

})();