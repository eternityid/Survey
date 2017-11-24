(function () {
    'use strict';
    describe('Testing surveysCtrl controller', function () {
        var surveysCtrl,
            scope,
            pushDownSvc,
            surveyDataSvc,
            q,
            surveySvc,
            errorHandlingSvc,
            surveyListSvc,
            instanceController,
            exportSurveySvc,
            spinnerUtilSvc,
            $modal,
            domUtilSvc,
            libraryDataSvc,
            authSvc;

        var SurveyStatus = {
            NEW: 1,
            CLOSED: 0,
            TEMPORARILY_CLOSED: 2
        };

        beforeEach(function () {
            module('svt');
            inject(function ($rootScope, $controller, $q) {
                q = $q;
                scope = $rootScope.$new();
                scope.$parent = {
                    vm: {}
                };

                surveyDataSvc = jasmine.createSpyObj('surveyDataSvc', ['search', 'duplicateSurvey', 'exportSurvey']);
                surveyDataSvc.search.and.returnValue({
                    $promise: q.when({
                        surveys: [{ id: 1, name: 'abc' }],
                        totalSurveys: 10
                    })
                });

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);
                surveyListSvc = jasmine.createSpyObj('surveyListSvc', [
                    'spinnerShow', 'getDefaultSurveys', 'getDefaultPaging', 'getSearchForm', 'getCountForm',
                    'populateSurveys', 'spinnerHide', 'getDateOperatorTypes', 'getSearchStatusForCheckBoxList',
                    'getDefaultSearchModel', 'validateSearchData', 'getStatusForSearchModel',
                    'getDefaultForSearchStatusModel', 'buildSearchSurveysModel'
                ]);
                surveyListSvc.getDefaultPaging.and.returnValue({ dummy: 'dummy' });
                surveyListSvc.getDefaultSearchModel.and.returnValue({
                    createdDate: {},
                    modifiedDate: {},
                    status: {}
                });

                surveySvc = jasmine.createSpyObj('surveySvc', ['surveyStatus']);
                surveySvc.surveyStatus = SurveyStatus;

                pushDownSvc = jasmine.createSpyObj('pushDownSvc', ['getPushDownSettings', 'setLoadingStatus', 'showCreateNewSurvey']);

                exportSurveySvc = jasmine.createSpyObj('exportSurveySvc', ['buildFile']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                domUtilSvc = jasmine.createSpyObj('domUtilSvc', ['filterKeyWhenTypingDate']);

                spyOn(angular, 'element').and.returnValue({
                    datepicker: jasmine.createSpy(),
                    off: jasmine.createSpy()
                });
                libraryDataSvc = jasmine.createSpyObj('libraryDataSvc', ['addToLibrary']);

                authSvc = jasmine.createSpyObj('authSvc', ['getLoginData']);
                authSvc.getLoginData.and.returnValue({});

                surveysCtrl = $controller('surveysCtrl', {
                    surveyDataSvc: surveyDataSvc,
                    $scope: scope,
                    errorHandlingSvc: errorHandlingSvc,
                    surveyListSvc: surveyListSvc,
                    surveySvc: surveySvc,
                    pushDownSvc: pushDownSvc,
                    exportSurveySvc: exportSurveySvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    $modal: $modal,
                    domUtilSvc: domUtilSvc,
                    libraryDataSvc: libraryDataSvc,
                    authSvc: authSvc
                });
                scope.$digest();
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(surveysCtrl.surveysFound).toBeDefined();
                expect(surveysCtrl.searchString).toBeDefined();
                expect(surveysCtrl.surveys).toBeDefined();
                expect(surveysCtrl.paging).toBeDefined();
            });
        });

        describe('Testing showImportForm function', function () {
            it('should call searching function', function () {
                surveysCtrl.showCreateNewSurvey();
                scope.$digest();

                expect(surveyDataSvc.search).toHaveBeenCalled();
            });
        });

        describe('Testing search function', function () {
            it('should call service search function with default paging', function () {
                surveysCtrl.searchString = '';
                surveysCtrl.search();

                expect(surveyListSvc.getDefaultPaging).toHaveBeenCalled();
                expect(surveyDataSvc.search).toHaveBeenCalled();
            });

            it('should update surveys and paging when searching has no problem', function () {
                surveyDataSvc.search.and.callFake(function () {
                    var defer = q.defer();
                    defer.resolve({
                        surveys: [{ dummy: 'dummy' }],
                        totalSurveysFound: 10
                    });
                    return {
                        $promise: defer.promise
                    };
                });
                surveysCtrl.paging.start = 0;
                surveysCtrl.surveysFound = 0;
                surveysCtrl.search();
                scope.$digest();

                expect(surveysCtrl.paging.start).toBeGreaterThan(0);
                expect(surveysCtrl.surveys.length).toBeGreaterThan(0);
                expect(surveysCtrl.paging.hashNext).toEqual(true);
            });

            it('should process error when searching has problem', function () {
                surveyDataSvc.search.and.callFake(function () {
                    var defer = q.defer();
                    defer.reject({});
                    return {
                        $promise: defer.promise
                    };
                });
                surveysCtrl.search();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing loadMore function', function () {
            it('should update surveys and paging when loading more surveys has no problem', function () {
                surveyDataSvc.search.and.callFake(function () {
                    var defer = q.defer();
                    defer.resolve({
                        surveys: [{ dummy: 'dummy' }],
                        totalSurveysFound: 10
                    });
                    return {
                        $promise: defer.promise
                    };
                });
                surveysCtrl.paging.start = 0;
                surveysCtrl.surveys = undefined;

                surveysCtrl.loadMore();
                expect(surveyDataSvc.search).toHaveBeenCalled();
                scope.$digest();

                expect(surveyListSvc.getSearchForm).toHaveBeenCalled();
            });

            it('should process error when loading more surveys has problem', function () {
                surveyDataSvc.search.and.callFake(function () {
                    var defer = q.defer();
                    defer.reject({});
                    return {
                        $promise: defer.promise
                    };
                });
                surveysCtrl.loadMore();
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing duplicateSurvey function', function () {
            it('should duplicateSurvey when duplicating survey success', function () {
                surveyDataSvc.duplicateSurvey.and.returnValue({ $promise: q.when([{}]) });
                var surveyId = 1;
                surveysCtrl.duplicateSurvey(surveyId);
                scope.$digest();

                expect(surveyListSvc.getDefaultPaging).toHaveBeenCalled();
                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
            });

            it('should process error when duplicating survey has problem', function () {
                surveyDataSvc.duplicateSurvey.and.returnValue({ $promise: q.reject({}) });
                var surveyId = 1;

                surveysCtrl.duplicateSurvey(surveyId);
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing exportSurvey function', function () {
            it('should export survey when exporting success', function () {
                surveyDataSvc.exportSurvey.and.returnValue({ $promise: q.when([{}]) });
                var survey = { id: 1, title: 'dummy' };
                surveysCtrl.exportSurvey(survey);
                scope.$digest();

                expect(exportSurveySvc.buildFile).toHaveBeenCalled();
                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
            });

            it('should process error when exporting survey has problem', function () {
                surveyDataSvc.exportSurvey.and.returnValue({ $promise: q.reject({}) });
                var survey = { id: 1, title: 'dummy 2' };

                surveysCtrl.exportSurvey(survey);
                scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing changeCheckAll function', function () {
            it('should check statusValue when having checkAll', function () {
                var result,
                    checkAll = true;
                result = surveysCtrl.changeCheckAll();
            });
        });

        describe('Testing getSurveyStatusClass function', function () {
            it('should check survey status delete', function () {
                var result,
                    survey = { isDeleted: true };
                result = surveysCtrl.getSurveyStatusClass(survey);
                expect(result).not.toEqual('');
            });

            it('should check survey status NEW', function () {
                var result,
                    survey = { status: SurveyStatus.NEW };
                result = surveysCtrl.getSurveyStatusClass(survey);
                expect(result).not.toEqual('');
            });

            it('should check survey status OPEN', function () {
                var result,
                    survey = { status: SurveyStatus.OPEN };
                result = surveysCtrl.getSurveyStatusClass(survey);
                expect(result).not.toEqual('');
            });

            it('should check survey status CLOSED', function () {
                var result,
                    survey = { status: SurveyStatus.CLOSED };
                result = surveysCtrl.getSurveyStatusClass(survey);
                expect(result).not.toEqual('');
            });

            it('should check survey status CLOSED', function () {
                var result,
                survey = { status: SurveyStatus.TEMPORARILY_CLOSED };
                result = surveysCtrl.getSurveyStatusClass(survey);
                expect(result).not.toEqual('');
            });
        });

    });
})();