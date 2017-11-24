(function () {
    'use strict';
    describe('Testing questionPreviewerSvc service', function () {
        var svc,
            questionEditorSvc,
            questionWithOptionsSvc;

        beforeEach(function () {
            module('svt');
            module(function ($provide) {
                questionEditorSvc = jasmine.createSpyObj('questionEditorSvc', ['cleanValidationsForSaving']);
                questionWithOptionsSvc = jasmine.createSpyObj('questionWithOptionsSvc', ['getDefaultOptionsMask']);

                $provide.value('questionEditorSvc', questionEditorSvc);
                $provide.value('questionWithOptionsSvc', questionWithOptionsSvc);
            });
            inject(function ($injector) {
                svc = $injector.get('questionPreviewerSvc');
            });
        });

        describe('Testing addOrUpdateUpdatingCommand function', function () {
            var result,
                commandType= -1,
                value=1;
            it('Should checked selector when it is null', function () {

                result = svc.addOrUpdateUpdatingCommand(commandType, value);

                expect(result).not.toEqual(null);
            });
        });

        describe('Testing addReloadCommand function', function () {
            var result,
                question = {},
                copyOfQuestion = { alias: 1, guid: 1, optionList: { Options :[]} };
            it('Should checked OptionList when it is null', function () {
                result = svc.addReloadCommand(question);

               expect(result).not.toEqual(null);
            });
        });

        describe('Testing getLatestReloadCommand function', function () {
            var result,
                reloadCommands = [];
            it('Should checked reloadCommands when it is null', function () {
                var reloadCommands = null;
                result = svc.getLatestReloadCommand();

                expect(result).toEqual(null);
            });
        });
    });
})();