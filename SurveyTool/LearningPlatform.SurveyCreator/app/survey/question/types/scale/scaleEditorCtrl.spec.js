(function () {
	'use strict';
	describe('Testing scaleEditorCtrl controller', function () {
        var ctrl, scope, scaleQuestionSvc;

		beforeEach(function () {
		    module('svt');

			inject(function ($rootScope, $controller) {
			    scope = $rootScope.$new();
			    scope.question = {};

			    scaleQuestionSvc = jasmine.createSpyObj('scaleQuestionSvc', []);

			    ctrl = $controller('scaleEditorCtrl', {
			        $scope: scope,
			        scaleQuestionSvc: scaleQuestionSvc
			    });
			});
		});
	});
})();