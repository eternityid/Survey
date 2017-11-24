(function () {
    angular.module('svt').service('movePageSvc', MovePageSvc);
    MovePageSvc.$inject = ['surveyEditorSvc'];

    function MovePageSvc(surveyEditorSvc) {
        var service = {
            handleDoneMovePages: handleDoneMovePages
        };
        return service;

        function handleDoneMovePages(data) {
            surveyEditorSvc.setSurveyVersion(data.surveyVersion);
            surveyEditorSvc.setTopFolderVersion(data.topFolderVersion);

            var topFolder = surveyEditorSvc.getSurvey().topFolder;
            topFolder.childNodes.sort(function (node1, node2) {
                var index1 = data.topFolderChildIds.indexOf(node1.id),
                    index2 = data.topFolderChildIds.indexOf(node2.id);
                return index1 - index2;
            });
            surveyEditorSvc.setSurveyEditMode(false);
        }
    }
})();