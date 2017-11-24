(function() {
    angular.module('svt').service('objectUtilSvc', objectUtilSvc);

    function objectUtilSvc() {
        var service = {
            createObjectFrom: createObjectFrom
        };
        return service;

        function createObjectFrom(item) {
            if (item instanceof Array) return {};
            if (item === undefined || item === null || typeof item !== 'object') return {};
            return item;
        }
    }
})();