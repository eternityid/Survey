(function () {
    'use strict';

    angular
        .module('svt')
        .directive('svtReport', SvtReport);

    SvtReport.$inject = ['reportConst', 'angularScopeUtilSvc'];

    function SvtReport(reportConst, angularScopeUtilSvc) {
        var directive = {
            restrict: 'E',
            templateUrl: 'survey/result/report/report.html',
            controller: 'reportCtrl',
            controllerAs: 'vm',
            link: handlePrintReport
        };

        return directive;

        function handlePrintReport(scope, element) {
            var printMedia = window.matchMedia('print');
            printMedia.addListener(function (event) {
                if (!event.matches) {
                    angularScopeUtilSvc.safeApply(scope, function () {
                        scope.isPrintReport = false;
                    });
                }
            });

            var renderPrintAreaTime = 1000;
            $('.print-report-button', element).click(function (event) {
                event.preventDefault();
                setTimeout(function () {
                    $('rs-open-text-question', '.print-area').each(function (index, textQuestionElement) {
                        var resultCount = parseInt($('table', $('rs-open-text-question', '.view-area').get(index)).attr('result'));

                        if (resultCount > reportConst.paging.level1 && resultCount <= reportConst.paging.level2) {
                            $('[show=' + reportConst.paging.level2 + ']', textQuestionElement).trigger('click');
                        } else if (resultCount > reportConst.paging.level2 && resultCount <= reportConst.paging.level3) {
                            $('[show=' + reportConst.paging.level3 + ']', textQuestionElement).trigger('click');
                        } else if (resultCount > reportConst.paging.level3 && resultCount <= reportConst.paging.level4) {
                            $('[show=' + reportConst.paging.level4 + ']', textQuestionElement).trigger('click');
                        } else if (resultCount > reportConst.paging.level4) {
                            $('[show=' + reportConst.paging.level5 + ']', textQuestionElement).trigger('click');
                        }
                    });

                    window.print();
                }, renderPrintAreaTime);
            });

            $(document).bind("keydown", function (event) {
                if (event.ctrlKey && event.keyCode === reportConst.keyCode.letterP) {
                    $('.print-report-button', element).trigger('click');
                    return false;
                }
            });
        }
    }
})();