(function () {
    'use strict';

    angular
        .module('svt')
        .factory('layoutDataSvc', layoutDataSvc);

    layoutDataSvc.$inject = ['$resource', 'host'];

    function layoutDataSvc($resource, host) {
        var dataService = {
            getAllLayouts: getAllLayouts
        };

        return dataService;
        function getAllLayouts() {
            return $resource(host + '/layouts', {}, { 'getAllLayouts': { method: 'GET', isArray: true } }).getAllLayouts({});
        }
    }
})();