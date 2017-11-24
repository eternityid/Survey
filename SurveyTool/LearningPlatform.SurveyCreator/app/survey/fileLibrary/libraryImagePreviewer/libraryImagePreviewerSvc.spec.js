(function () {
    'use strict';
    describe('Testing libraryImagePreviewerSvc service', function () {
        var svc,
            urlUtilSvc,
            numberUtilSvc;

        beforeEach(function () {
            module('svt');

            module(function ($provide) {
                urlUtilSvc = jasmine.createSpyObj('urlUtilSvc', ['']);
                numberUtilSvc = jasmine.createSpyObj('numberUtilSvc', ['']);

                $provide.value('urlUtilSvc', urlUtilSvc);
                $provide.value('numberUtilSvc', numberUtilSvc);
            });

            inject(function ($injector) {
                svc = $injector.get('libraryImagePreviewerSvc');
            });
        });

        describe('Testing parseImageUrlWithParameters function', function () {
            var url,
                imageUrl,
                imageSize,
                allowChangeImageDimension;

            it('should return image url without parameter when do not permit to change image dimension', function () {
                imageUrl = 'http://image-path?image-parameter=parameter-value';
                allowChangeImageDimension = false;

                url = svc.parseImageUrlWithParameters(imageUrl, imageSize, allowChangeImageDimension);

                expect(url).toEqual('http://image-path');
            });

            it('should return updated image url with image size by values from image size settings', function () {
                imageUrl = 'http://image-path?height=15px&width=20px';
                imageSize = { width: 40, height: 30 };
                allowChangeImageDimension = true;

                url = svc.parseImageUrlWithParameters(imageUrl, imageSize, allowChangeImageDimension);

                expect(url).toEqual('http://image-path?width=40px&height=30px');
            });

            it('should return image url without parameters when do not set image size', function () {
                imageUrl = 'http://image-path?height=150px';
                imageSize = { width: undefined, height: undefined };
                allowChangeImageDimension = true;

                url = svc.parseImageUrlWithParameters(imageUrl, imageSize, allowChangeImageDimension);

                expect(url).toEqual('http://image-path');
            });
        });
    });
})();