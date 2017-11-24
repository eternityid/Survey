(function() {
    angular.module('svt').service('reportElementDataSvc', reportElementDataSvc);
    reportElementDataSvc.$inject = ['$resource', 'host'];

    function reportElementDataSvc($resource, host) {
        var service = {
            addReportElement: addReportElement,
            updateReportElement: updateReportElement,
            deleteReportElement: deleteReportElement,
            updateElementPosition: updateElementPosition,
            updateElementPositions: updateElementPositions,
            updateElementSize: updateElementSize
        };
        return service;

        function addReportElement(element) {
            return $resource(host + '/reports/:reportId/definition/elements', { reportId: '@reportId' }, { 'AddReportElement': { method: 'POST' } })
                .AddReportElement({ reportId: element.reportId }, JSON.stringify(element));
        }

        function updateReportElement(element) {
            return $resource(host + '/reports/:reportId/definition/elements', { reportId: '@reportId' }, { 'UpdateReportElement': { method: 'PUT' } })
                .UpdateReportElement({ reportId: element.reportId }, JSON.stringify(element));
        }

        function deleteReportElement(element) {
            return $resource(host + '/reports/:reportId/definition/elements/:elementId', { reportId: '@reportId', elementId: '@elementId' }, { 'DeleteById': { method: 'DELETE' } })
               .DeleteById({ reportId: element.reportId, elementId: element.id });
        }

        function updateElementPosition(element) {
            return $resource(host + '/reports/:reportId/definition/elements/:elementId/position', { reportId: '@reportId', elementId: '@elementId' }, { 'UpdateElementPosition': { method: 'PATCH' } })
                .UpdateElementPosition({ reportId: element.reportId, elementId: element.id }, JSON.stringify(element.position));
        }

        function updateElementPositions(element) {
            return $resource(host + '/reports/:reportId/definition/elements/:elementId/positions', { reportId: '@reportId', elementId: '@elementId' }, { 'UpdateElementPositions': { method: 'PATCH' } })
                .UpdateElementPositions({ reportId: element.reportId, elementId: element.id }, JSON.stringify(element.positions));
        }

        function updateElementSize(element) {
            return $resource(host + '/reports/:reportId/definition/elements/:elementId/size', { reportId: '@reportId', elementId: '@elementId' }, { 'UpdateElementSize': { method: 'PATCH' } })
                .UpdateElementSize({ reportId: element.reportId, elementId: element.id }, JSON.stringify(element.positionAndSize));
        }
    }
})();