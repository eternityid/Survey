(function () {
    describe('Testing surveyEditorCtrl controller', function () {
        var ctrl, scope, pageSvc, pageDataSvc, questionSvc, surveyEditorDataSvc, modal, q,
            errorHandlingSvc, surveyEditorSvc, surveyEditorValidationSvc, surveyTitleAndStatusSvc,
            questionCarryOverSvc, spinnerUtilSvc, dialogSvc, stringUtilSvc, guidUtilSvc, surveyContentValidation,
            movePageSvc;

        beforeEach(function () {
            module('svt');
            inject(function($rootScope, $controller, $q) {
                scope = $rootScope.$new();
                q = $q;
                scope.$parent = {
                    vm: {}
                };
                spyOn(scope, '$on');

                pageSvc = jasmine.createSpyObj('pageSvc', [
                    'setCurrentPages', 'getCurrentPages', 'mergePage',
                    'hidePageEditor', 'setActivePage', 'getCollapsedPageIds', 'getCollapsedQuestionIds', 'hidePageEditor', 'getActivePage'
                ]);
                pageSvc.getCurrentPages.and.returnValue({ data: [{}] });
                pageSvc.getCollapsedPageIds.and.returnValue({});
                pageSvc.getCollapsedQuestionIds.and.returnValue({});

                pageDataSvc = jasmine.createSpyObj('pageDataSvc', ['movePage', 'mergePage']);
                questionSvc = jasmine.createSpyObj('questionSvc', [
                    'setSelectedSurveyId', 'setActiveQuestion', 'setupQuestionsFromApiSurvey',
                    'getQuestionsWithOptions', 'hideOldQuestionEditor', 'hideOldQuestionCreator'
                ]);

                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', [
                    'setupCarryOverData'
                ]);

                surveyEditorDataSvc = jasmine.createSpyObj('surveyEditorDataSvc', ['getSurvey', 'publishSurvey']);
                surveyEditorDataSvc.getSurvey.and.returnValue({ $promise: $q.when({ dummy: 'dummy' }) });

                modal = jasmine.createSpyObj('modal', ['open']);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError']);
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'getSurveyStatusDisplay', 'buildMovingPage', 'spinnerShow', 'spinnerHide',
                    'resetToViewMode', 'resetMovingPageEvent', 'getPages', 'setupClientSurveyFromApiSurvey',
                    'getSurvey', 'setSurveyEditMode', 'getPermitRefreshSurvey',
                    'setSurveyVersion', 'setTopFolderVersion'
                ]);
                surveyEditorSvc.getSurvey.and.returnValue({});

                surveyEditorValidationSvc = jasmine.createSpyObj('surveyEditorValidationSvc', ['validateMovingPage']);

                surveyTitleAndStatusSvc = jasmine.createSpyObj('surveyTitleAndStatusSvc', ['updateLatestChangedTimestamp']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                dialogSvc = jasmine.createSpyObj('dialogSvc', ['openDialog']);
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['getPlainText']);
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);
                surveyContentValidation = jasmine.createSpyObj('surveyContentValidation', ['validateLatestSurvey']);
                movePageSvc = jasmine.createSpyObj('movePageSvc', ['handleDoneMovePages']);

                ctrl = $controller('surveyEditorCtrl', {
                    $routeParams: { id: '3' },
                    pageSvc: pageSvc,
                    pageDataSvc: pageDataSvc,
                    questionSvc: questionSvc,
                    surveyEditorDataSvc: surveyEditorDataSvc,
                    $modal: modal,
                    $scope: scope,
                    $q: q,
                    errorHandlingSvc: errorHandlingSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    surveyEditorValidationSvc: surveyEditorValidationSvc,
                    questionCarryOverSvc: questionCarryOverSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    dialogSvc: dialogSvc,
                    stringUtilSvc: stringUtilSvc,
                    guidUtilSvc: guidUtilSvc,
                    surveyContentValidation: surveyContentValidation,
                    movePageSvc: movePageSvc
                });
                scope.$digest();
                ctrl.topFolder = {
                    id: 'topFolder1',
                    childNodes: []
                };
            });
        });

        describe('Testing surveyEditorCtrl controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.surveyTitleDisplay).toBeDefined();
                expect(ctrl.selectSurveyId).toBeDefined();
                expect(ctrl.pages).toBeDefined();
                expect(ctrl.collapsedPageIds).toBeDefined();
                expect(ctrl.collapsedQuestionIds).toBeDefined();
                expect(ctrl.sortableOptions.orderChanged).toBeDefined();
                expect(ctrl.sortableOptions.accept).toBeDefined();
                expect(ctrl.sortableOptions.containment).toBeDefined();
            });

            it('should set default value for properties', function () {
                expect(ctrl.selectSurveyId).toEqual('3');
                expect(pageSvc.getCollapsedPageIds).toHaveBeenCalled();
                expect(ctrl.sortableOptions.accept({ itemScope: { page: {} } })).toEqual(true);
                expect(ctrl.sortableOptions.accept({ itemScope: {} })).toEqual(false);
            });
        });

        describe('Testing showSurveyEditor function', function () {
            it('should change survey title', function () {
                modal.open.and.callFake(function () {
                    var defer = q.defer();
                    defer.resolve({
                        status: true,
                        survey: {
                            name: 'dummy',
                            status: true
                        }
                    });
                    return {
                        result: defer.promise
                    };
                });
                ctrl.surveyEditor = { dummy: 'dummy' };

                ctrl.showSurveyEditor();
                scope.$digest();
            });

            it('should change survey title', function () {
                modal.open.and.callFake(function () {
                    var defer = q.defer();
                    defer.resolve({
                        status: false,
                        survey: {
                            name: 'dummy',
                            status: true
                        }
                    });
                    return {
                        result: defer.promise
                    };
                });
                ctrl.surveyEditor = { dummy: 'dummy' };

                ctrl.showSurveyEditor();
                scope.$digest();

            });
        });

        describe('Testing movePage function', function () {
            var eventMock;
            beforeEach(function() {
                eventMock = {
                    dest: {
                        index: 4
                    },
                    source: {
                        index: 3,
                        itemScope: {
                            page: {
                                id: 14
                            }
                        }
                    }
                };
                surveyEditorSvc.buildMovingPage.and.returnValue({ pageId: 1 });
            });

            it('should not move non permitted moving page', function() {
                surveyEditorValidationSvc.validateMovingPage.and.returnValue(false);

                ctrl.sortableOptions.orderChanged(eventMock);

                expect(surveyEditorSvc.resetMovingPageEvent).toHaveBeenCalled();
            });

            it('should update page position when moving page has no problem', function () {
                ctrl.collapsedPageIds = [];
                pageDataSvc.movePage.and.callFake(function() {
                    var defer = q.defer();
                    defer.resolve({ headers: {}, data: '{}' });
                    return {
                        $promise: defer.promise
                    };
                });
                surveyEditorValidationSvc.validateMovingPage.and.returnValue(true);
                ctrl.sortableOptions.orderChanged(eventMock);

                expect(surveyEditorValidationSvc.validateMovingPage).toHaveBeenCalled();
                expect(surveyEditorSvc.buildMovingPage).toHaveBeenCalled();
                expect(spinnerUtilSvc.showSpinner).toHaveBeenCalled();
                expect(pageSvc.setActivePage).toHaveBeenCalled();
                expect(surveyEditorSvc.resetToViewMode).toHaveBeenCalled();
                expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
                scope.$digest();

                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                expect(movePageSvc.handleDoneMovePages).toHaveBeenCalled();
            });

            it('should process error when moving page has problem', function () {
                ctrl.collapsedPageIds = [1];
                pageDataSvc.movePage.and.callFake(function () {
                    var defer = q.defer();
                    defer.reject({});
                    return {
                        $promise: defer.promise
                    };
                });
                surveyEditorValidationSvc.validateMovingPage.and.returnValue(true);
                ctrl.sortableOptions.orderChanged(eventMock);
                scope.$digest();

                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
            });
        });

        describe('Testing loadSurvey function', function () {
            var surveyId;
            beforeEach(function() {
                surveyId = 3;
            });

            it('should get survey data when loading survey has no problem', function () {
                surveyEditorDataSvc.getSurvey.and.returnValue({ $promise: q.when({ dummy: 'dummy' }) });
                surveyEditorSvc.getPages.and.returnValue([{}]);
                surveyEditorSvc.getSurvey.and.returnValue({ TopFolder: { ChildNodes: [{}] } });

                ctrl.loadSurvey(surveyId);
                scope.$digest();

                expect(questionSvc.setSelectedSurveyId).toHaveBeenCalled();
                expect(spinnerUtilSvc.showSpinner).toHaveBeenCalled();
                expect(surveyEditorDataSvc.getSurvey).toHaveBeenCalled();
            });

            it('should process error when loading survey has problem', function () {
                surveyEditorDataSvc.getSurvey.and.callFake(function() {
                    var defer = q.defer();
                    defer.reject({});
                    return {
                        $promise: defer.promise
                    };
                });
                ctrl.loadSurvey(surveyId);
                scope.$digest();

                expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Test merge page', function () {
            it('should call merge page service', function () {
                var belowPage = {
                    title: {
                        items: [
                            {text: 'new item'}
                        ]
                    }
                };
                ctrl.pages = [{
                    id: 1,
                    title: {
                        items: [
                            { text: 'item 1' }
                        ]
                    }
                }, {
                    id: 2,
                    title: {
                        items: [
                            { text: 'item 2' }
                        ]
                    }
                }, {
                    id: 3,
                    title: {
                        items: [
                            { text: 'item 3' }
                        ]
                    }
                }];
                dialogSvc.openDialog.and.returnValue(q.when({ status: true }));
                pageDataSvc.mergePage.and.returnValue({
                    $promise: q.when(true)
                });

                ctrl.onMergePages(1, belowPage);
                scope.$digest();

                expect(spinnerUtilSvc.showSpinner).toHaveBeenCalled();
                expect(pageDataSvc.mergePage).toHaveBeenCalled();
            });
        });
    });
})();