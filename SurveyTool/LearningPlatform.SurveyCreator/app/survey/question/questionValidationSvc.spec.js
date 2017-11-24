(function () {
    'use strict';
    describe('Testing questionValidationSvc service', function () {
        var svc,
            settingConst,
            stringUtilSvc,
            surveyEditorSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide, $injector) {
                settingConst = $injector.get('settingConst');
                //stringUtilSvc = $injector.get('stringUtilSvc');

                //numberUtilSvc = jasmine.createSpyObj('numberUtilSvc', ['isInteger']);
                //numberUtilSvc.isInteger.and.callFake(function (value) {
                //    var newValue = '' + value;
                //    return ('' + parseInt(value)) === newValue;
                //});

                //stringUtilSvc = jasmine.createSpyObj('stringUtilSvc', [
                //    'truncateByWordAmount', 'isEmpty', 'isEmptyFromHtml'
                //]);

                //stringUtilSvc.isEmpty.and.callFake(function(value) {
                //    return (value === null || value === undefined || 0 === String(value).trim().length);
                //});

                //stringUtilSvc.isEmptyFromHtml.and.callFake(function (value) {
                //    return stringUtilSvc.isEmpty(htmlToPlaintext(value));

                //    function htmlToPlaintext(text) {
                //        return angular.isString(text) ? text.replace(/<[^>]+>/gm, '').replace(/&nbsp;/gi, ' ') : '';
                //    }
                //});

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', ['getQuestions']);

                $provide.value('settingConst', settingConst);
                //$provide.value('stringUtilSvc', stringUtilSvc);
                $provide.value('surveyEditorSvc', surveyEditorSvc);
            });

            inject(function($injector) {
                svc = $injector.get('questionValidationSvc');
            });
        });

        describe('Testing validateQuestionTitle function', function () {
            var question,
                result;

            beforeEach(function () {
                question = {
                    title: {
                        items: [{ text: '' }]
                    }
                };
            });

            it('should set valid to true when question title is valid', function () {
                question.title.items[0].text = 'dummy';

                result = svc.validateQuestionTitle(question);

                expect(result.valid).toEqual(true);
            });

            it('should set valid to false when question title is empty', function () {
                result = svc.validateQuestionTitle(question);

                expect(result.valid).toEqual(false);
            });
        });

        describe('Testing validateQuestionAlias function', function () {
            var question = {},
                result;

            it('should set valid to false when question alias is empty', function () {
                question.alias = '';

                result = svc.validateQuestionAlias(question);

                expect(result.valid).toEqual(false);
            });

            it('should set valid to false when question alias contains special character', function () {
                question.alias = '^*%abc';

                result = svc.validateQuestionAlias(question);

                expect(result.valid).toEqual(false);
            });

            it('should set valid to false when question alias is too long', function () {
                question.alias = 'dummydummydummydummydummydummydummydummydummydummydummy';

                result = svc.validateQuestionAlias(question);

                expect(result.valid).toEqual(false);
            });

            it('should set valid to false when question alias is duplicated', function () {
                question.alias = 'duplicated';
                surveyEditorSvc.getQuestions.and.returnValue([{ alias: 'not duplicated', id: 1 }, { alias: 'duplicated', id: 2 }]);

                result = svc.validateQuestionAlias(question);

                expect(result.valid).toEqual(false);
            });

            it('should set valid to true when question alias is valid', function () {
                question.alias = 'valid';
                surveyEditorSvc.getQuestions.and.returnValue([{ alias: 'dummy', id: 1 }]);

                result = svc.validateQuestionAlias(question);

                expect(result.valid).toEqual(true);
            });
        });

        describe('Testing validateQuestionTitleAndAlias function', function () {
            var question,
                result;

            it('should validate question title', function () {
                spyOn(svc, 'validateQuestionTitle').and.returnValue({ valid: false });

                result = svc.validateQuestionTitleAndAlias(question);

                expect(svc.validateQuestionTitle).toHaveBeenCalled();
                expect(result.valid).toEqual(false);
            });

            it('should validate question alias', function () {
                spyOn(svc, 'validateQuestionTitle').and.returnValue({ valid: true });
                spyOn(svc, 'validateQuestionAlias');

                result = svc.validateQuestionTitleAndAlias(question);

                expect(svc.validateQuestionAlias).toHaveBeenCalled();
            });
        });
    });
})();