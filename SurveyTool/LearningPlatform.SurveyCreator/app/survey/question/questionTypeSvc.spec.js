(function () {
    describe('Testing questionTypeSvc service', function () {
        var svc;

        beforeEach(function () {
            module('svt');
            inject(function($injector) {
                svc = $injector.get('questionTypeSvc');
            });
        });

        describe('Testing getNameQuestionType function', function () {
            it('should return the Question type name', function() {
                var result = svc.getNameQuestionType('SingleSelectionQuestionDefinition');

                expect(result).toEqual('Single Selection');
            });
        });
    });
})();