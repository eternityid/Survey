(function () {
    'use strict';
    describe('Testing rsOpenTextQuestionSvc service', function () {
        var svc;

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                svc = $injector.get('rsOpenTextQuestionSvc');
            });
        });

        describe('Testing buildTable function', function () {
            it('should build destination table base on source table', function () {
                var destinationTable = [];
                var sourceTable = ['Line 1', 'Line 2', ' '];
                var expectedDestinationTable = [{ key: 0, text: 'Line 1' }, { key: 1, text: 'Line 2' }];

                svc.buildTable(destinationTable, sourceTable);

                expect(destinationTable).toEqual(expectedDestinationTable);
            });
        });

    });
})();