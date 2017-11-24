(function () {
    'use stric';
    describe('Testing importRespondentCtrl controller', function () {
        var scope, pushDownSvc, respondentListDataSvc, surveyDataSvc, importRespondentSvc, q, ctrl;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.surveyId = '1';
                scope.handleAfterSave = jasmine.createSpy();

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', [
                    'hidePushDown', 'setLoadingStatus'
                ]);

                respondentListDataSvc = jasmine.createSpyObj('respondentListDataSvc', [
                    'upload', 'importContacts']);
                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', [
                    'getSurveyInfo']);

                importRespondentSvc = jasmine.createSpyObj('importRespondentSvc', [
                    'validateRespondentFile'
                ]);

                ctrl = $controller('importRespondentCtrl', {
                    $scope: scope,
                    pushDownSvc: pushDownSvc,
                    respondentListDataSvc: respondentListDataSvc,
                    surveyDataSvc: surveyDataSvc,
                    importRespondentSvc: importRespondentSvc
                });
            });
        });

        describe('Testing closeMe function', function () {
            it('should hide push down', function () {
                ctrl.close();

                expect(pushDownSvc.hidePushDown).toHaveBeenCalled();
            });
        });

        describe('Testing uploadFile function', function () {
            var result = true;

            it('should not upload invalid file', function () {
                importRespondentSvc.validateRespondentFile.and.returnValue(false);

                ctrl.uploadFile(result);

                expect(respondentListDataSvc.importContacts).not.toHaveBeenCalled();
            });

            describe('With valid file', function() {
                beforeEach(function() {
                    importRespondentSvc.validateRespondentFile.and.returnValue(true);
                    ctrl.respondentFile = {};
                });

                it('should show success message when uploading successfully', function () {
                    spyOn(toastr, 'success');
                    respondentListDataSvc.importContacts.and.returnValue({ $promise: q.when({}) });
                    surveyDataSvc.getSurveyInfo.and.returnValue({ $promise: q.when({}) });

                    ctrl.uploadFile(result);
                    scope.$digest();

                    expect(surveyDataSvc.getSurveyInfo).toHaveBeenCalled();                    
                });

                it('should show error message when uploading unsuccessfully', function () {
                    spyOn(toastr, 'error');
                    respondentListDataSvc.importContacts.and.returnValue({ $promise: q.reject({ data: {} }) });

                    ctrl.uploadFile(result);
                    scope.$digest();

                    expect(respondentListDataSvc.importContacts).toHaveBeenCalled();
                    expect(toastr.error).toHaveBeenCalled();
                });
            });
        });
    });
})();