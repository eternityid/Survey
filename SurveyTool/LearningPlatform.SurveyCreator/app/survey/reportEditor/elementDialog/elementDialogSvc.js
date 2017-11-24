(function() {
    angular.module('svt').service('elementDialogSvc', elementDialogSvc);
    elementDialogSvc.$inject = ['arrayUtilSvc', 'stringUtilSvc', 'settingConst'];

    function elementDialogSvc(arrayUtilSvc, stringUtilSvc, settingConst) {
        var service = {
            getQuestionType: getQuestionType,
            filterChartTypes: filterChartTypes,
            setupNewReportElementForCreating: setupNewReportElementForCreating,
            setupReportElementForEditing: setupReportElementForEditing,
            getReportElementTypeName: getReportElementTypeName,
            populateReportElement: populateReportElement
        };
        return service;

        function getQuestionType(questions, questionId) {
            var item = arrayUtilSvc.getItem(questions, function (question) {
                return question.id === questionId ? question : null;
            });
            return item ? item.type : 0;
        }

        function filterChartTypes(questionType) {
            var chartTypes = [],
                separator = '_',
                reportChartType = settingConst.report.chartType,
                questionTypes = settingConst.questionTypes;

            if (arrayUtilSvc.hasValueIn([questionTypes.SingleSelectionQuestionDefinition.code, questionTypes.MultipleSelectionQuestionDefinition.code], questionType)) {
                chartTypes = [
                    { id: reportChartType.column, name: stringUtilSvc.capitalizeEachWord(reportChartType.column, separator) },
                    { id: reportChartType.bar, name: stringUtilSvc.capitalizeEachWord(reportChartType.bar, separator) },
                    { id: reportChartType.pie, name: stringUtilSvc.capitalizeEachWord(reportChartType.pie, separator) }
                ];
            }
            else if (arrayUtilSvc.hasValueIn([questionTypes.NetPromoterScoreQuestionDefinition.code, questionTypes.ScaleQuestionDefinition.code, questionTypes.RatingQuestionDefinition.code], questionType)) {
                chartTypes = [
                    { id: reportChartType.column, name: stringUtilSvc.capitalizeEachWord(reportChartType.column, separator) },
                    { id: reportChartType.bar, name: stringUtilSvc.capitalizeEachWord(reportChartType.bar, separator) },
                    { id: reportChartType.pie, name: stringUtilSvc.capitalizeEachWord(reportChartType.pie, separator) },
                    { id: reportChartType.stackedColumn, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedColumn, separator) },
                    { id: reportChartType.stackedBar, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedBar, separator) },
                    { id: reportChartType.stackedPercentageColumn, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedPercentageColumn, separator) },
                    { id: reportChartType.stackedPercentageBar, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedPercentageBar, separator) }
                ];
            }
            else if (arrayUtilSvc.hasValueIn([
                questionTypes.SingleSelectionGridQuestionDefinition.code,
                questionTypes.MultipleSelectionGridQuestionDefinition.code,
                questionTypes.ScaleGridQuestionDefinition.code,
                questionTypes.RatingGridQuestionDefinition.code], questionType)) {
                chartTypes = [
                    { id: reportChartType.line, name: stringUtilSvc.capitalizeEachWord(reportChartType.line, separator) },
                    { id: reportChartType.area, name: stringUtilSvc.capitalizeEachWord(reportChartType.area, separator) },
                    { id: reportChartType.stackedArea, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedArea, separator) },
                    { id: reportChartType.stackedColumn, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedColumn, separator) },
                    { id: reportChartType.stackedBar, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedBar, separator) },
                    { id: reportChartType.stackedPercentageColumn, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedPercentageColumn, separator) },
                    { id: reportChartType.stackedPercentageBar, name: stringUtilSvc.capitalizeEachWord(reportChartType.stackedPercentageBar, separator) }
                ];
            }
            return chartTypes;
        }

        function setupNewReportElementForCreating(basedQuestion, currentEditor) {
            var element = {
                $type: currentEditor.element.type,
                reportId: currentEditor.page.data.reportId,
                reportPageDefinitionId: currentEditor.page.data.id,
                position: currentEditor.page.data.position
            };
            switch (element.$type) {
                case settingConst.report.elementType.chart:
                    element.questionAlias = basedQuestion.questionAlias;
                    element.chartType = currentEditor.element.chartType;
                    element.size = {
                        width: settingConst.report.defaultElementSize.width,
                        height: settingConst.report.defaultElementSize.height
                    };
                    break;
                case settingConst.report.elementType.table:
                    element.questionAlias = basedQuestion.questionAlias;
                    element.size = {
                        width: settingConst.report.defaultElementSize.width,
                        height: settingConst.report.defaultElementSize.height
                    };
                    break;
                case settingConst.report.elementType.text:
                    element.text = currentEditor.element.text;
                    element.size = {
                        width: settingConst.report.defaultFreeTextSize.width,
                        height: settingConst.report.defaultFreeTextSize.height
                    };
            }

            return element;
        }

        function setupReportElementForEditing(basedQuestion, currentEditor) {
            var element = {
                $type: currentEditor.element.type,
                id: currentEditor.element.id,
                reportId: currentEditor.element.reportId
            };

            switch (element.$type) {
                case settingConst.report.elementType.chart:
                    element.questionAlias = basedQuestion.questionAlias;
                    element.chartType = currentEditor.element.chartType;
                    break;
                case settingConst.report.elementType.table:
                    element.questionAlias = basedQuestion.questionAlias;
                    break;
                case settingConst.report.elementType.text:
                    element.text = currentEditor.element.text;
            }

            return element;
        }

        function getReportElementTypeName(elementType, elementTypes) {
            var typeName = '';
            switch (elementType) {
                case elementTypes.table:
                    typeName = 'table';
                    break;
                case elementTypes.chart:
                    typeName = 'chart';
                    break;
                case elementTypes.text:
                    typeName = 'text';
            }
            return typeName;
        }

        function populateReportElement(reportElement) {
            return {
                $type: reportElement.$type,
                id: reportElement.id,
                reportPageDefinitionId: reportElement.reportPageDefinitionId,
                reportId: reportElement.reportId,
                chartType: reportElement.chartType,
                chartTypeString: reportElement.chartTypeString,
                displaySummaryTabular: reportElement.displaySummaryTabular,
                questionAlias: reportElement.questionAlias,
                position: reportElement.position,
                size: reportElement.size,
                text: reportElement.text,
                reportEditedLabelDefinitions: reportElement.reportEditedLabelDefinitions
            };
        }
    }
})();