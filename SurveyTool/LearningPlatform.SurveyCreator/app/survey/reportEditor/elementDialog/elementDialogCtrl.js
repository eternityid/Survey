(function() {
    angular.module('svt').controller('elementDialogCtrl', elementDialogCtrl);
    elementDialogCtrl.$inject = [
        '$scope', 'reportPageSvc', 'elementDialogSvc', 'arrayUtilSvc', 'reportEditorSvc',
        'errorHandlingSvc', 'spinnerUtilSvc', '$modalInstance', 'editor', 'settingConst',
        'reportElementDataSvc'
    ];

    function elementDialogCtrl(
        $scope, reportPageSvc, elementDialogSvc, arrayUtilSvc, reportEditorSvc,
        errorHandlingSvc, spinnerUtilSvc, $modalInstance, editor, settingConst,
        reportElementDataSvc) {
        var vm = this;
        $scope.editor = editor;
        $scope.validationMessageForFreeText = '';

        $scope.chartTypes = [];
        $scope.elementType = settingConst.report.elementType;

        $scope.ckeditorConfig = {
            extraPlugins: 'sourcedialog,svtinsertfromfilelibrary',
            toolbarType: 'short',
            svtData: {}
        };

        $scope.cancel = cancel;
        $scope.save = save;

        $scope.changeQuestion = changeQuestion;
        vm.init = init;

        init();
        function init() {
            $scope.questions = reportEditorSvc.getReportData().questions;
            $scope.requiredValidation = reportPageSvc.getRequiredValidation();

            if ($scope.editor.isAdd) {
                if (!$scope.editor.element) $scope.editor.element = {};
                $scope.editor.element.type = $scope.editor.elementType;
                $scope.editor.element.questionId = '';
                $scope.editor.element.chartType = '';
                $scope.editor.element.text = '';
            }

            if ($scope.editor.elementType === $scope.elementType.chart) {
                filterChartTypes();
            }

            $scope.editor.element.typeName = elementDialogSvc.getReportElementTypeName(
                $scope.editor.elementType, $scope.elementType);
        }

        function cancel() {
            resetData();
            $modalInstance.dismiss('cancel');
        }

        function resetData() {
            reportPageSvc.setActivePageIndex(-1);
            reportPageSvc.setEditingElementId(0);
        }

        function changeQuestion() {
            filterChartTypes();
        }

        function filterChartTypes() {
            var questionType = elementDialogSvc.getQuestionType($scope.questions, $scope.editor.element.questionId);
            $scope.chartTypes = elementDialogSvc.filterChartTypes(questionType);
            $scope.editor.element.chartType = validateElementOldChartType() ? $scope.editor.element.chartType : '';

            function validateElementOldChartType() {
                for (var i = 0; i < $scope.chartTypes.length; i++) {
                    if ($scope.chartTypes[i].id === $scope.editor.element.chartType) return true;
                }
                return false;
            }
        }

        function save() {
            if (!validate()) return;

            var question = getQuestionById($scope.editor.element.questionId);

            if ($scope.editor.isAdd) {
                addNewElement(
                    elementDialogSvc.setupNewReportElementForCreating(question, $scope.editor));
            } else {
                updateElement(
                    elementDialogSvc.setupReportElementForEditing(question, $scope.editor));
            }
            return;

            function validate() {
                $scope.requiredValidation.chart.valid = true;

                switch ($scope.editor.element.type) {
                    case $scope.elementType.table:
                        return validateElementQuestion();
                    case $scope.elementType.chart:
                        return validateElementQuestion() && validatElementChartType();
                    case $scope.elementType.text:
                        return validateElementText();
                }

                return true;

                function validateElementQuestion() {
                    if (!$scope.editor.element.questionId) {
                        $scope.requiredValidation.question.valid = false;
                        return false;
                    }

                    return true;
                }

                function validatElementChartType() {
                    if (!$scope.editor.element.chartType) {
                        $scope.requiredValidation.chart.valid = false;
                        return false;
                    }

                    return true;
                }

                function validateElementText() {
                    if ($scope.editor.element.text.length <= 0) {
                        $scope.validationMessageForFreeText = 'Can not save empty field. Please write some content.';
                        return false;
                    }
                    return true;
                }
            }

            function getQuestionById(questionId) {
                return arrayUtilSvc.getItem($scope.questions, function (item) {
                    return item.id === questionId ? item : null;
                });
            }

            function addNewElement(element) {
                spinnerUtilSvc.showSpinner();

                reportElementDataSvc.addReportElement(element).$promise.then(function (reportElement) {
                    spinnerUtilSvc.hideSpinner();
                    $modalInstance.close({
                        status: true,
                        isAdd: true,
                        element: elementDialogSvc.populateReportElement(reportElement)
                    });
                    resetData();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError('Creating element was not successful.', error);
                });
            }

            function updateElement(element) {
                var updateMessages = {
                    fail: 'Updating element was not successful.'
                };

                spinnerUtilSvc.showSpinner();
                reportElementDataSvc.updateReportElement(element).$promise.then(function (reportElement) {
                    spinnerUtilSvc.hideSpinner();

                    $modalInstance.close({
                        status: true,
                        isAdd: false,
                        element: elementDialogSvc.populateReportElement(reportElement)
                    });
                    resetData();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError(updateMessages.fail, error);
                });
            }
        }
    }
})();