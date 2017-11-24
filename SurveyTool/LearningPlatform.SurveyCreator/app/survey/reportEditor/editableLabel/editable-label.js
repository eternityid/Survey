(function () {
    angular.module('svt').directive('editableLabel', editableLabel);

    editableLabel.$inject = ['angularScopeUtilSvc'];

    function editableLabel(angularScopeUtilSvc) {
        var directive = {
            restrict: 'E',
            scope: {
                label: '='
            },
            templateUrl: 'survey/reportEditor/editableLabel/editable-label.html',
            controller: 'editableLabelCtrl',
            controllerAs: 'vm',
            link: function (scope, element) {
                onElementClicked();

                function onElementClicked() {
                    element.on('click', { originalData: scope.originalData, latestData: scope.latestData }, function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        angularScopeUtilSvc.safeApply(scope, 'vm.openDialog()');
                        return;
                    });
                }
            }
        };

        return directive;
    }
})();