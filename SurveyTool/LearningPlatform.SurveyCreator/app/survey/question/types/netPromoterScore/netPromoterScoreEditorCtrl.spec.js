(function () {
	'use strict';
	describe('Testing netPromoterScoreEditorCtrl controller', function () {
	    var ctrl, scope, netPromoterScoreQuestionSvc;

	    beforeEach(function () {
	        module('svt');

			inject(function ($rootScope, $controller) {
			    scope = $rootScope.$new();
			    scope.question = {};

			    netPromoterScoreQuestionSvc = jasmine.createSpyObj('netPromoterScoreQuestionSvc', []);

			    ctrl = $controller('netPromoterScoreEditorCtrl', {
			        $scope: scope,
			        netPromoterScoreQuestionSvc: netPromoterScoreQuestionSvc
			    });
			});
		});
	});
})();