(function() {
    angular.module('svt').service('editableLabelSvc', editableLabelSvc);

    editableLabelSvc.$inject = ['settingConst', 'arrayUtilSvc', 'stringUtilSvc'];

    function editableLabelSvc(settingConst, arrayUtilSvc, stringUtilSvc) {
        var service = {
            getEditableLabels: getEditableLabels
        };

        var labelTypes = settingConst.editableLabelTypes;
        var questionTypes = settingConst.questionTypes;
        var elementTypes = settingConst.report.elementType;
        var chartTypes = settingConst.report.chartType;

        function editableLabelsBuilder(reportElement) {
            var labelDefinitions = reportElement.editableLabels;
            return {
                addQuestionName: addQuestionName,
                addOrder: addOrder,
                addAnswer: addAnswer,
                addTotalRespondents: addTotalRespondents,
                addTotalResponses: addTotalResponses,
                addTotalTopicRespondents: addTotalTopicRespondents,
                addTotalTopicResponses: addTotalTopicResponses,
                addAverage: addAverage,
                addMin: addMin,
                addMax: addMax,
                addOptionHeading: addOptionHeading,
                addTopicHeading: addTopicHeading,
                addResponse: addResponse,
                addPercentage: addPercentage,
                addOptions: addOptions,
                addTopics: addTopics,
                addChartOptions: addChartOptions,
                build: build
            };

            function addQuestionName() {
                if (!labelDefinitions.questionName) {
                    reportElement.editableLabels.questionName = createEditableLabel(reportElement, reportElement.question.name, 0, labelTypes.questionName);
                }
                return this;
            }

            function addOrder() {
                if (!labelDefinitions.order) {
                    reportElement.editableLabels.order = createEditableLabel(reportElement, labelTypes.order.originalContent, 0, labelTypes.order);
                }
                return this;
            }

            function addAnswer() {
                if (!labelDefinitions.answer) {
                    reportElement.editableLabels.answer = createEditableLabel(reportElement, labelTypes.answer.originalContent, 0, labelTypes.answer);
                }
                return this;
            }

            function addTotalRespondents() {
                if (!labelDefinitions.totalRespondents) {
                    reportElement.editableLabels.totalRespondents = createEditableLabel(reportElement, labelTypes.totalRespondents.originalContent, 0, labelTypes.totalRespondents);
                }
                return this;
            }

            function addTotalResponses() {
                if (!labelDefinitions.totalResponses) {
                    reportElement.editableLabels.totalResponses = createEditableLabel(reportElement, labelTypes.totalResponses.originalContent, 0, labelTypes.totalResponses);
                }
                return this;
            }

            function addTotalTopicRespondents() {
                if (!labelDefinitions.totalTopicRespondents) reportElement.editableLabels.totalTopicRespondents = {};

                for (var i = 0; i < reportElement.question.topics.length; i++) {
                    if (reportElement.editableLabels.totalTopicRespondents[i]) continue;
                    reportElement.editableLabels.totalTopicRespondents[i] = createEditableLabel(reportElement, labelTypes.totalTopicRespondents.originalContent, i, labelTypes.totalTopicRespondents);
                }
                return this;
            }

            function addTotalTopicResponses() {
                if (!labelDefinitions.totalTopicResponses) reportElement.editableLabels.totalTopicResponses = {};

                for (var i = 0; i < reportElement.question.topics.length; i++) {
                    if (reportElement.editableLabels.totalTopicResponses[i]) continue;
                    reportElement.editableLabels.totalTopicResponses[i] = createEditableLabel(reportElement, labelTypes.totalTopicResponses.originalContent, i, labelTypes.totalTopicResponses);
                }
                return this;
            }

            function addAverage() {
                if (!labelDefinitions.average) {
                    reportElement.editableLabels.average = createEditableLabel(reportElement, labelTypes.average.originalContent, 0, labelTypes.average);
                }
                return this;
            }

            function addMin() {
                if (!labelDefinitions.min) {
                    reportElement.editableLabels.min = createEditableLabel(reportElement, labelTypes.min.originalContent, 0, labelTypes.min);
                }
                return this;
            }

            function addMax() {
                if (!labelDefinitions.max) {
                    reportElement.editableLabels.max = createEditableLabel(reportElement, labelTypes.max.originalContent, 0, labelTypes.max);
                }
                return this;
            }

            function addOptionHeading() {
                if (!labelDefinitions.optionHeading) {
                    reportElement.editableLabels.optionHeading = createEditableLabel(reportElement, labelTypes.optionHeading.originalContent, 0, labelTypes.optionHeading);
                }
                return this;
            }

            function addTopicHeading() {
                if (!labelDefinitions.topicHeading) {
                    reportElement.editableLabels.topicHeading = createEditableLabel(reportElement, labelTypes.topicHeading.originalContent, 0, labelTypes.topicHeading);
                }
                return this;
            }

            function addResponse() {
                if (!labelDefinitions.response) {
                    reportElement.editableLabels.response = createEditableLabel(reportElement, labelTypes.response.originalContent, 0, labelTypes.response);
                }
                return this;
            }

            function addPercentage() {
                if (!labelDefinitions.percentage) {
                    reportElement.editableLabels.percentage = createEditableLabel(reportElement, labelTypes.percentage.originalContent, 0, labelTypes.percentage);
                }
                return this;
            }

            function addOptions() {
                if (!labelDefinitions.options) reportElement.editableLabels.options = {};

                for (var i = 0; i < reportElement.question.options.length; i++) {
                    if (reportElement.editableLabels.options[i]) continue;
                    var currentOption = reportElement.question.options[i];
                    reportElement.editableLabels.options[i] = createEditableLabel(reportElement, currentOption.text.items[0].text, i, labelTypes.option);
                }
                return this;
            }

            function addTopics() {
                if (!labelDefinitions.topics) reportElement.editableLabels.topics = {};

                for (var i = 0; i < reportElement.question.topics.length; i++) {
                    if (reportElement.editableLabels.topics[i]) continue;
                    var currentTopic = reportElement.question.topics[i];
                    reportElement.editableLabels.topics[i] = createEditableLabel(reportElement, currentTopic.text.items[0].text, i, labelTypes.topic);
                }

                return this;
            }

            function addChartOptions() {
                if (!labelDefinitions.options) reportElement.editableLabels.options = {};

                if (reportElement.question.type === questionTypes.NetPromoterScoreQuestionDefinition.code) {

                    var netPromotorScoreQuestionLabels = settingConst.report.netPromotorScoreQuestionLabels;
                    var defaultLabels = [netPromotorScoreQuestionLabels.promoters, netPromotorScoreQuestionLabels.passives, netPromotorScoreQuestionLabels.detractors];
                    for (var i = 0; i < defaultLabels.length; i++) {
                        if (reportElement.editableLabels.options[i]) continue;
                        reportElement.editableLabels.options[i] = createEditableLabel(reportElement, defaultLabels[i], i, labelTypes.option);
                    }
                    return this;
                }

                for (var j = 0; j < reportElement.question.options.length; j++) {
                    if (reportElement.editableLabels.options[j]) continue;
                    var currentOption = reportElement.question.options[j];
                    reportElement.editableLabels.options[j] = createEditableLabel(reportElement, currentOption.text.items[0].text, j, labelTypes.option);
                }
                return this;
            }

            function build() {
                return reportElement;
            }
        }

        return service;

        function getEditableLabels(reportElement) {
            if (!reportElement.question) return reportElement;
            switch (reportElement.question.type) {
                case questionTypes.OpenEndedShortTextQuestionDefinition.code:
                case questionTypes.OpenEndedLongTextQuestionDefinition.code:
                    return getLabelsForTextQuestion(reportElement);
                case questionTypes.SingleSelectionQuestionDefinition.code:
                case questionTypes.MultipleSelectionQuestionDefinition.code:
                case questionTypes.NetPromoterScoreQuestionDefinition.code:
                case questionTypes.ScaleQuestionDefinition.code:
                case questionTypes.RatingQuestionDefinition.code:
                case questionTypes.SingleSelectionPictureQuestionDefinition.code:
                case questionTypes.MultipleSelectionPictureQuestionDefinition.code:
                    return getLabelsForQuestionHasOptions(reportElement);
                case questionTypes.NumericQuestionDefinition.code:
                    return getLabelsForNumericQuestion(reportElement);
                case questionTypes.SingleSelectionGridQuestionDefinition.code:
                case questionTypes.MultipleSelectionGridQuestionDefinition.code:
                case questionTypes.ScaleGridQuestionDefinition.code:
                case questionTypes.RatingGridQuestionDefinition.code:
                    return getLabelsForGridQuestion(reportElement);
                default:
                    return reportElement;
            }
        }

        function getLabelsForTextQuestion(reportElement) {
            var builder = new editableLabelsBuilder(reportElement);
            return builder.addQuestionName().addOrder().addAnswer().addTotalRespondents().addTotalResponses().build();
        }

        function getLabelsForQuestionHasOptions(reportElement) {
            var builder = new editableLabelsBuilder(reportElement);
            if (reportElement.$type === elementTypes.table) {
                return builder.addQuestionName().addOptions().addOptionHeading().addResponse().addPercentage().addTotalRespondents().addTotalResponses().build();
            }
            if (arrayUtilSvc.hasValueIn([questionTypes.ScaleQuestionDefinition.code, questionTypes.RatingQuestionDefinition.code, questionTypes.NetPromoterScoreQuestionDefinition.code], reportElement.question.type)) {
                if (arrayUtilSvc.hasValueIn([chartTypes.column, chartTypes.bar, chartTypes.pie], reportElement.chartTypeString)) {
                    return builder.addQuestionName().addChartOptions().build();
                }
                return builder.addQuestionName().addChartOptions().addTopics().build();
            }
            return builder.addQuestionName().addChartOptions().build();
        }

        function getLabelsForNumericQuestion(reportElement) {
            var builder = new editableLabelsBuilder(reportElement);
            return builder.addQuestionName().addAverage().addMin().addMax().build();
        }

        function getLabelsForGridQuestion(reportElement) {
            var builder = new editableLabelsBuilder(reportElement);
            if (reportElement.$type === elementTypes.table) {
                return builder.addQuestionName().addTopicHeading().addResponse().addPercentage().addTotalRespondents().addTotalResponses().addTotalTopicRespondents().addTotalTopicResponses().addTopics().addOptions().build();
            }
            return builder.addQuestionName().addTopics().addOptions().build();
        }

        function createEditableLabel(reportElement, content, position, labelType) {
            content = stringUtilSvc.getPlainText(content);
            return {
                reportId: reportElement.reportId,
                reportElementHasQuestionId: reportElement.id,
                originalContent: content,
                latestContent: content,
                position: position,
                reportEditedLabelType: labelType.id
            };
        }
    }
})();