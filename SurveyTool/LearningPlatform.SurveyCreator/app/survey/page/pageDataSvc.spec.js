(function() {
    'use strict';
    describe('Testing pageDataSvc service', function () {
        var httpBackend,
            pageDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                pageDataSvc = $injector.get('pageDataSvc');
            });
        });

        describe('Testing addPage function', function () {
            it('should add page', function () {
                var folder = {
                    surveyId: '1',
                    id: '2',
                    version: 'dummy'
                };
                var pageIndex = 1;
                httpBackend.expectPOST(hostMock + '/surveys/1/folders/2/pages', { pageIndex: 1 });
                httpBackend.whenPOST(hostMock + '/surveys/1/folders/2/pages').respond({});

                var result = pageDataSvc.addPage(folder, pageIndex);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing updatePage function', function () {
            it('should update page', function () {
                var folderId = "2",
                    pageAndTheme = { page: { surveyId: "1", folderId: "2", id: "3", rowVersion: {} } };
                httpBackend.expectPUT(hostMock + '/surveys/1/folders/2/pages/3', pageAndTheme);
                httpBackend.whenPUT(hostMock + '/surveys/1/folders/2/pages/3').respond({});

                var result = pageDataSvc.updatePage(folderId, pageAndTheme);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing deletePage function', function () {
            it('should delete page', function () {
                var folder = { id: '2', version: 'dummy' },
                    page = { surveyId: 1, id: 3 };
                httpBackend.expectDELETE(hostMock + '/surveys/1/folders/2/pages/3');
                httpBackend.whenDELETE(hostMock + '/surveys/1/folders/2/pages/3').respond({});

                var result = pageDataSvc.deletePage(folder, page);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing movePage function', function () {
            it('should move page', function () {
                var item = { surveyId: "1", pageId: "3", newPageIndex: 3 };
                var folder = { id: "2", version: 'dummy' };

                var url = hostMock + '/surveys/' + item.surveyId + '/folders/' + folder.id + '/pages/' + item.pageId + '/move';
                httpBackend.expectPOST(url);
                httpBackend.whenPOST(url).respond({});
                var result = pageDataSvc.movePage(folder, item);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();