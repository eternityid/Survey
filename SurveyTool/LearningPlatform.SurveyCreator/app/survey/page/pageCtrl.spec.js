(function () {
    describe('Testing pageCtrl controller', function () {
        var q,
            pageCtrl,
            $scope, $route,
            $modal, stringUtilSvc,
            pageSvc, pageValidationSvc, pageDataSvc,
            questionSvc, questionTypeSvc, questionDataSvc,
            spinnerUtilSvc, errorHandlingSvc,
            surveyEditorSvc, surveyEditorPageSvc, surveyEditorQuestionSvc,
            httpStatusCode,
            surveyEditorValidationSvc,
            questionCarryOverSvc,
            indexSvc,
            questionConst,
            serverValidationSvc,
            moveQuestionSvc,
            movePageSvc;

        beforeEach(function () {
            module('svt');

            inject(function ($rootScope, $controller, $q, $injector) {
                q = $q;
                $scope = $rootScope.$new();
                $scope.index = 0;
                $scope.pageObj = { id: 1, questionDefinitions: [] };

                $route = jasmine.createSpyObj('$route', ['reload']);
                $modal = jasmine.createSpyObj('$modal', ['open']);
                stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', ['truncateByWordAmount']);

                pageSvc = jasmine.createSpyObj('pageSvc', [
                    'getNavigationButtonSettings', 'getQuestionOrders',
                    'getActivePage', 'getCollapsedPageIds', 'getCollapsedQuestionIds',
                    'getSkipCommandEditor', 'addPage', 'getPageById', 'setActivePage',
                    'setSkipCommandEditorId', 'setCurrentPages', 'handleCreateQuestion',
                    'handleEditQuestion', 'handleUpdateSkipCommand'
                ]);
                pageSvc.getNavigationButtonSettings.and.returnValue([]);
                pageSvc.getQuestionOrders.and.returnValue([]);
                pageSvc.getActivePage.and.returnValue({ pageId: null });
                pageSvc.getCollapsedPageIds.and.returnValue([]);
                pageSvc.getCollapsedQuestionIds.and.returnValue([]);

                pageValidationSvc = jasmine.createSpyObj('pageValidationSvc', [
                    'validateMovingQuestions', 'validateWhenRemovingQuestion', 'validateWhenRemovingPage'
                ]);
                pageValidationSvc.validateWhenRemovingQuestion.and.returnValue({});
                pageValidationSvc.validateWhenRemovingPage.and.returnValue({});

                pageDataSvc = jasmine.createSpyObj('pageDataSvc', [
                    'deletePage', 'getPage', 'movePage', 'duplicateQuestion']);

                questionSvc = jasmine.createSpyObj('questionSvc', [
                    'getModes', 'hideOldQuestionEditor',
                    'hideOldQuestionCreator', 'updateStatusModes', 'getTotalQuestion',
                    'toggleIsShowQuestionEditor',
                    'toggleIsShowQuestionCreator', 'getActiveQuestion', 'setActiveQuestion',
                    'resetSharedDataForQuestions', 'setupQuestionsWithOption',
                    'setupQuestionFromApi', 'getMovingPositionByStep', 'duplicateQuestionExceptId'
                ]);
                questionSvc.getTotalQuestion.and.returnValue(1);
                questionSvc.getActiveQuestion.and.returnValue({ questionId: null });

                questionTypeSvc = jasmine.createSpyObj('questionTypeSvc', [
                    'getNameQuestionType', 'isText', 'getCodeQuestionType', 'getTypeQuestionLongText'
                ]);
                questionTypeSvc.getNameQuestionType.and.returnValue('Single Selection');

                questionDataSvc = jasmine.createSpyObj('questionDataSvc', [
                    'moveQuestion', 'getAllById', 'deleteById']);

                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError', 'writeErrorToConsole']);

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'getData', 'getSurvey', 'getAllNoneInformationQuestionPositionsInSurvey',
                    'resetToViewMode', 'setSurveyEditMode',
                    'setPageEditorId', 'addNewPageFromApi', 'getPages',
                    'setQuestionEditorId', 'setupQuestionPositionInSurvey', 'setSurveyVersion',
                    'setTopFolderVersion'
                ]);
                surveyEditorSvc.getData.and.returnValue({});
                surveyEditorSvc.getSurvey.and.returnValue({ topFolder: { childNodes: [{ id: 1 }] } });

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', [
                    'handleDeletePage', 'getQuestionsByPageId', 'getPageById',
                    'isThankYouPage', 'handleRemoveSkipCommandInPage'
                ]);
                surveyEditorPageSvc.getQuestionsByPageId.and.returnValue([{ id: 1, questionMaskExpression: {} }, { id: 2, questionMaskExpression: {} }]);
                surveyEditorPageSvc.getPageById.and.returnValue({ id: 1 });
                surveyEditorPageSvc.isThankYouPage.and.returnValue(false);

                surveyEditorQuestionSvc = jasmine.createSpyObj('surveyEditorQuestionSvc', ['handleRemoveQuestion']);
                httpStatusCode = $injector.get('httpStatusCode');
                $location = jasmine.createSpyObj('$location', ['']);

                surveyEditorValidationSvc = jasmine.createSpyObj('surveyEditorValidationSvc', [
                    'movingQuestionData', 'validateMovingPage']);

                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', ['setupData']);

                indexSvc = jasmine.createSpyObj('indexSvc', ['callbackCheckOverlay']);
                questionConst = $injector.get('questionConst');
                serverValidationSvc = jasmine.createSpyObj('serverValidationSvc', ['getServerValidationTypes']);
                moveQuestionSvc = jasmine.createSpyObj('moveQuestionSvc', [
                    'handleDoneMoveQuestionToAnotherPage', 'handleDoneMoveQuestionsInPage']);
                movePageSvc = jasmine.createSpyObj('movePageSvc', ['handleDoneMovePages']);

                pageCtrl = $controller('pageCtrl', {
                    $scope: $scope,
                    $route: $route,
                    $modal: $modal,
                    stringUtilSvc: stringUtilSvc,
                    pageSvc: pageSvc,
                    pageValidationSvc: pageValidationSvc,
                    pageDataSvc: pageDataSvc,
                    questionSvc: questionSvc,
                    questionTypeSvc: questionTypeSvc,
                    questionDataSvc: questionDataSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    surveyEditorPageSvc: surveyEditorPageSvc,
                    surveyEditorQuestionSvc: surveyEditorQuestionSvc,
                    httpStatusCode: httpStatusCode,
                    surveyEditorValidationSvc: surveyEditorValidationSvc,
                    questionCarryOverSvc: questionCarryOverSvc,
                    indexSvc: indexSvc,
                    questionConst: questionConst,
                    serverValidationSvc: serverValidationSvc,
                    moveQuestionSvc: moveQuestionSvc,
                    movePageSvc: movePageSvc
                });
            });
        });

        describe('Testing pageCtrl controller properties', function () {
            it('should define required properties', function () {
                expect(pageCtrl.appendValue).toBeDefined();
                expect(pageCtrl.truncateNumberOfWord).toBeDefined();
                expect(pageCtrl.pages).toBeDefined();
                expect(pageCtrl.currentPage).toBeDefined();
                expect(pageCtrl.activePage).toBeDefined();
                expect(pageCtrl.activeQuestion).toBeDefined();
                expect(pageCtrl.collapsedPageIds).toBeDefined();
                expect(pageCtrl.collapsedQuestionIds).toBeDefined();
                expect(pageCtrl.generalConstant).toBeDefined();
                expect(pageCtrl.page).toBeDefined();
                expect(pageCtrl.navigationButtonSettings).toBeDefined();
                expect(pageCtrl.questionOrders).toBeDefined();
                expect(pageCtrl.isThankYouPage).toBeDefined();

                expect(pageCtrl.sortableOptionsQuestion).toBeDefined();
                expect(pageCtrl.surveyEditorData).toBeDefined();

                expect(pageCtrl.getReadyToCreateQuestion).toBeDefined();
                expect(pageCtrl.truncateQuestionTitle).toBeDefined();
                expect(pageCtrl.getReadyToEditQuestion).toBeDefined();
                expect(pageCtrl.getReadyToEditPage).toBeDefined();
                expect(pageCtrl.onDeletePage).toBeDefined();
                expect(pageCtrl.removeQuestion).toBeDefined();
                expect(pageCtrl.toggleCollapsePage).toBeDefined();
                expect(pageCtrl.toggleCollapseQuestion).toBeDefined();
                expect(pageCtrl.getQuestionType).toBeDefined();
            });

            it('should initialize properties value', function () {
                expect(pageSvc.getActivePage).toHaveBeenCalled();
                expect(questionSvc.getActiveQuestion).toHaveBeenCalled();
                expect(pageSvc.getCollapsedPageIds).toHaveBeenCalled();
                expect(pageSvc.getCollapsedQuestionIds).toHaveBeenCalled();
                expect(surveyEditorPageSvc.isThankYouPage).toHaveBeenCalled();
            });

            describe('Testing sortableOptionsQuestion.accept function', function () {
                var sourceItemHandleScope;
                beforeEach(function () {
                    sourceItemHandleScope = {
                        itemScope: {}
                    };
                });

                it('should return true with valid data', function () {
                    sourceItemHandleScope.itemScope.question = {};
                    sourceItemHandleScope.itemScope.answer = null;

                    var result = pageCtrl.sortableOptionsQuestion.accept(sourceItemHandleScope);

                    expect(result).toBeTruthy();
                });

                it('should return true with invalid data', function () {
                    sourceItemHandleScope.itemScope.question = null;

                    var result = pageCtrl.sortableOptionsQuestion.accept(sourceItemHandleScope);

                    expect(result).toBeFalsy();
                });
            });

            describe('Testing sortableOptionsQuestion.dragStart function', function () {
                it('should set survey access mode', function () {
                    pageCtrl.sortableOptionsQuestion.dragStart();

                    expect(surveyEditorSvc.setSurveyEditMode).toHaveBeenCalledWith(true);
                });
            });

            describe('Testing sortableOptionsQuestion.dragEnd function', function () {
                it('should set survey access mode', function () {
                    pageCtrl.sortableOptionsQuestion.dragEnd();

                    expect(surveyEditorSvc.setSurveyEditMode).toHaveBeenCalledWith(false);
                });
            });
        });

        describe('Testing init function', function () {
            it('should call service to get question by page id', function () {
                pageCtrl.init();

                expect(surveyEditorPageSvc.getQuestionsByPageId).toHaveBeenCalled();
            });
        });

        describe('Testing moveQuestion function', function () {
            var event;
            beforeEach(function () {
                event = {
                    dest: {
                        sortableScope: {
                            $parent: {
                                pageCtrl: {
                                    currentPage: {
                                        id: 1
                                    }
                                }
                            }
                        },
                        index: 1
                    },
                    source: {
                        itemScope: {
                            question: {
                                id: 2,
                                pageId: 2
                            }
                        },
                        sortableScope: {
                            $parent: {
                                pageCtrl: {
                                    currentPage: {}
                                }
                            }
                        },
                        index: 2
                    }
                };
            });

            it('should not move unmovable question', function () {
                pageValidationSvc.validateMovingQuestions.and.returnValue(false);

                var countBefore = $route.reload.calls.count();
                pageCtrl.sortableOptionsQuestion.orderChanged(event);

                expect($route.reload.calls.count()).toBeGreaterThan(countBefore);
            });

            describe('Testing moveToAnotherPage function', function () {
                beforeEach(function () {
                    surveyEditorPageSvc.isThankYouPage.and.returnValue(false);
                    pageValidationSvc.validateMovingQuestions.and.returnValue(true);
                });

                it('should update questions in page when moving question to another page was successful', function () {
                    questionDataSvc.moveQuestion.and.returnValue({ $promise: q.when({ headers: {}, data: '{}' }) });
                    questionDataSvc.getAllById.and.returnValue({ $promise: q.when([{ id: 1 }, { id: 2 }]) });

                    pageCtrl.sortableOptionsQuestion.orderChanged(event);
                    $scope.$digest();

                    expect(moveQuestionSvc.handleDoneMoveQuestionToAnotherPage).toHaveBeenCalled();
                });

                describe('Failed cases', function () {
                    it('should show error to get latest data', function () {
                        questionDataSvc.moveQuestion.and.returnValue({ $promise: q.reject({ status: 412 }) });

                        pageCtrl.sortableOptionsQuestion.orderChanged(event);
                        $scope.$digest();

                        expect(errorHandlingSvc.manifestError).toHaveBeenCalledWith('This question has changed. Please refresh to get the newest data', jasmine.any(Object));
                    });

                    it('should show other errors', function () {
                        questionDataSvc.moveQuestion.and.returnValue({ $promise: q.reject({}) });

                        pageCtrl.sortableOptionsQuestion.orderChanged(event);
                        $scope.$digest();

                        expect(errorHandlingSvc.manifestError).toHaveBeenCalledWith('Moving question was not successful.', jasmine.any(Object));
                    });
                });
            });

            describe('Testing moveInsidePage function', function () {
                beforeEach(function () {
                    surveyEditorPageSvc.isThankYouPage.and.returnValue(false);
                    pageValidationSvc.validateMovingQuestions.and.returnValue(true);
                    event.source.itemScope.question.pageId = 1;
                });

                it('should update questions in page when moving question in page was successful', function () {
                    questionDataSvc.moveQuestion.and.returnValue({ $promise: q.when({ headers: {}, data: '{}' }) });
                    questionDataSvc.getAllById.and.returnValue({ $promise: q.reject() });

                    pageCtrl.sortableOptionsQuestion.orderChanged(event);
                    $scope.$digest();

                    expect(moveQuestionSvc.handleDoneMoveQuestionsInPage).toHaveBeenCalled();
                });

                it('should process error when moving question in page has problem', function () {
                    questionDataSvc.moveQuestion.and.returnValue({ $promise: q.reject({}) });

                    pageCtrl.sortableOptionsQuestion.orderChanged(event);
                    $scope.$digest();

                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                });
            });
        });

        describe('Testing getReadyToEditPage function', function () {
            it('should show Page Editor successfully', function () {
                var pageId = '1';
                pageCtrl.getReadyToEditPage(pageId);

                expect(surveyEditorSvc.resetToViewMode).toHaveBeenCalled();
                expect(surveyEditorSvc.setPageEditorId).toHaveBeenCalledWith(pageId);

                expect(pageSvc.setActivePage).toHaveBeenCalledWith(pageCtrl.currentPage.id);
                expect(questionSvc.setActiveQuestion).toHaveBeenCalledWith(null);
            });
        });

        describe('Testing onDeletePage function', function () {
            var event;
            beforeEach(function () {
                event = jasmine.createSpyObj('event', ['stopPropagation']);
                pageCtrl.currentPage.id = 1;
                pageCtrl.questionsInPage = [];
            });

            it('should do nothing when the total of page is less than or equal minimum total page', function () {
                pageCtrl.generalConstant = { MIN_TOTAL_PAGE: 1 };
                pageCtrl.onDeletePage(event);
                $scope.$digest();

                expect(event.stopPropagation).toHaveBeenCalled();
                expect(surveyEditorPageSvc.handleDeletePage).not.toHaveBeenCalled();
                expect($modal.open).not.toHaveBeenCalled();
            });

            it('should delete page without confirmation', function () {
                pageCtrl.generalConstant = {
                    MIN_TOTAL_PAGE: 0,
                    MIN_TOTAL_QUESTION_IN_PAGE: 1
                };
                pageDataSvc.deletePage.and.callFake(function () {
                    var defer = q.defer();
                    defer.resolve({ headers: {} });
                    return { $promise: defer.promise };
                });
                pageCtrl.onDeletePage(event);
                $scope.$digest();

                expect(surveyEditorPageSvc.handleDeletePage).toHaveBeenCalled();
                expect(pageSvc.setActivePage).toHaveBeenCalledWith(null);
                expect(questionSvc.setActiveQuestion).toHaveBeenCalledWith(null);
            });

            describe('When showing confirmation', function () {
                beforeEach(function () {
                    pageCtrl.generalConstant = {
                        MIN_TOTAL_PAGE: 0,
                        MIN_TOTAL_QUESTION_IN_PAGE: 0
                    };
                    pageCtrl.questionsInPage = [{}, { data: [{}] }];
                });

                it('should not delete page when cancelling popup', function () {
                    $modal.open.and.returnValue({ result: q.when({ status: false }) });

                    pageCtrl.onDeletePage(event);
                    $scope.$digest();

                    expect(pageDataSvc.deletePage).not.toHaveBeenCalled();
                });

                describe('Agree to delete page', function () {
                    beforeEach(function () {
                        $modal.open.and.returnValue({ result: q.when({ status: true }) });
                    });

                    it('should show error message when deleting page unsuccessfully', function () {
                        pageDataSvc.deletePage.and.returnValue({ $promise: q.reject({ status: 500 }) });
                        pageCtrl.onDeletePage(event);
                        $scope.$digest();

                        expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                    });

                });
            });
        });

        describe('Testing removeQuestion function', function () {
            var event = {}, question = {};

            beforeEach(function () {
                event.stopPropagation = jasmine.createSpy();
                question.id = 1;
            });

            it('should not delete question when cancelling popup', function () {
                $modal.open.and.returnValue({ result: q.when({}) });

                pageCtrl.removeQuestion(event, question);
                $scope.$digest();

                expect(questionDataSvc.deleteById).not.toHaveBeenCalled();
            });

            describe('Agree to delete question', function () {
                beforeEach(function () {
                    $modal.open.and.returnValue({ result: q.when({ status: true }) });
                });

                it('should remove question in client side after deleting question in server side', function () {
                    questionDataSvc.deleteById.and.returnValue({ $promise: q.when({ headers: {} }) });
                    spyOn(toastr, 'success');

                    pageCtrl.removeQuestion(event, question);
                    $scope.$digest();

                    expect(surveyEditorQuestionSvc.handleRemoveQuestion).toHaveBeenCalled();
                });

                it('should process error when deleting question has problem', function () {
                    questionDataSvc.deleteById.and.returnValue({ $promise: q.reject() });

                    pageCtrl.removeQuestion(event, question);
                    $scope.$digest();

                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                });
            });
        });

        describe('Testing toggleCollapsePage function', function () {
            var pageId = 1;

            it('should remove page id from collapsed collection', function () {
                pageCtrl.collapsedPageIds = [1, 2, 3];
                var oldIndex = pageCtrl.collapsedPageIds.indexOf(pageId);

                pageCtrl.toggleCollapsePage(pageId);
                var newIndex = pageCtrl.collapsedPageIds.indexOf(pageId);

                expect(newIndex).not.toEqual(oldIndex);
                expect(newIndex).toEqual(-1);
            });

            it('should add page id into collapsed collection', function () {
                pageCtrl.collapsedPageIds = [2, 3];
                var oldIndex = pageCtrl.collapsedPageIds.indexOf(pageId);

                pageCtrl.toggleCollapsePage(pageId);
                var newIndex = pageCtrl.collapsedPageIds.indexOf(pageId);

                expect(newIndex).not.toEqual(oldIndex);
                expect(newIndex).toBeGreaterThan(-1);
            });
        });

        describe('Testing toggleCollapseQuestion function', function () {
            var questionId = 4;

            it('should remove column id from collapsed collection', function () {
                pageCtrl.collapsedQuestionIds = [4, 5, 6];
                var oldIndex = pageCtrl.collapsedQuestionIds.indexOf(questionId);

                pageCtrl.toggleCollapseQuestion(questionId);
                var newIndex = pageCtrl.collapsedQuestionIds.indexOf(questionId);

                expect(newIndex).not.toEqual(oldIndex);
                expect(newIndex).toEqual(-1);
            });

            it('should add column id into collapsed collection', function () {
                pageCtrl.collapsedQuestionIds = [5, 6];
                var oldIndex = pageCtrl.collapsedQuestionIds.indexOf(questionId);

                pageCtrl.toggleCollapseQuestion(questionId);
                var newIndex = pageCtrl.collapsedQuestionIds.indexOf(questionId);

                expect(newIndex).not.toEqual(oldIndex);
                expect(newIndex).toBeGreaterThan(-1);
            });
        });

        describe('Testing removeSkipAction function', function () {
            var event = {
                stopPropagation: jasmine.createSpy('stopPropagation')
            };
            var skipCommandIndex = 1;

            it('should do nothing when user does not choose to delete skip action', function () {
                $modal.open.and.returnValue({ result: q.when({ status: false }) });

                pageCtrl.removeSkipAction(event, skipCommandIndex);
                $scope.$digest();
            });

            it('should show message when deleting skip action was successful', function () {
                $modal.open.and.returnValue({ result: q.when({ status: true }) });
                spyOn(toastr, 'success');

                pageCtrl.removeSkipAction(event, skipCommandIndex);
                $scope.$digest();
                $scope.$digest();
            });

            it('should process error when deleting skip action has problem', function () {
                $modal.open.and.returnValue({ result: q.when({ status: true }) });

                pageCtrl.removeSkipAction(event, skipCommandIndex);
                $scope.$digest();
                $scope.$digest();
            });
        });

        describe('Testing movePageUp function', function () {
            var page = {},
                index;

            it('should not move the first page up', function () {
                index = 0;

                pageCtrl.movePageUp(page, index);

                expect(surveyEditorValidationSvc.validateMovingPage).not.toHaveBeenCalled();
            });

            it('should move the second page up', function () {
                index = 1;
                surveyEditorValidationSvc.validateMovingPage.and.returnValue(false);

                pageCtrl.movePageUp(page, index);

                expect(surveyEditorValidationSvc.validateMovingPage).toHaveBeenCalled();
            });
        });

        describe('Testing movePageDown function', function () {
            var page = {},
                index;

            it('should not move the last page down', function () {
                pageCtrl.pages = [{}, {}];
                index = 1;

                pageCtrl.movePageDown(page, index);

                expect(surveyEditorValidationSvc.validateMovingPage).not.toHaveBeenCalled();
            });

            it('should move the second page up', function () {
                pageCtrl.pages = [{}, {}, {}, { $type: 'ThankYouPage' }];
                index = 1;
                surveyEditorValidationSvc.validateMovingPage.and.returnValue(true);
                pageDataSvc.movePage.and.returnValue({ $promise: q.when({}) });

                pageCtrl.movePageDown(page, index);
                $scope.$digest();

                expect(surveyEditorValidationSvc.validateMovingPage).toHaveBeenCalled();
            });
        });

        describe('Testing moveQuestionUp function', function () {
            var question = {},
                index;

            it('should not move the first question in the first page up', function () {
                $scope.index = 0;
                index = 0;

                pageCtrl.moveQuestionUp(question, index);

                expect(pageValidationSvc.validateMovingQuestions).not.toHaveBeenCalled();
            });

            it('should show error when cannot detect question position', function () {
                $scope.index = 10;
                index = 0;
                spyOn(toastr, 'error');
                questionSvc.getMovingPositionByStep.and.returnValue(null);

                pageCtrl.moveQuestionUp(question, index);

                expect(toastr.error).toHaveBeenCalled();
            });

            it('should move the first question of second page up', function () {
                $scope.index = 1;
                index = 0;
                questionSvc.getMovingPositionByStep.and.returnValue({});

                pageCtrl.moveQuestionUp(question, index);

                expect(pageValidationSvc.validateMovingQuestions).toHaveBeenCalled();
            });

            it('should move the second question up', function () {
                $scope.index = 0;
                index = 1;

                pageCtrl.moveQuestionUp(question, index);

                expect(pageValidationSvc.validateMovingQuestions).toHaveBeenCalled();
            });
        });

        describe('Testing moveQuestionDown function', function () {
            var question = {},
                index;

            beforeEach(function () {
                pageCtrl.pages = [{}, {}, {}];
                pageCtrl.questionsInPage = [{}, {}, {}, {}, {}];
            });

            it('should not move the last question down', function () {
                $scope.index = 1;
                index = 4;

                pageCtrl.moveQuestionDown(question, index);

                expect(pageValidationSvc.validateMovingQuestions).not.toHaveBeenCalled();
            });

            it('should show error when cannot detect question position', function () {
                index = 5;
                spyOn(toastr, 'error');
                questionSvc.getMovingPositionByStep.and.returnValue(null);

                pageCtrl.moveQuestionDown(question, index);

                expect(toastr.error).toHaveBeenCalled();
            });

            it('should move the first question down', function () {
                $scope.index = 0;
                index = 1;

                pageCtrl.moveQuestionDown(question, index);

                expect(pageValidationSvc.validateMovingQuestions).toHaveBeenCalled();
            });
        });

        describe('Testing selectPageByStep function', function () {
            var page = { id: '1' };

            beforeEach(function () {
                pageCtrl.activePage = {};
            });

            it('should expand selected and collapsed page', function () {
                pageCtrl.activePage.pageId = '1';
                pageCtrl.collapsedPageIds = ['1', '3'];
                spyOn(pageCtrl, 'toggleCollapsePage');

                pageCtrl.selectPageByStep(page);

                expect(pageCtrl.toggleCollapsePage).toHaveBeenCalled();
            });

            it('should edit selected and expanded page', function () {
                pageCtrl.activePage.pageId = '1';
                pageCtrl.collapsedPageIds = ['3'];
                spyOn(pageCtrl, 'getReadyToEditPage');

                pageCtrl.selectPageByStep(page);

                expect(pageCtrl.getReadyToEditPage).toHaveBeenCalled();
            });

            it('should select un-selected page', function () {
                pageCtrl.activePage.pageId = '2';

                pageCtrl.selectPageByStep(page);

                expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
                expect(pageSvc.setActivePage).toHaveBeenCalled();
            });
        });

        describe('Testing selectQuestionByStep function', function () {
            var question = {};

            beforeEach(function () {
                pageCtrl.activeQuestion = { questionId: '1' };
                question.id = '1';
            });

            it('should expand selected and collapsed question', function () {
                pageCtrl.collapsedQuestionIds = ['1', '2'];
                spyOn(pageCtrl, 'toggleCollapseQuestion');

                pageCtrl.selectQuestionByStep(question);

                expect(pageCtrl.toggleCollapseQuestion).toHaveBeenCalled();
            });

            it('should edit selected and expanded question', function () {
                pageCtrl.collapsedQuestionIds = ['2'];
                question.$type = 'OpenEndedTextQuestionDefinition';
                spyOn(pageCtrl, 'getReadyToEditQuestion');

                pageCtrl.selectQuestionByStep(question);

                expect(pageCtrl.getReadyToEditQuestion).toHaveBeenCalled();
            });

            it('should edit selected skip action', function () {
                pageCtrl.collapsedQuestionIds = ['2'];
                question.$type = 'SkipCommand';
                question.clientId = '1';
                spyOn(pageCtrl, 'getReadyToEditSkipAction');

                pageCtrl.selectQuestionByStep(question);

                expect(pageCtrl.getReadyToEditSkipAction).toHaveBeenCalled();
            });

            it('should select un-selected question', function () {
                question.clientId = '2';

                pageCtrl.selectQuestionByStep(question);

                expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
                expect(pageSvc.setActivePage).toHaveBeenCalled();
            });
        });

        describe('Testing canClickToMovePageUp function', function () {
            var result;

            beforeEach(function () {
                pageCtrl.isThankYouPage = false;
            });

            it('should permit to move second page up', function () {
                $scope.index = 1;

                result = pageCtrl.canClickToMovePageUp();

                expect(result).toEqual(true);
            });

            it('should not permit to move the first page up', function () {
                $scope.index = 0;

                result = pageCtrl.canClickToMovePageUp();

                expect(result).toEqual(false);
            });
        });

        describe('Testing canClickToMovePageDown function', function () {
            var result;

            beforeEach(function () {
                pageCtrl.isThankYouPage = false;
                pageCtrl.pages = [{}, {}, {}];
            });

            it('should permit to move down page that is not the previous page of last page', function () {
                $scope.index = 0;

                result = pageCtrl.canClickToMovePageDown();

                expect(result).toEqual(true);
            });

            it('should not permit to move up the previous page of last page', function () {
                $scope.index = 1;
                pageCtrl.pages = [{}, {}, {}];

                result = pageCtrl.canClickToMovePageDown();

                expect(result).toEqual(false);
            });
        });

        describe('Testing canClickToDeletePage function', function () {
            var result;

            beforeEach(function () {
                pageCtrl.isThankYouPage = false;
            });

            it('should permit to delete the second and not last page', function () {
                pageCtrl.pages = [{}, {}, {}];

                result = pageCtrl.canClickToDeletePage();

                expect(result).toEqual(true);
            });

            it('should not permit to delete page when survey just has two pages', function () {
                pageCtrl.pages = [{}, {}];

                result = pageCtrl.canClickToDeletePage();

                expect(result).toEqual(false);
            });
        });

        describe('Testing canClickToMoveQuestion function', function () {
            var result,
                questionId;

            beforeEach(function () {
                pageCtrl.isThankYouPage = false;
                pageCtrl.activeQuestion = { questionId: '1' };
            });

            it('should permit to move active question', function () {
                questionId = '1';

                result = pageCtrl.canClickToMoveQuestion(questionId);

                expect(result).toEqual(true);
            });

            it('should not permit to move inactive question', function () {
                questionId = '2';

                result = pageCtrl.canClickToMoveQuestion(questionId);

                expect(result).toEqual(false);
            });
        });

        describe('Testing isSelectingQuestion function', function () {
            it('should detect selecting question', function () {
                var result;
                pageCtrl.activeQuestion = {
                    questionId: '10'
                };

                var questionId = '1';
                result = pageCtrl.isSelectingQuestion(questionId);
                expect(result).toEqual(false);

                questionId = '10';
                result = pageCtrl.isSelectingQuestion(questionId);
                expect(result).toEqual(true);
            });
        });

        describe('Testing canClickToMoveQuestionUp function', function () {
            var result, questionIndex;

            it('should not permit to move up question in ThankYou page', function () {
                pageCtrl.isThankYouPage = true;

                result = pageCtrl.canClickToMoveQuestionUp(questionIndex);

                expect(result).toEqual(false);
            });

            it('should not permit to move up the first question in survey', function () {
                pageCtrl.isThankYouPage = false;
                $scope.index = 0;
                questionIndex = 0;

                result = pageCtrl.canClickToMoveQuestionUp(questionIndex);

                expect(result).toEqual(false);
            });

            it('should permit to move up question', function () {
                pageCtrl.isThankYouPage = false;
                $scope.index = 1;
                questionIndex = 1;

                result = pageCtrl.canClickToMoveQuestionUp(questionIndex);

                expect(result).toEqual(true);
            });
        });

        describe('Testing canClickToMoveQuestionDown function', function () {
            var result, questionIndex;

            it('should not permit to move down question in ThankYou page', function () {
                pageCtrl.isThankYouPage = true;

                result = pageCtrl.canClickToMoveQuestionDown(questionIndex);

                expect(result).toEqual(false);
            });

            it('should not permit to move down the last question in the page before ThankYou page', function () {
                pageCtrl.isThankYouPage = false;
                $scope.index = 0;
                pageCtrl.pages = [{}, {}];
                pageCtrl.questionsInPage = [{}];
                questionIndex = 0;

                result = pageCtrl.canClickToMoveQuestionDown(questionIndex);

                expect(result).toEqual(false);
            });

            it('should permit to move down question', function () {
                pageCtrl.isThankYouPage = false;
                $scope.index = 0;
                pageCtrl.pages = [{}, {}, {}];
                questionIndex = 0;

                result = pageCtrl.canClickToMoveQuestionDown(questionIndex);

                expect(result).toEqual(true);
            });
        });

        describe('Testing isEditingQuestion function', function () {
            it('should detect editing question', function () {
                var result;
                pageCtrl.surveyEditorData = {
                    questionEditorId: '2'
                };

                var questionId = 10;
                result = pageCtrl.isEditingQuestion(questionId);
                expect(result).toEqual(false);

                questionId = '2';
                result = pageCtrl.isEditingQuestion(questionId);
                expect(result).toEqual(true);
            });
        });

        describe('Testing isEditingSkipAction function', function () {
            it('should detect editing skip action', function () {
                var result;
                pageSvc.getSkipCommandEditor.and.returnValue({ id: '5' });

                var skipCommandId = '2';
                result = pageCtrl.isEditingSkipAction(skipCommandId);
                expect(result).toEqual(false);

                skipCommandId = '5';
                result = pageCtrl.isEditingSkipAction(skipCommandId);
                expect(result).toEqual(true);
            });
        });

        describe('Testing isCollapsedQuestion function', function () {
            it('should detect collapsed question', function () {
                var result, questionId = '2';

                pageCtrl.collapsedQuestionIds = [];
                result = pageCtrl.isCollapsedQuestion(questionId);
                expect(result).toEqual(false);

                pageCtrl.collapsedQuestionIds = ['2', '3'];
                result = pageCtrl.isCollapsedQuestion(questionId);
                expect(result).toEqual(true);
            });
        });

        describe('Testing isRequiredQuestion function', function () {
            it('should detect question has required validation', function () {
                var result, question = {};
                serverValidationSvc.getServerValidationTypes.and.returnValue({
                    required: 'Required'
                });

                question.validations = [];
                result = pageCtrl.isRequiredQuestion(question);
                expect(result).toEqual(false);


                question.validations = [{ $type: 'Required' }];
                result = pageCtrl.isRequiredQuestion(question);
                expect(result).toEqual(true);
            });
        });

        describe('Testing duplicateQuestion function', function () {
            var question = { id: 'q1', title: 'dummy' }, questionIndex = 0;
            beforeEach(function () {
                questionSvc.duplicateQuestionExceptId.and.returnValue({ title: 'dummy' });
            });

            it('should add question into page after duplicating question is successful', function () {
                pageCtrl.questionsInPage = [{ id: '1' }, { id: '2' }];
                var numberOfQuestions = pageCtrl.questionsInPage.length;
                pageDataSvc.duplicateQuestion.and.returnValue({ $promise: q.when({ data: '{}', headers: {} }) });

                pageCtrl.duplicateQuestion(question, questionIndex);
                $scope.$digest();

                expect(pageCtrl.questionsInPage.length).toEqual(numberOfQuestions + 1);
                expect(pageSvc.setActivePage).toHaveBeenCalled();
            });

            it('should process error when duplicating question has problem', function () {
                pageDataSvc.duplicateQuestion.and.returnValue({ $promise: q.reject({ status: 500 }) });

                pageCtrl.duplicateQuestion(question, questionIndex);
                $scope.$digest();

                expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
            });
        });

        describe('Testing Add Up and Down question', function () {
            var selectedQuestion = {};

            it('should add up question into page', function () {
                pageCtrl.createAboveQuestion(selectedQuestion);

                expect(pageSvc.handleCreateQuestion).toHaveBeenCalled();
            });


            it('should add down question into page', function () {
                pageCtrl.createBelowQuestion(selectedQuestion);

                expect(pageSvc.handleCreateQuestion).toHaveBeenCalled();
            });
        });
    });
})();