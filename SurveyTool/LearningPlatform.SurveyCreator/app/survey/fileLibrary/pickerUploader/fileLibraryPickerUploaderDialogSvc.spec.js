(function () {
    'use strict';
    describe('Testing fileLibraryPickerUploaderDialogSvc service', function () {
        var svc;

        beforeEach(function () {
            module('svt');

            inject(function ($injector) {
                svc = $injector.get('fileLibraryPickerUploaderDialogSvc');
            });
        });

        describe('Testing getLibraryIndexByBlobUrl function', function () {
            var libraries,
                url,
                result;

            it('should return -1 when url is null or undefined', function () {
                url = null;

                result = svc.getLibraryIndexByBlobUrl(libraries, url);

                expect(result).toEqual(-1);
            });

            it('should return -1 when directories does not contain the directory path of url', function () {
                url = 'http://dummy-path/dummyfile.ext';
                libraries = [{
                    directories: [{
                        blobs: [{
                            uri: 'http://dummy-path1'
                        }, {
                            uri: 'http://dummy-path2'
                        }]
                    }]
                }];

                result = svc.getLibraryIndexByBlobUrl(libraries, url);

                expect(result).toEqual(-1);
            });

            it('should return the index of library that has directory contains url', function () {
                url = 'http://dummy-path/dummy-file.ext?dummy-parameter=dummy-value';
                libraries = [{
                    directories: []
                }, {
                    directories: [{
                        blobs: []
                    }, {
                        blobs: [{
                            uri: 'http://dummy-path/file1'
                        }, {
                            uri: 'http://dummy-path/dummy-file.ext'
                        }]
                    }]
                }];

                result = svc.getLibraryIndexByBlobUrl(libraries, url);

                expect(result).toEqual(1);
            });
        });
    });
})();