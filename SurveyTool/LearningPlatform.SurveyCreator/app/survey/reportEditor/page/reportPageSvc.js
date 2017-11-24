(function () {
    'use strict';

    angular
        .module('svt')
        .service('reportPageSvc', reportPageSvc);

    reportPageSvc.$inject = [
        'reportPageDataSvc', '$compile', '$q', 'arrayUtilSvc', 'settingConst', 'reportSvc',
        'rpSelectionQuestionSvc', 'reportEditorSvc', 'objectUtilSvc', 'editableLabelSvc', '$modal'
    ];

    function reportPageSvc(reportPageDataSvc, $compile, $q, arrayUtilSvc, settingConst, reportSvc,
        rpSelectionQuestionSvc, reportEditorSvc, objectUtilSvc, editableLabelSvc, $modal) {
        var currentPages = { data: [] },
            activePage = { index: 0 },
            editingElement = {
                id: 0
            },
            workingElementIds = {
                selected: 0,
                deselected: 0
            },
            collapsedPageIds = [],
            questionTypes = settingConst.questionTypes;

        var service = {
            getCurrentPages: getCurrentPages,
            setCurrentPages: setCurrentPages,
            getActivePage: getActivePage,
            setActivePageIndex: setActivePageIndex,
            getEditingElement: getEditingElement,
            setEditingElementId: setEditingElementId,
            getWorkingElementIds: getWorkingElementIds,
            setSelectedElementId: setSelectedElementId,
            setDeselectedElementId: setDeselectedElementId,
            loadDataForReportElementsInPage: loadDataForReportElementsInPage,
            addReportElementIntoPage: addReportElementIntoPage,
            updateReportElementInPage: updateReportElementInPage,
            getQuestionsByReportId: getQuestionsByReportId,
            getAvailableQuestionsForChartElement: getAvailableQuestionsForChartElement,
            getAvailableQuestionsForTableElement: getAvailableQuestionsForTableElement,
            getCollapsedPageIds: getCollapsedPageIds,
            buildDirective: buildDirective,

            addPage: addPage,
            addPageToCurrentPages: addPageToCurrentPages,
            deletePageFromCurrentPages: deletePageFromCurrentPages,
            updatePositionsForCurrentPages: updatePositionsForCurrentPages,
            loadTableByQuestion: loadTableByQuestion,
            loadChartByQuestion: loadChartByQuestion,
            getRequiredValidation: getRequiredValidation
        };

        return service;

        function getCurrentPages() {
            return currentPages;
        }

        function setCurrentPages(pages) {
            currentPages = pages;
        }

        function getActivePage() {
            return activePage;
        }

        function setActivePageIndex(index) {
            activePage.index = index;
        }

        function getEditingElement() {
            return editingElement;
        }

        function setEditingElementId(id) {
            editingElement.id = id;
        }

        function getWorkingElementIds() {
            return workingElementIds;
        }

        function setSelectedElementId(id) {
            workingElementIds.selected = id;
        }

        function setDeselectedElementId(id) {
            workingElementIds.deselected = id;
        }

        function loadDataForReportElementsInPage(reportPage) {
            var reportElementsInPage = reportPage.reportElementDefinitions;
            if (!reportElementsInPage || reportElementsInPage.length < 1) return;

            reportElementsInPage.forEach(function (element) {
                switch (element.$type) {
                    case settingConst.report.elementType.table:
                        loadTableByQuestion(element);
                        break;
                    case settingConst.report.elementType.chart:
                        loadChartByQuestion(element);
                }
            });
        }

        function addReportElementIntoPage(reportElement, reportPage) {
            if (!reportPage.data) return;

            if (!reportPage.data.reportElementDefinitions) {
                reportPage.data.reportElementDefinitions = [];
            }
            reportPage.data.reportElementDefinitions.push(reportElement);
        }

        function updateReportElementInPage(reportElement, reportPage) {
            if (!reportPage.data || !reportPage.data.reportElementDefinitions) return;
            for (var i = 0; i < reportPage.data.reportElementDefinitions.length; i++) {
                if (reportPage.data.reportElementDefinitions[i].id === reportElement.id) {
                    reportPage.data.reportElementDefinitions[i] = reportElement;
                    break;
                }
            }
        }

        function getQuestionsByReportId(reportId) {
            var defer = $q.defer();
            var questions = [];

            reportPageDataSvc.getQuestionsByReportId(reportId).$promise.then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    questions.push(data[i]);
                }
                defer.resolve(questions);
            }, function (error) {
                defer.reject(error);
            });
            return defer.promise;
        }

        function getAvailableQuestionsForChartElement(allQuestions) {
            if (!allQuestions) return [];
            var chartQuestions = [];
            allQuestions.forEach(function (question) {
                switch (question.type) {
                    case questionTypes.OpenEndedShortTextQuestionDefinition.code:
                    case questionTypes.OpenEndedLongTextQuestionDefinition.code:
                    case questionTypes.NumericQuestionDefinition.code:
                    case questionTypes.ShortTextListQuestionDefinition.code:
                    case questionTypes.InformationDefinition.code:
                    case questionTypes.DateQuestionDefinition.code:
                        break;
                    default:
                        chartQuestions.push({ id: question.id, name: question.name });
                }
            });
            return chartQuestions;
        }

        function getAvailableQuestionsForTableElement(allQuestions) {
            if (!allQuestions) return [];
            var tableQuestions = [];
            allQuestions.forEach(function (question) {
                switch (question.type) {
                    case questionTypes.ShortTextListQuestionDefinition.code:
                    case questionTypes.DateQuestionDefinition.code:
                        break;
                    default:
                        tableQuestions.push({ id: question.id, name: question.name });
                }
            });
            return tableQuestions;
        }

        function getCollapsedPageIds() {
            return collapsedPageIds;
        }

        function buildDirective(parentContainId, childContainId, data, $scope, templateDirective) {
            var scope = $scope.$new();
            scope.data = data;
            var htmlElement = $compile(templateDirective)(scope);

            if (angular.element(childContainId).length <= 0) {
                angular.element(parentContainId).append('<div id="' + childContainId.replace('#', '') + '"></div>');
            }

            htmlElement.attr('id', childContainId.replace('#', ''));
            angular.element(childContainId).replaceWith(htmlElement);

            $(window).resize();
        }

        function addPage(currentPagePosition, reportId) {
            var page = {
                id: null,
                position: currentPagePosition + 1,
                reportId: reportId
            };
            return reportPageDataSvc.addPage(page);
        }

        function addPageToCurrentPages(currentPagePosition, reportId, pageId) {
            var page = {
                id: pageId,
                position: currentPagePosition + 1,
                reportId: reportId
            };
            var current = currentPages.data.filter(function (currentPage) {
                return currentPage.position === currentPagePosition;
            });
            var currentIndex = Object.keys(currentPages.data).filter(function (key) {
                return currentPages.data[key] === current[0];
            });
            var index = parseInt(currentIndex[0]) + 1;
            for (var i = currentPages.data.length - 1; i >= index; i--) {
                currentPages.data[i].position += 1;
            }
            currentPages.data.splice(index, 0, page);
        }

        function deletePageFromCurrentPages(pageId) {
            for (var i = 0; i <= currentPages.data.length; i++) {
                if (currentPages.data[i].id === pageId) {
                    currentPages.data.splice(i, 1);
                    return;
                }
            }
        }

        function updatePositionsForCurrentPages(pageId, oldPosition, newPosition) {
            if (oldPosition > newPosition) {
                for (var i = oldPosition; i >= newPosition; i--) {
                    currentPages.data[i].position = (currentPages.data[i].id === pageId) ? newPosition + 1 : currentPages.data[i].position + 1;
                }
            } else {
                for (var j = newPosition; j >= oldPosition; j--) {
                    currentPages.data[j].position = (currentPages.data[j].id === pageId) ? newPosition + 1 : currentPages.data[j].position - 1;
                }
            }
        }

        function loadTableByQuestion(reportQuestion) {
            var reportData = reportEditorSvc.getReportData(),
                chartsData = reportData.dataRespondents,
                openTextRespondents = reportData.openTextRespondents,
                questions = reportData.questions;
            var aggregatedQuestion = null;
            if (chartsData) {
                aggregatedQuestion = arrayUtilSvc.getItem(chartsData.questions, function (item) {
                    return item.questionName === reportQuestion.questionAlias ? getAggregatedQuestion(item) : undefined;
                });
            }

            if (!aggregatedQuestion) {
                aggregatedQuestion = {
                    questionSetting: {},
                    answers: {},
                    topics: {}
                };
            }
            reportQuestion.data = aggregatedQuestion;
            reportQuestion.question = getQuestionByAlias(reportQuestion.questionAlias, questions);
            if (!reportQuestion.question) return;
            getEditableLabels(reportQuestion);
            return;

            function getAggregatedQuestion(question) {
                if (!arrayUtilSvc.hasValueIn([questionTypes.OpenEndedShortTextQuestionDefinition.code, questionTypes.OpenEndedLongTextQuestionDefinition.code], question.questionType)) {
                    return question;
                }
                return arrayUtilSvc.getItem(openTextRespondents, function (openTextQuestion) {
                    return (openTextQuestion.questionAlias === question.questionName) ? {
                        answers: openTextQuestion.answers,
                        questionType: question.questionType,
                        questionText: question.questionText,
                        numberOfRespondents: question.numberOfRespondents,
                        numberOfResponses: question.numberOfResponses
                    } : undefined;
                });
            }
        }

        function loadChartByQuestion(reportQuestion) {
            var chart,
                dataChart,
                chartType = reportQuestion.chartTypeString,
                reportData = reportEditorSvc.getReportData(),
                chartsData = reportData.dataRespondents,
                questions = reportData.questions;

            var question = getQuestionByAlias(reportQuestion.questionAlias, questions);
            if (!question) return;
            reportQuestion.question = question;
            var aggregatedQuestion = null;
            if (chartsData) {
                aggregatedQuestion = arrayUtilSvc.getItem(chartsData.questions, function (item) {
                    return item.questionName === reportQuestion.questionAlias ? item : undefined;
                });
            }

            if (!aggregatedQuestion) aggregatedQuestion = { questionSetting: {}, answers: {} };

            if (arrayUtilSvc.hasValueIn([settingConst.report.chartType.column, settingConst.report.chartType.bar, settingConst.report.chartType.pie], chartType)) {
                aggregatedQuestion.questionSetting.chartType = chartType;

                chart = getChartBySelection();
            }
            else if (arrayUtilSvc.hasValueIn([settingConst.report.chartType.stackedColumn, settingConst.report.chartType.stackedBar, settingConst.report.chartType.stackedPercentageColumn, settingConst.report.chartType.stackedPercentageBar], chartType)) {
                if (arrayUtilSvc.hasValueIn([
                    questionTypes.SingleSelectionGridQuestionDefinition.code,
                    questionTypes.MultipleSelectionGridQuestionDefinition.code,
                    questionTypes.ScaleGridQuestionDefinition.code,
                    questionTypes.RatingGridQuestionDefinition.code], question.type)) {
                    dataChart = reportSvc.getSeriesForGrid(aggregatedQuestion.topics);
                    chart = getChartByGridSelection();
                } else {
                    var isNetPromoterQuestion = aggregatedQuestion.questionType === settingConst.questionTypes.NetPromoterScoreQuestionDefinition.code;
                    switch (chartType) {
                        case settingConst.report.chartType.stackedColumn:
                        case settingConst.report.chartType.stackedBar:
                        case settingConst.report.chartType.stackedPercentageColumn:
                        case settingConst.report.chartType.stackedPercentageBar:
                            dataChart = isNetPromoterQuestion ?
                                reportSvc.getSeriesForNetPromoter(aggregatedQuestion, true) :
                                reportSvc.getSeries(aggregatedQuestion);
                            break;
                    }
                    chart = getChartByScale();
                    if (isNetPromoterQuestion) {
                        chart.subtitle = {
                            text: 'Net Promoter Score \u00AE: ' + dataChart.nps + '%'
                        };
                    }
                }
            }
            else if (arrayUtilSvc.hasValueIn([settingConst.report.chartType.line, settingConst.report.chartType.area, settingConst.report.chartType.stackedArea], chartType)) {
                dataChart = reportSvc.getSeriesForGrid(aggregatedQuestion.topics);
                chart = getChartByGridSelection();
            }

            reportQuestion.isEmptyPieChart = reportSvc.checkEmptyPieChart(chartType, aggregatedQuestion.numberOfResponses);
            reportQuestion.data = chart;
            reportQuestion.data.answers = aggregatedQuestion;
            if (reportQuestion.question.type === questionTypes.NetPromoterScoreQuestionDefinition.code) {
                reportQuestion.data.nps = reportSvc.getNetPromoterData(aggregatedQuestion).nps;
            }

            getEditableLabels(reportQuestion);
            handleOverrideChartText();
            if (reportQuestion.data !== null && reportQuestion.data !== undefined) buildEventsToEditReportLables(reportQuestion);
            return;

            function handleOverrideChartText() {
                if (!reportQuestion.editableLabels || !arrayUtilSvc.isArrayHasElement(reportQuestion.data.series) || !arrayUtilSvc.isArrayHasElement(reportQuestion.data.series[0].data)) return;

                reportQuestion.data.title.text = reportQuestion.editableLabels.questionName.latestContent;
                var numOrOptionLabels = Object.keys(reportQuestion.editableLabels.options).length;
                var i;

                if (reportQuestion.chartTypeString === settingConst.report.chartType.column ||
                    reportQuestion.chartTypeString === settingConst.report.chartType.pie ||
                    reportQuestion.chartTypeString === settingConst.report.chartType.bar) {
                    for (i = 0; i < numOrOptionLabels; i++) {
                        reportQuestion.data.series[0].data[i].name = reportQuestion.data.xAxis.categories[i] = reportQuestion.editableLabels.options[i].latestContent;
                    }
                } else {
                    for (i = 0; i < numOrOptionLabels; i++) {
                        reportQuestion.data.series[i].name = reportQuestion.editableLabels.options[i].latestContent;
                    }

                    if (!reportQuestion.editableLabels.topics) return;
                    for (i = 0; i < Object.keys(reportQuestion.editableLabels.topics).length; i++) {
                        reportQuestion.data.xAxis.categories[i] = reportQuestion.editableLabels.topics[i].latestContent;
                    }
                }
            }

            function getChartBySelection() {
                return rpSelectionQuestionSvc.renderChart(aggregatedQuestion);
            }

            function getChartByScale() {
                var scaleChart,
                    stackCategoryName = ['Answers'];
                switch (chartType) {
                    case settingConst.report.chartType.stackedColumn:
                        scaleChart = reportSvc.getStackedColumnChartType(settingConst.report.chartType.column, question.name, stackCategoryName, dataChart.series);
                        break;
                    case settingConst.report.chartType.stackedPercentageColumn:
                        scaleChart = reportSvc.getStackedPercentageColumnChartType(settingConst.report.chartType.column, question.name, stackCategoryName, dataChart.series);
                        break;
                    case settingConst.report.chartType.stackedBar:
                        scaleChart = reportSvc.getStackedBarChartType(settingConst.report.chartType.bar, question.name, stackCategoryName, dataChart.series);
                        break;
                    case settingConst.report.chartType.stackedPercentageBar:
                        scaleChart = reportSvc.getStackedPercentageBarChartType(settingConst.report.chartType.bar, question.name, stackCategoryName, dataChart.series);
                        break;
                }
                return scaleChart;
            }

            function getChartByGridSelection() {
                var gridSelectionChart;
                switch (chartType) {
                    case settingConst.report.chartType.line:
                        gridSelectionChart = reportSvc.getLineChartType(settingConst.report.chartType.line, question.name, dataChart.categories, dataChart.series);
                        break;
                    case settingConst.report.chartType.area:
                        gridSelectionChart = reportSvc.getAreaChartType(settingConst.report.chartType.area, question.name, dataChart.categories, dataChart.series);
                        break;
                    case settingConst.report.chartType.stackedArea:
                        gridSelectionChart = reportSvc.getStackedAreaChartType(settingConst.report.chartType.area, question.name, dataChart.categories, dataChart.series);
                        break;

                    case settingConst.report.chartType.stackedColumn:
                        gridSelectionChart = reportSvc.getStackedColumnChartType(settingConst.report.chartType.column, question.name, dataChart.categories, dataChart.series);
                        break;
                    case settingConst.report.chartType.stackedPercentageColumn:
                        gridSelectionChart = reportSvc.getStackedPercentageColumnChartType(settingConst.report.chartType.column, question.name, dataChart.categories, dataChart.series);
                        break;
                    case settingConst.report.chartType.stackedBar:
                        gridSelectionChart = reportSvc.getStackedBarChartType(settingConst.report.chartType.bar, question.name, dataChart.categories, dataChart.series);
                        break;
                    case settingConst.report.chartType.stackedPercentageBar:
                        gridSelectionChart = reportSvc.getStackedPercentageBarChartType(settingConst.report.chartType.bar, question.name, dataChart.categories, dataChart.series);
                        break;
                }
                return gridSelectionChart;
            }
        }

        function buildEventsToEditReportLables(reportQuestion) {
            var chartType = reportQuestion.chartTypeString,
                editableLabels = reportQuestion.editableLabels;

            buildEventToQuestionTitle();
            switch (chartType) {
                case settingConst.report.chartType.column:
                    buildEventsToColumnChart();
                    break;
                case settingConst.report.chartType.bar:
                    buildEventsToBarChart();
                    break;
                case settingConst.report.chartType.pie:
                    buildEventsToPieChart();
                    break;
                case settingConst.report.chartType.line:
                    buildEventsToLineChart();
                    break;
                case settingConst.report.chartType.area:
                case settingConst.report.chartType.stackedArea:
                    buildEventsToAreaChart();
                    break;
                case settingConst.report.chartType.stackedColumn:
                case settingConst.report.chartType.stackedPercentageColumn:
                    buildEventsToStackedColumnChart();
                    break;
                case settingConst.report.chartType.stackedBar:
                case settingConst.report.chartType.stackedPercentageBar:
                    buildEventsToStackedBarChart();
                    break;
            }
            return;

            function buildEventToQuestionTitle() {
                var title = reportQuestion.data.title;
                if (typeof title !== 'object' || title === null) return;
                title.events = objectUtilSvc.createObjectFrom(title.events);
                title.events.click = function () {
                    openLabelEditorDialog(editableLabels.questionName, function () {
                        if (title.text !== editableLabels.questionName.latestContent) title.text = editableLabels.questionName.latestContent;
                    });
                };
            }

            function buildEventsToColumnChart() {
                var xAxis = reportQuestion.data.xAxis,
                    categories = reportQuestion.data.xAxis.categories,
                    series = reportQuestion.data.series;

                xAxis.labels = objectUtilSvc.createObjectFrom(xAxis.labels);
                xAxis.labels.events = objectUtilSvc.createObjectFrom(xAxis.labels.events);
                xAxis.labels.events.click = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!arrayUtilSvc.hasValueIn(['tspan', 'text'], event.target.nodeName)) return;

                    var optionIndex = this.pos;
                    var optionLabel = editableLabels.options[optionIndex];
                    openLabelEditorDialog(optionLabel, function () {
                        if (series[0].data[optionIndex].name !== optionLabel.latestContent) series[0].data[optionIndex].name = optionLabel.latestContent;
                        if (categories[optionIndex] !== optionLabel.latestContent) categories[optionIndex] = optionLabel.latestContent;
                    });
                };
            }

            function buildEventsToBarChart() {
                var xAxis = reportQuestion.data.xAxis,
                    categories = reportQuestion.data.xAxis.categories,
                    series = reportQuestion.data.series;

                xAxis.labels = objectUtilSvc.createObjectFrom(xAxis.labels);
                xAxis.labels.events = objectUtilSvc.createObjectFrom(xAxis.labels.events);
                xAxis.labels.events.click = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!arrayUtilSvc.hasValueIn(['tspan', 'text'], event.target.nodeName)) return;

                    var position = this.pos;
                    var optionLabel = editableLabels.options[position];
                    openLabelEditorDialog(optionLabel, function () {
                        if (series[0].data[position].name !== optionLabel.latestContent) series[0].data[position].name = optionLabel.latestContent;
                        if (categories[position] !== optionLabel.latestContent) categories[position] = optionLabel.latestContent;
                    });
                };
            }

            function buildEventsToPieChart() {
                var plotOptions = reportQuestion.data.options.plotOptions,
                    categories = reportQuestion.data.xAxis.categories,
                    series = reportQuestion.data.series;
                var pie = plotOptions ? plotOptions.pie : undefined;
                if (!pie) return;

                pie.point = objectUtilSvc.createObjectFrom(pie.point);
                pie.point.events = objectUtilSvc.createObjectFrom(pie.point.events);
                pie.point.events.click = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.target.nodeName !== 'tspan') return;

                    var optionIndex = this.index;
                    var optionLabel = editableLabels.options[optionIndex];
                    openLabelEditorDialog(optionLabel, function () {
                        if (series[0].data[optionIndex].name !== optionLabel.latestContent) series[0].data[optionIndex].name = optionLabel.latestContent;
                        if (categories[optionIndex] !== optionLabel.latestContent) categories[optionIndex] = optionLabel.latestContent;
                    });
                };
            }

            function buildEventsToLineChart() {
                var series = reportQuestion.data.series,
                    plotOptions = getPlotOptions();

                plotOptions.line = objectUtilSvc.createObjectFrom(plotOptions.line);
                plotOptions.line.events = objectUtilSvc.createObjectFrom(plotOptions.line.events);
                plotOptions.line.events.legendItemClick = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var optionIndex = event.target.index;
                    var optionLabel = editableLabels.options[optionIndex];

                    openLabelEditorDialog(optionLabel, function () {
                        if (series[optionIndex].name !== optionLabel.latestContent) series[optionIndex].name = optionLabel.latestContent;
                    });
                };

                buildEventsForTopicPartInChart();
            }

            function getPlotOptions() {
                var options = reportQuestion.data.options;
                options.plotOptions = objectUtilSvc.createObjectFrom(options.plotOptions);
                return options.plotOptions;
            }

            function buildEventsForTopicPartInChart() {
                reportQuestion.data.xAxis.labels = objectUtilSvc.createObjectFrom(reportQuestion.data.xAxis.labels);
                reportQuestion.data.xAxis.labels.events = objectUtilSvc.createObjectFrom(reportQuestion.data.xAxis.labels.events);
                reportQuestion.data.xAxis.labels.events.click = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!arrayUtilSvc.hasValueIn(['tspan', 'text'], event.target.nodeName)) return;

                    var topicIndex = this.pos;
                    var topicLabel = editableLabels.topics[topicIndex];

                    openLabelEditorDialog(topicLabel, function () {
                        if (reportQuestion.data.xAxis.categories[topicIndex] !== topicLabel.latestContent) reportQuestion.data.xAxis.categories[topicIndex] = topicLabel.latestContent;
                    });
                };
            }

            function buildEventsToAreaChart() {
                var series = reportQuestion.data.series,
                    plotOptions = getPlotOptions();

                plotOptions.area = objectUtilSvc.createObjectFrom(plotOptions.area);
                plotOptions.area.events = objectUtilSvc.createObjectFrom(plotOptions.area.events);
                plotOptions.area.events.legendItemClick = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var optionIndex = event.target.index;
                    var optionLabel = editableLabels.options[optionIndex];

                    openLabelEditorDialog(optionLabel, function () {
                        if (series[optionIndex].name !== optionLabel.latestContent) series[optionIndex].name = optionLabel.latestContent;
                    });
                };

                buildEventsForTopicPartInChart();
            }

            function buildEventsToStackedColumnChart() {
                var series = reportQuestion.data.series,
                    plotOptions = getPlotOptions();

                plotOptions.column = objectUtilSvc.createObjectFrom(plotOptions.column);
                plotOptions.column.events = objectUtilSvc.createObjectFrom(plotOptions.column.events);
                plotOptions.column.events.legendItemClick = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var optionIndex = event.target.index;
                    var optionLabel = editableLabels.options[optionIndex];

                    openLabelEditorDialog(optionLabel, function () {
                        if (series[optionIndex].name !== optionLabel.latestContent) series[optionIndex].name = optionLabel.latestContent;
                    });
                };
                buildEventsForTopicPartInChart();
            }

            function buildEventsToStackedBarChart() {
                var series = reportQuestion.data.series,
                    plotOptions = getPlotOptions();

                plotOptions.bar = objectUtilSvc.createObjectFrom(plotOptions.bar);
                plotOptions.bar.events = objectUtilSvc.createObjectFrom(plotOptions.bar.events);
                plotOptions.bar.events.legendItemClick = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var optionIndex = event.target.index;
                    var optionLabel = editableLabels.options[optionIndex];

                    openLabelEditorDialog(optionLabel, function () {
                        if (series[optionIndex].name !== optionLabel.latestContent) series[optionIndex].name = optionLabel.latestContent;
                    });
                };
                buildEventsForTopicPartInChart();
            }

            function openLabelEditorDialog(currentLabel, callback) {
                reportEditorSvc.setWorkingScreenOnPage(false);
                $modal.open({
                    templateUrl: 'survey/reportEditor/editableLabel/label-editor-dialog.html',
                    controller: 'labelEditorDialogCtrl',
                    windowClass: 'center-modal',
                    resolve: {
                        editor: function () {
                            return { label: currentLabel };
                        }
                    }
                }).result.then(function () {
                    reportEditorSvc.setWorkingScreenOnPage(true);
                }, function () {
                    reportEditorSvc.setWorkingScreenOnPage(true);
                    callback();
                });
            }
        }

        function getQuestionByAlias(questionAlias, questions) {
            return arrayUtilSvc.getItem(questions, function (question) {
                return question.questionAlias === questionAlias ? question : null;
            });
        }

        function getRequiredValidation() {
            return {
                question: { valid: true },
                chart: { valid: true },
                tableQuestion: { valid: true },
                freeText: { valid: true }
            };
        }

        function getEditableLabels(reportQuestion) {
            if (reportQuestion.$type === settingConst.report.elementType.text) return null;

            convertReportEditedLabelDefinitionsFromArray(reportQuestion);
            return editableLabelSvc.getEditableLabels(reportQuestion);
        }

        function convertReportEditedLabelDefinitionsFromArray(reportQuestion) {
            if (!arrayUtilSvc.isArrayHasElement(reportQuestion.reportEditedLabelDefinitions)) {
                reportQuestion.editableLabels = {};
                return;
            }

            var editedLabelTypeNames = [];
            for (var key in settingConst.editableLabelTypes) {
                if (settingConst.editableLabelTypes.hasOwnProperty(key)) editedLabelTypeNames.push(key);
            }

            var editableLabels = {};
            reportQuestion.reportEditedLabelDefinitions.forEach(function (definition) {
                definition.isChanged = true;

                switch (definition.reportEditedLabelType) {
                    case settingConst.editableLabelTypes.topic.id:
                        if (!editableLabels.topics) editableLabels.topics = {};
                        editableLabels.topics[definition.position] = definition;
                        editableLabels.topics[definition.position].reportId = reportQuestion.reportId;
                        break;
                    case settingConst.editableLabelTypes.option.id:
                        if (!editableLabels.options) editableLabels.options = {};
                        editableLabels.options[definition.position] = definition;
                        editableLabels.options[definition.position].reportId = reportQuestion.reportId;
                        break;
                    case settingConst.editableLabelTypes.totalTopicRespondents.id:
                        if (!editableLabels.totalTopicRespondents) editableLabels.totalTopicRespondents = {};
                        editableLabels.totalTopicRespondents[definition.position] = definition;
                        editableLabels.totalTopicRespondents[definition.position].reportId = reportQuestion.reportId;
                        break;
                    case settingConst.editableLabelTypes.totalTopicResponses.id:
                        if (!editableLabels.totalTopicResponses) editableLabels.totalTopicResponses = {};
                        editableLabels.totalTopicResponses[definition.position] = definition;
                        editableLabels.totalTopicResponses[definition.position].reportId = reportQuestion.reportId;
                        break;
                    default:
                        editableLabels[editedLabelTypeNames[definition.reportEditedLabelType]] = definition;
                        editableLabels[editedLabelTypeNames[definition.reportEditedLabelType]].reportId = reportQuestion.reportId;
                        break;
                }

                reportQuestion.editableLabels = editableLabels;
            });
        }
    }
})();