(function() {
    'use strict';
    describe('Testing pageSvc service', function() {
        var svc, pageDataSvc, arrayUtilSvc, languageStringUtilSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                pageDataSvc = jasmine.createSpyObj('pageDataSvc', ['addPage']);
                $provide.value('pageDataSvc', pageDataSvc);

                arrayUtilSvc = jasmine.createSpyObj('arrayUtilSvc', ['getItem']);
                $provide.value('arrayUtilSvc', arrayUtilSvc);

                languageStringUtilSvc = jasmine.createSpyObj('languageStringUtilSvc', ['buildLanguageString']);
                $provide.value('languageStringUtilSvc', languageStringUtilSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('pageSvc');
            });
        });

        describe('Testing handleCreateQuestion function', function () {
            var $scope, questionType, selectedQuestion, page, isAboveSelectedQuestion;

            beforeEach(function () {
                $scope = {};
                page = {
                    id: 5,
                    questionDefinitions: [{ id: 1 }, { id: 2 }, { id: 3 }]
                };
                spyOn(angular, 'element').and.returnValue({
                    html: jasmine.createSpy(),
                    off: jasmine.createSpy()
                });
            });

            it('should add question based on selected question', function () {
                selectedQuestion = { id: 2 };
                isAboveSelectedQuestion = true;

                svc.handleCreateQuestion($scope, questionType, selectedQuestion, page, isAboveSelectedQuestion);

                expect(angular.element).toHaveBeenCalledWith('#create-question-container-' + selectedQuestion.id);
            });

            it('should add question based on selected page', function () {
                selectedQuestion = null;

                svc.handleCreateQuestion($scope, questionType, selectedQuestion, page, isAboveSelectedQuestion);

                expect(angular.element).toHaveBeenCalledWith('#create-question-container-' + page.id);
            });
        });

        describe('Testing handleEditQuestion function', function () {
            it('should edit selected question', function () {
                spyOn(angular, 'element').and.returnValue({
                    replaceWith: jasmine.createSpy(),
                    off: jasmine.createSpy()
                });
                var question = {},
                    pageId = '1',
                    $scope = {
                        $new: jasmine.createSpy().and.returnValue({}),
                        pageCtrl: {
                            isThankYouPage: false
                        }
                    };

                svc.handleEditQuestion(question, pageId, $scope);

                expect(angular.element).toHaveBeenCalled();
            });
        });

        describe('Testing findPageIndexById function', function () {
            var array = [];
            beforeEach(function() {
                array = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
            });

            it('should return -1 when cannot find value in array', function () {
                var result = svc.findPageIndexById(array, 3);

                expect(result).toEqual(-1);
            });

            it('should return number when can find value in array', function () {
                var result = svc.findPageIndexById(array, 2);

                expect(result).toEqual(1);
            });
        });

        describe('Testing getPageById function', function () {
            var pageId, pages, result;

            it('should return null with invalid data', function () {
                pageId = 1;
                pages = {};

                result = svc.getPageById(pageId, pages);

                expect(result).toEqual(null);
            });

            it('should find page by page id', function () {
                pageId = 2;
                pages = [{ id: 1 }, { id: 2 }];

                svc.getPageById(pageId, pages);

                expect(arrayUtilSvc.getItem).toHaveBeenCalled();
            });
        });
    });
})();