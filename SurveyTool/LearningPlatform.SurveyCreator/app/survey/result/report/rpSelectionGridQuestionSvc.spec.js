(function () {
    'use strict';
    describe('Testing rpSelectionGridQuestionSvc service', function () {
        var rpSelectionGridQuestionSvc;

        beforeEach(function () {
            module('svt');
            inject(function ($injector) {
                rpSelectionGridQuestionSvc = $injector.get('rpSelectionGridQuestionSvc');
            });
        });
    });
})();