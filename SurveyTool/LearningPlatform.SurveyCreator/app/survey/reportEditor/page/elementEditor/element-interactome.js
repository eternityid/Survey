(function () {
    'use strict';

    angular
        .module('svt')
        .directive('elementInteractome', draggable);

    draggable.$inject = [
        '$document', 'settingConst', 'rpElementEditorSvc', 'reportElementDataSvc', 'reportPageSvc', 'reportEditorSvc',
        'angularScopeUtilSvc'
    ];

    function draggable($document, settingConst, rpElementEditorSvc, reportElementDataSvc, reportPageSvc, reportEditorSvc,
        angularScopeUtilSvc) {
        return {
            restrict: 'A',
            scope: {
                pageData: '=',
                questionData: '='
            },
            link: function (scope, element) {
                var maxzIndexToReset = settingConst.report.maxzIndexToReset;
                var minElementSize = settingConst.report.minElementSize;
                var draggablePageConfig = {
                    padding: 0,
                    borderWidth: 2,
                    borderColor: '#244f95'
                };
                var resizeConstants = {
                    main: 'resize',
                    left: 'resize-left',
                    right: 'resize-right',
                    top: 'resize-top',
                    bottom: 'resize-bottom',
                    topLeft: 'resize-top-left',
                    topRight: 'resize-top-right',
                    bottomLeft: 'resize-bottom-left',
                    bottomRight: 'resize-bottom-right'
                };
                var startX = 0, startY = 0, x = 0, y = 0, z = 0;
                var isResizeMode = false, resizeClass = '', width = 0, height = 0;
                var orginalX = 0, orginalY = 0, orginalZ = 0;
                var elementPosition = {};

                init();

                function init() {
                    scope.workingElementIds = reportPageSvc.getWorkingElementIds();
                    scope.editingElement = reportPageSvc.getEditingElement();
                    if (!scope.pageData || !scope.questionData) return;

                    if (scope.questionData.position) {
                        x = parseInt(scope.questionData.position.x);
                        y = parseInt(scope.questionData.position.y);
                        z = orginalZ = parseInt(scope.questionData.position.z);
                        width = parseInt(scope.questionData.size.width) || settingConst.report.defaultElementSize.width;
                        height = parseInt(scope.questionData.size.height) || settingConst.report.defaultElementSize.height;
                    }

                    element.css({
                        position: 'absolute',
                        backgroundColor: 'white',
                        cursor: 'move',
                        display: 'block',
                        boxSizing: 'border-box',
                        top: y + 'px',
                        left: x + 'px',
                        zIndex: z
                    });

                    if (width > 0 && height > 0) element.css({ width: width, height: height });
                    onMouseDownElement();

                    scope.$watch('workingElementIds.deselected', function () {
                        if (scope.workingElementIds.deselected === scope.questionData.id) {
                            element.css({ zIndex: orginalZ });
                        }
                    });
                    scope.$watch('editingElement.id', function () {
                        if (scope.editingElement.id === 0 && scope.workingElementIds.selected === scope.questionData.id) {
                            var zRestore = rpElementEditorSvc.getzIndexMax(scope.pageData) + 1;
                            element.css({ zIndex: zRestore });
                            arrangeStretchedPoints();
                        }
                    });

                    return;

                    function onMouseDownElement() {
                        element.on('mousedown.draggable', { pageData: scope.pageData, questionData: scope.questionData }, function (event) {
                            if (!element.hasClass('selected')) {
                                setActiveElement(event);
                            } else {
                                orginalX = event.screenX;
                                orginalY = event.screenY;

                                startX = event.screenX - x;
                                startY = event.screenY - y;

                                elementPosition = getElementPosition(element);
                                isResizeMode = isResizable();
                                angularScopeUtilSvc.safeApply(scope);

                                $document.on('mousemove.draggable', { pageData: event.data.pageData, questionData: event.data.questionData }, mousemove);
                                $document.on('mouseup.draggable', { pageData: event.data.pageData, questionData: event.data.questionData }, mouseup);
                            }
                            event.preventDefault();
                            event.stopImmediatePropagation();
                            return;

                            function isResizable() {
                                if (event.target.tagName.toLowerCase() !== 'div') return false;
                                resizeClass = event.target.className || '';
                                return [resizeConstants.left, resizeConstants.right, resizeConstants.top, resizeConstants.bottom, resizeConstants.topLeft, resizeConstants.topRight, resizeConstants.bottomLeft, resizeConstants.bottomRight].some(function (item) {
                                    return resizeClass.indexOf(item) > 0;
                                });
                            }
                        });
                    }

                    function setActiveElement(event) {
                        z = rpElementEditorSvc.getzIndexMax(event.data.pageData) + 1;
                        element.css({ zIndex: z });

                        reportPageSvc.setDeselectedElementId(reportPageSvc.getWorkingElementIds().selected);
                        reportPageSvc.setSelectedElementId(scope.questionData.id);
                        angularScopeUtilSvc.safeApply(scope);

                        arrangeStretchedPoints();
                    }

                    function getElementPosition(elementItem) {
                        var item = {};
                        item.orginalSize = {
                            width: elementItem.width(),
                            height: elementItem.height()
                        };

                        var position = elementItem.position();
                        item.topLeft = position;
                        item.topRight = {
                            top: position.top,
                            left: position.left + elementItem.width()
                        };
                        item.bottomLeft = {
                            top: position.top + elementItem.height(),
                            left: position.left
                        };
                        item.bottomRight = {
                            top: position.top + elementItem.height(),
                            left: position.left + elementItem.width()
                        };
                        return item;
                    }
                }

                function arrangeStretchedPoints() {
                    var elements = element.find('[class="' + resizeConstants.main + ' ' + resizeConstants.left + '"]');
                    elements.first().css({
                        top: element.height() / 2 + 'px'
                    });

                    elements = element.find('[class="' + resizeConstants.main + ' ' + resizeConstants.right + '"]');
                    elements.first().css({
                        top: element.height() / 2 + 'px',
                        left: element.width() + 'px'
                    });

                    elements = element.find('[class="' + resizeConstants.main + ' ' + resizeConstants.top + '"]');
                    elements.first().css({
                        left: element.width() / 2 + 'px'
                    });

                    elements = element.find('[class="' + resizeConstants.main + ' ' + resizeConstants.bottom + '"]');
                    elements.first().css({
                        top: element.height() + 'px',
                        left: element.width() / 2 + 'px'
                    });

                    elements = element.find('[class="' + resizeConstants.main + ' ' + resizeConstants.bottomLeft + '"]');
                    elements.first().css({
                        top: element.height() + 'px'
                    });

                    elements = element.find('[class="' + resizeConstants.main + ' ' + resizeConstants.topRight + '"]');
                    elements.first().css({
                        left: element.width() + 'px'
                    });

                    elements = element.find('[class="' + resizeConstants.main + ' ' + resizeConstants.bottomRight + '"]');
                    elements.first().css({
                        left: element.width() + 'px',
                        top: element.height() + 'px'
                    });
                }

                function mousemove(event) {
                    if (isClickOnButton()) {
                        return;
                    }
                    hideButtonGroup();
                    reportEditorSvc.setShowedMarginPageId(scope.pageData.id);
                    angularScopeUtilSvc.safeApply(scope);
                    if (isResizeMode) {
                        onMouseMoveByResizingElement();
                    } else {
                        onMouseMoveByMovingElement();
                    }
                    return;

                    function isClickOnButton() {
                        var target = event.target;
                        if (target.tagName.toLowerCase() === 'i' && $(target).hasClass('glyphicon')) return true;
                        return false;
                    }

                    function hideButtonGroup() {
                        var buttonGroup = element.find('div.element-commands');
                        if (!buttonGroup || !buttonGroup.length) return;
                        buttonGroup.removeClass('element-commands--hidden').addClass('element-commands--hidden');
                    }

                    function onMouseMoveByMovingElement() {
                        y = event.screenY - startY;
                        x = event.screenX - startX;
                        keepElementInsidePage();

                        element.css({
                            top: y + 'px',
                            left: x + 'px'
                        });
                        return;

                        function keepElementInsidePage() {
                            var heightElement = element.height();
                            var widthElement = element.width();
                            var heightParentElement = element.parent().height();
                            var widthParentElement = element.parent().width();
                            var a4Width = settingConst.report.a4.width;

                            if (y < draggablePageConfig.padding) y = draggablePageConfig.padding;
                            if (x < draggablePageConfig.padding) x = draggablePageConfig.padding;
                            if (x + element.width() + draggablePageConfig.padding > a4Width) x = a4Width - draggablePageConfig.padding - element.width();
                            if (y + heightElement + 1 > heightParentElement) {
                                y = heightParentElement - heightElement - draggablePageConfig.padding - draggablePageConfig.borderWidth;
                            }
                            if (x + widthElement + 1 > widthParentElement) {
                                x = widthParentElement - widthElement - draggablePageConfig.borderWidth;
                            }
                        }
                    }

                    function onMouseMoveByResizingElement() {
                        if (typeof resizeClass !== 'string') return;
                        var scale = elementPosition.orginalSize.width / elementPosition.orginalSize.height;
                        var resizeX = 0, resizeY = 0;

                        if (resizeClass.indexOf(resizeConstants.topLeft) > 0) resizeTopLeftElement();
                        else if (resizeClass.indexOf(resizeConstants.topRight) > 0) resizeTopRightElement();
                        else if (resizeClass.indexOf(resizeConstants.bottomLeft) > 0) resizeBottomLeftElement();
                        else if (resizeClass.indexOf(resizeConstants.bottomRight) > 0) resizeBottomRightElement();

                        else if (resizeClass.indexOf(resizeConstants.left) > 0) resizeLeftElement();
                        else if (resizeClass.indexOf(resizeConstants.right) > 0) resizeRightElement();
                        else if (resizeClass.indexOf(resizeConstants.top) > 0) resizeTopElement();
                        else if (resizeClass.indexOf(resizeConstants.bottom) > 0) resizeBottomElement();

                        arrangeStretchedPoints();
                        $(window).resize();
                        return;

                        function resizeLeftElement() {
                            resizeX = event.screenX - orginalX;
                            if (elementPosition.orginalSize.width - resizeX < minElementSize) return;
                            if (elementPosition.topLeft.left + resizeX < 0) return;

                            element.css({
                                left: (elementPosition.topLeft.left + resizeX) + 'px'
                            });
                            element.width(elementPosition.orginalSize.width - resizeX);
                        }

                        function resizeRightElement() {
                            resizeX = event.screenX - orginalX;
                            if (elementPosition.orginalSize.width + resizeX < minElementSize) return;
                            if (elementPosition.topLeft.left + elementPosition.orginalSize.width + resizeX > settingConst.report.spaceInA4.width) return;

                            element.width(elementPosition.orginalSize.width + resizeX);
                        }

                        function resizeTopElement() {
                            resizeY = event.screenY - orginalY;
                            if (elementPosition.orginalSize.height - resizeY < minElementSize) return;
                            if (elementPosition.topLeft.top + resizeY < 0) return;

                            element.css({
                                top: (elementPosition.topLeft.top + resizeY) + 'px'
                            });
                            element.height(elementPosition.orginalSize.height - resizeY);
                        }

                        function resizeBottomElement() {
                            resizeY = event.screenY - orginalY;
                            if (elementPosition.orginalSize.height + resizeY < minElementSize) return;
                            if (elementPosition.topLeft.top + elementPosition.orginalSize.height + resizeY > settingConst.report.spaceInA4.height) return;

                            element.css({
                                top: elementPosition.topLeft.top + 'px'
                            });
                            element.height(elementPosition.orginalSize.height + resizeY);
                        }

                        function resizeTopLeftElement() {
                            resizeY = event.screenY - orginalY;
                            resizeX = event.shiftKey ? parseInt(scale * resizeY) : event.screenX - orginalX;

                            if (elementPosition.orginalSize.width - resizeX < minElementSize || elementPosition.orginalSize.height - resizeY < minElementSize) return;
                            if (elementPosition.topLeft.left + resizeX < 0 || elementPosition.topLeft.top + resizeY < 0) return;

                            element.css({
                                left: elementPosition.topLeft.left + resizeX + 'px',
                                top: elementPosition.topLeft.top + resizeY + 'px'
                            });
                            element.width(elementPosition.orginalSize.width - resizeX);
                            element.height(elementPosition.orginalSize.height - resizeY);
                        }

                        function resizeTopRightElement() {
                            resizeY = event.screenY - orginalY;
                            resizeX = event.shiftKey ? parseInt(scale * resizeY) : event.screenX - orginalX;

                            if (elementPosition.orginalSize.width + resizeX < minElementSize || elementPosition.orginalSize.height - resizeY < minElementSize) return;
                            if (elementPosition.topLeft.left + elementPosition.orginalSize.width + resizeX > 680 || elementPosition.topLeft.top + resizeY < 0) return;

                            element.css({
                                left: elementPosition.topLeft.left + 'px',
                                top: elementPosition.topLeft.top + resizeY + 'px'
                            });
                            if (event.shiftKey) {
                                element.width(elementPosition.orginalSize.width - resizeX);
                            } else {
                                element.width(elementPosition.orginalSize.width + resizeX);
                            }
                            element.height(elementPosition.orginalSize.height - resizeY);
                        }

                        function resizeBottomLeftElement() {
                            if (event.shiftKey) {
                                resizeY = -(event.screenY - orginalY);
                                resizeX = parseInt(scale * resizeY);
                            } else {
                                resizeX = event.screenX - orginalX;
                                resizeY = event.screenY - orginalY;
                            }
                            if (elementPosition.orginalSize.width - resizeX < minElementSize || elementPosition.orginalSize.height + resizeY < minElementSize) return;
                            if (elementPosition.topLeft.left + resizeX < 0 || elementPosition.topLeft.top + elementPosition.orginalSize.height + resizeY > settingConst.report.spaceInA4.height) return;

                            element.css({
                                left: elementPosition.topLeft.left + resizeX + 'px',
                                top: elementPosition.topLeft.top + 'px'
                            });
                            element.width(elementPosition.orginalSize.width - resizeX);
                            if (event.shiftKey) {
                                element.height(elementPosition.orginalSize.height - resizeY);
                            } else {
                                element.height(elementPosition.orginalSize.height + resizeY);
                            }
                        }

                        function resizeBottomRightElement() {
                            resizeY = event.screenY - orginalY;
                            resizeX = event.shiftKey ? parseInt(scale * resizeY) : event.screenX - orginalX;

                            if (elementPosition.orginalSize.width + resizeX < minElementSize || elementPosition.orginalSize.height + resizeY < minElementSize) return;
                            if (elementPosition.topLeft.left + elementPosition.orginalSize.width + resizeX > settingConst.report.spaceInA4.width || elementPosition.topLeft.top + elementPosition.orginalSize.height + resizeY > settingConst.report.spaceInA4.height) return;

                            element.css({
                                left: elementPosition.topLeft.left + 'px',
                                top: elementPosition.topLeft.top + 'px'
                            });
                            element.width(elementPosition.orginalSize.width + resizeX);
                            element.height(elementPosition.orginalSize.height + resizeY);
                        }
                    }
                }

                function mouseup(event) {
                    $document.off('mousemove.draggable', mousemove);
                    $document.off('mouseup.draggable', mouseup);
                    showButtonGroup();
                    var pageData = event.data.pageData;
                    var questionData = event.data.questionData;
                    if (!questionData.position) return;

                    if (isResizeMode) {
                        onMouseUpByResizingElement();
                    } else {
                        onMouseUpByMovingElement();
                    }

                    reportEditorSvc.setShowedMarginPageId(0);
                    angularScopeUtilSvc.safeApply(scope);
                    return;

                    function showButtonGroup() {
                        var buttonGroup = element.find('div.element-commands');
                        if (!buttonGroup || !buttonGroup.length) return;
                        buttonGroup.removeClass('element-commands--hidden');
                    }

                    function onMouseUpByResizingElement() {
                        var position = element.position();
                        questionData.PositionAndSize = getPositionAndSize(position.left, position.top, z, element.width(), element.height());
                        reportElementDataSvc.updateElementSize(questionData);
                        x = position.left;
                        y = position.top;
                        return;

                        function getPositionAndSize(leftPosition, topPosition, zIndexPosition, widthElement, heightElement) {
                            return {
                                x: leftPosition,
                                y: topPosition,
                                z: zIndexPosition,
                                width: widthElement,
                                height: heightElement
                            };
                        }
                    }

                    function onMouseUpByMovingElement() {
                        questionData.position.x = x;
                        questionData.position.y = y;
                        questionData.position.z = z;
                        if (z >= maxzIndexToReset) {
                            questionData.Positions = resetzIndex();
                            reportElementDataSvc.updateElementPositions(questionData);
                        } else {
                            reportElementDataSvc.updateElementPosition(questionData);
                        }
                        return;

                        function resetzIndex() {
                            var elements = pageData.reportElementDefinitions || [];
                            var zIndexes = elements.map(function (elementItem) {
                                if (elementItem.id === questionData.id) {
                                    return { elementId: elementItem.id, z: questionData.position.z, x: questionData.position.x, y: questionData.position.y };
                                }
                                return { elementId: elementItem.id, z: elementItem.position.z };
                            });

                            zIndexes.sort(function (a, b) {
                                return parseFloat(a.z) - parseFloat(b.z);
                            });

                            var i = 1;
                            zIndexes.forEach(function (item) {
                                item.z = i;
                                i++;
                            });

                            return zIndexes;
                        }
                    }
                }

            }
        };
    }
})();