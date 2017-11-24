(function () {
    'use strict';

    angular
        .module('svt')
        .controller('reportPageCtrl', reportPageCtrl);

    reportPageCtrl.$inject = [
        '$scope', '$modal', 'reportPageSvc', 'reportPageDataSvc',
        'constantSvc', 'spinnerUtilSvc', 'errorHandlingSvc',
        'settingConst', 'arrayUtilSvc', 'reportEditorSvc', 'reportElementDataSvc'
    ];

    function reportPageCtrl(
        $scope, $modal, reportPageSvc, reportPageDataSvc,
        constantSvc, spinnerUtilSvc, errorHandlingSvc,
        settingConst, arrayUtilSvc, reportEditorSvc, reportElementDataSvc) {
        /* jshint -W040 */

        var questionTypes = settingConst.questionTypes;
        var vm = this;
        vm.questionsTypes = questionTypes;
        vm.questions = reportEditorSvc.getReportData().questions;

        vm.pageIndex = $scope.pageIndex;
        vm.activePage = reportPageSvc.getActivePage();
        vm.pages = reportPageSvc.getCurrentPages();
        vm.currentPage = vm.pages.data[vm.pageIndex];
        vm.collapsedPageIds = reportPageSvc.getCollapsedPageIds();
        vm.requiredValidation = reportPageSvc.getRequiredValidation();
        vm.minNumberOfPages = 1;
        vm.elementType = settingConst.report.elementType;
        vm.page = {
            index: vm.pageIndex,
            data: vm.currentPage
        };

        vm.onAddChart = onAddChart;
        vm.onAddTable = onAddTable;
        vm.onAddFreeText = onAddFreeText;
        vm.onDeleteElement = onDeleteElement;
        vm.onAddPage = onAddPage;
        vm.onDeletePage = onDeletePage;
        vm.toggleCollapsePage = toggleCollapsePage;
        vm.onEditElement = onEditElement;
        vm.editingElement = reportPageSvc.getEditingElement();
        vm.init = init;
        vm.isNoData = reportEditorSvc.isNoData();

        init();

        function init() {
            vm.workingElementIds = reportPageSvc.getWorkingElementIds();
            vm.showedMarginPage = reportEditorSvc.getShowedMarginPage();
            loadDataToCombo();
            reportPageSvc.loadDataForReportElementsInPage(vm.currentPage);
            return;

            function loadDataToCombo() {
                vm.page.chartQuestions = reportPageSvc.getAvailableQuestionsForChartElement(vm.questions);
                vm.page.tableQuestions = reportPageSvc.getAvailableQuestionsForTableElement(vm.questions);
            }
        }

        function onAddChart() {
            showElementDialog(true, vm.elementType.chart);
        }

        function onAddTable() {
            showElementDialog(true, vm.elementType.table);
        }

        function onAddFreeText() {
            showElementDialog(true, vm.elementType.text);
        }

        function onAddPage() {
            spinnerUtilSvc.showSpinner();
            var addMessages = {
                fail: 'Creating page was not successful.'
            };

            reportPageSvc.addPage(vm.currentPage.position, vm.currentPage.reportId).$promise.then(function (response) {
                if (!response.status) {
                    toastr.error(addMessages.fail);
                    spinnerUtilSvc.hideSpinner();
                    return;
                }

                reportPageSvc.addPageToCurrentPages(vm.currentPage.position, vm.currentPage.reportId, response.identifier);
                reportPageSvc.setActivePageIndex(vm.pageIndex + 1);
                spinnerUtilSvc.hideSpinner();
            }, function (error) {
                spinnerUtilSvc.hideSpinner();
                errorHandlingSvc.manifestError(addMessages.fail, error);
            });
        }

        function onDeletePage(event) {
            event.stopPropagation();
            var deleteMessages = {
                fail: 'Deleting page was not successful.'
            };

            if (vm.currentPage.reportElementDefinitions && vm.currentPage.reportElementDefinitions.length > 0) {
                deletePageHasQuestion();
            } else {
                deletePage();
            }
            return;

            function deletePageHasQuestion() {
                var confirmMessage = constantSvc.messages.deleteReportPage;
                $modal.open({
                    templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                    controller: 'deleteDialogCtrl',
                    windowClass: 'center-modal',
                    resolve: {
                        modalData: function () {
                            return {
                                message: confirmMessage
                            };
                        }
                    }
                }).result.then(function (result) {
                    if (result.status) {
                        deletePage();
                    }
                });
            }

            function deletePage() {
                spinnerUtilSvc.showSpinner();
                reportPageDataSvc.deletePage(vm.currentPage).$promise.then(function (response) {
                    if (!response.status) {
                        toastr.error(deleteMessages.fail);
                        spinnerUtilSvc.hideSpinner();
                        return;
                    }
                    reportPageSvc.deletePageFromCurrentPages(vm.currentPage.id);
                    spinnerUtilSvc.hideSpinner();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError(deleteMessages.fail, error);
                });
            }
        }

        function toggleCollapsePage(pageId) {
            var index = vm.collapsedPageIds.indexOf(pageId);
            if (index >= 0) {
                vm.collapsedPageIds.splice(index, 1);
            } else {
                vm.collapsedPageIds.push(pageId);
            }
        }

        function onDeleteElement(event, reportQuestion) {
            event.stopPropagation();
            var deleteMessages = {
                fail: 'Deleting element was not successful.'
            };

            deleteReportElement();

            return;

            function deleteReportElement() {
                var confirmMessage = constantSvc.messages.deleteReportElement;
                reportEditorSvc.setWorkingScreenOnPage(false);
                $modal.open({
                    templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                    controller: 'deleteDialogCtrl',
                    windowClass: 'center-modal',
                    resolve: {
                        modalData: function () {
                            return {
                                message: confirmMessage
                            };
                        }
                    }
                }).result.then(function (result) {
                    if (result.status) {
                        removeElement();
                    }
                }, function() {
                    reportEditorSvc.setWorkingScreenOnPage(true);
                });
            }

            function removeElement() {
                spinnerUtilSvc.showSpinner();
                reportElementDataSvc.deleteReportElement(reportQuestion).$promise.then(function() {
                    for (var i = 0; i < vm.currentPage.reportElementDefinitions.length; i++) {
                        if (vm.currentPage.reportElementDefinitions[i].id === reportQuestion.id) {
                            vm.currentPage.reportElementDefinitions.splice(i--, 1);
                        }
                    }
                    spinnerUtilSvc.hideSpinner();
                }, function(error) {
                    spinnerUtilSvc.hideSpinner();
                    errorHandlingSvc.manifestError(deleteMessages.fail, error);
                });
            }
        }

        function onEditElement(reportQuestion) {
            reportPageSvc.setEditingElementId(reportQuestion.id);
            reportPageSvc.setActivePageIndex(-1);

            var element = {
                type: reportQuestion.$type,
                id: reportQuestion.id,
                reportId: reportQuestion.reportId,
                questionId: reportQuestion.question ? reportQuestion.question.id : '',
                questionAlias: reportQuestion.question ? reportQuestion.question.questionAlias : '',
                chartType: reportQuestion.chartTypeString,
                text: reportQuestion.text
            };
            showElementDialog(false, element.type, element);
        }

        function showElementDialog(isAdd, elementType, activeElement) {
            vm.editor = {
                isAdd: isAdd,
                elementType: elementType,
                element: activeElement,
                page: vm.page
            };

            reportEditorSvc.setWorkingScreenOnPage(false);
            $modal.open({
                templateUrl: 'survey/reportEditor/elementDialog/element-dialog.html',
                controller: 'elementDialogCtrl',
                windowClass: 'center-modal',
                resolve: {
                    editor: function () {
                        return vm.editor;
                    }
                },
                keyboard: false
            }).result.then(function (result) {
                reportEditorSvc.setWorkingScreenOnPage(true);
                if (result.status === true) {
                    if (result.isAdd) {
                        reportPageSvc.addReportElementIntoPage(result.element, vm.page);
                    } else {
                        reportPageSvc.updateReportElementInPage(result.element, vm.page);
                    }
                    loadReportElement(result.element);
                }
            }, function() {
                reportEditorSvc.setWorkingScreenOnPage(true);
            });

            function loadReportElement(reportElement) {
                var reportQuestion = arrayUtilSvc.getItem(vm.page.data.reportElementDefinitions, function (item) {
                    return item.id === reportElement.id ? item : undefined;
                });
                if (!reportQuestion) return;

                switch (reportElement.$type) {
                    case settingConst.report.elementType.chart:
                        reportPageSvc.loadChartByQuestion(reportQuestion);
                        break;
                    case settingConst.report.elementType.table:
                        reportPageSvc.loadTableByQuestion(reportQuestion);
                }
            }
        }
    }
})();
