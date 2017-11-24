(function () {
    'use strict';
    describe('Testing editedLabelDataSvc service', function () {
        var httpBackend,
            editedLabelDataSvc,
            hostMock = 'https://localhost:44302/api';

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                httpBackend = $injector.get('$httpBackend');
                editedLabelDataSvc = $injector.get('editedLabelDataSvc');
            });
        });

        describe('Testing addEditedLabel function', function () {
            it('should add new edited label', function () {
                var label = { reportId: 0, reportElementHasQuestionId: 0 };
                httpBackend.expectPOST(hostMock + '/reports/0/elements/0/definition/editedlabels', label);
                httpBackend.whenPOST(hostMock + '/reports/0/elements/0/definition/editedlabels').respond({});
                var result = editedLabelDataSvc.addEditedLabel(label);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });

        describe('Testing updateEditedLabel function', function () {
            it('should update label', function () {
                var label = { reportId: 0, reportElementHasQuestionId: 0 };
                httpBackend.expectPATCH(hostMock + '/reports/0/elements/0/definition/editedlabels', label);
                httpBackend.whenPATCH(hostMock + '/reports/0/elements/0/definition/editedlabels').respond({});
                var result = editedLabelDataSvc.updateEditedLabel(label);
                httpBackend.flush();

                expect(result).toBeDefined();
            });
        });
    });
})();