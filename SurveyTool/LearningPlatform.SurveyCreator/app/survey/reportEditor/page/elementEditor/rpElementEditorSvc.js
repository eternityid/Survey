(function() {
    angular.module('svt').service('rpElementEditorSvc', rpElementEditorSvc);

    function rpElementEditorSvc() {
        var service = {
            getzIndexMax: getzIndexMax
        };
        return service;

        function getzIndexMax(pageData) {
            var elements = getElements();
            var zIndexMax = getMaxValue(elements, 'position.z');
            return zIndexMax;

            function getElements() {
                return (pageData && pageData.reportElementDefinitions) || [];
            }

            function getMaxValue(array, property) {
                if (!array) return 0;
                var values = array.map(function (item) { return Number(getItemByProperty(item, property) || 0); });
                return Math.max.apply(Math, values);
            }

            function getItemByProperty(item, property) {
                if (!property) return item;

                var properties = property.split('.');
                var it = angular.copy(item);
                for (var i = 0; i < properties.length; i++) {
                    it = it[properties[i]];
                }
                return it;
            }
        }
    }
})();