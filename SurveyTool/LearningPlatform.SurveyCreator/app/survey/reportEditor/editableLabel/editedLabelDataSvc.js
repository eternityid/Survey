(function() {
    angular.module('svt').service('editedLabelDataSvc', editedLabelDataSvc);
    editedLabelDataSvc.$inject = ['$resource', 'host'];

    function editedLabelDataSvc($resource, host) {
        var service = {
            addEditedLabel: addEditedLabel,
            updateEditedLabel: updateEditedLabel
        };
        return service;

        function addEditedLabel(label) {
            return $resource(host + '/reports/:reportId/elements/:reportElementId/definition/editedlabels', { reportId: '@reportId', reportElementId: '@reportElementId' }, { 'AddLabel': { method: 'POST' } })
                .AddLabel({ reportId: label.reportId, reportElementId: label.reportElementHasQuestionId }, JSON.stringify(label));
        }

        function updateEditedLabel(label) {
            return $resource(host + '/reports/:reportId/elements/:reportElementId/definition/editedlabels/:labelId', { reportId: '@reportId', reportElementId: '@reportElementId', labelId: '@labelId' }, { 'UpdateLabel': { method: 'PATCH' } })
                .UpdateLabel({ reportId: label.reportId, reportElementId: label.reportElementHasQuestionId, labelId: label.id }, JSON.stringify(label));
        }

    }
})();