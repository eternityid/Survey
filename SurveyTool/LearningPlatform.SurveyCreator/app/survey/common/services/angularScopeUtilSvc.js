(function() {
    angular.module('svt').service('angularScopeUtilSvc', angularScopeUtilSvc);

    function angularScopeUtilSvc() {
        var service = {
            safeApply: safeApply,
            safeDigest: safeDigest
        };
        return service;

        function safeApply(scope, fn) {
            if (!scope || !scope.$root) return;
            var phase = scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest')
                scope.$eval(fn);
            else
                scope.$apply(fn);
        }

        function safeDigest(scope, fn) {
            if (!scope || !scope.$root) return;
            var phase = scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest')
                scope.$eval(fn);
            else
                scope.$digest(fn);
        }
    }
})();