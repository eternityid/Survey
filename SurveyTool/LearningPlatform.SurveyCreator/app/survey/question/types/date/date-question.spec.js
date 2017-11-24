describe("Testing Date Question directive", function () {
    var element, scope, $compile;
    beforeEach(angular.mock.module('ngMockE2E'));
    beforeEach(module('svt', 'survey/question/types/date/date-question.html'));


    beforeEach(inject(function (_$compile_, $rootScope) {
        scope = $rootScope;
        scope.question = {
            title: {
                items: [
                {
                    text: 'value 1'
                }]
            },
            description: {
                items: [
                {
                    text: 'value 2'
                }]
            }
        };

        $compile = _$compile_;

        element = angular.element(
            '<date-question question="question" class="date-question-view"></date-question>');
        $compile(element)(scope);
        scope.$digest();
    }));

    it("should display the values", function () {
       var isoScope = element.isolateScope();
       expect(isoScope.question.description.items[0].text).toEqual('value 2');
       expect(isoScope.question.title.items[0].text).toEqual('value 1');
    });
});