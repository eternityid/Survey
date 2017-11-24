(function () {
    'use strict';

    angular.module('svt')
        .constant('navigationRouteConst', {
            dashboard: '/surveys/:id/dashboard',
            designer: '/surveys/:id/designer',
            test: '/surveys/:id/test',
            responses: '/surveys/:id/responses',
            launch: '/surveys/:id/launch',
            results: '/surveys/:id/results',
            reportDesigner: '/reports/:id/designer/:surveyId'
        });
})();