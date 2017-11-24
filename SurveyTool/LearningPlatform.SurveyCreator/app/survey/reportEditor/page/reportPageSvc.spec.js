(function() {
    describe('Testing reportPageSvc service', function () {
        var reportSvc, $modal;

        beforeEach(function() {
            module('svt');
            module(function ($provide) {
                $modal = jasmine.createSpyObj('$modal', ['open', 'result']);
                $provide.value('$modal', $modal);

                reportSvc = jasmine.createSpyObj('reportSvc', ['getSeriesForGrid']);
                $provide.value('reportSvc', reportSvc);
            });
        });

        describe('Testing deletePageFromCurrentPages function', function() {
            it('should remove page by page id', inject(function (reportPageSvc) {
                var pages = { data: [{ id: 1 }, { id: 2 }, { id: 3 }] },
                    pageId = 2;
                reportPageSvc.setCurrentPages(pages);

                reportPageSvc.deletePageFromCurrentPages(pageId);

                expect(reportPageSvc.getCurrentPages().data.length).toEqual(2);
            }));
        });

        describe('Testing updatePositionsForCurrentPages function', function() {
            var pageId, oldPosition, newPosition;

            beforeEach(inject(function (reportPageSvc) {
                var pages = { data: [{ id: 1, position: 1 }, { id: 2, position: 2 }, { id: 3, position: 3 }, { id: 4, position: 4 }] };
                reportPageSvc.setCurrentPages(pages);
            }));

            it('should change position when old position is greater than new position', inject(function (reportPageSvc) {
                pageId = 3;
                oldPosition = 2;
                newPosition = 0;

                reportPageSvc.updatePositionsForCurrentPages(pageId, oldPosition, newPosition);

                expect(reportPageSvc.getCurrentPages().data[2].position).toEqual(1);
            }));

            it('should change position when old position is less than new position', inject(function (reportPageSvc) {
                pageId = 2;
                oldPosition = 1;
                newPosition = 3;

                reportPageSvc.updatePositionsForCurrentPages(pageId, oldPosition, newPosition);

                expect(reportPageSvc.getCurrentPages().data[1].position).toEqual(4);
            }));
        });

        describe('Testing getAvailableQuestionsForChartElement function', function () {
            var allQuestions, result;

            it('should checked properties getAvailableQuestionsForChartElement function when it has value', inject(function (reportPageSvc) {
                var allQuestions = null;
                result = reportPageSvc.getAvailableQuestionsForChartElement(allQuestions);

                expect(result).toEqual([]);
            }));

            it('should checked properties getAvailableQuestionsForChartElement function when it has not value', inject(function (reportPageSvc) {
                var allQuestions = [{}];
                result = reportPageSvc.getAvailableQuestionsForChartElement(allQuestions);

                expect(result).not.toEqual([]);
            }));
        });

        describe('Testing getAvailableQuestionsForTableElement function', function () {
            var allQuestions, result;

            it('should checked properties getAvailableQuestionsForTableElement function when it has value', inject(function (reportPageSvc) {
                var allQuestions = null;
                result = reportPageSvc.getAvailableQuestionsForTableElement(allQuestions);

                expect(result).toEqual([]);
            }));

            it('should checked properties getAvailableQuestionsForTableElement function when it has not value', inject(function (reportPageSvc) {
                var allQuestions = [{}];
                result = reportPageSvc.getAvailableQuestionsForTableElement(allQuestions);

                expect(result).not.toEqual([]);
            }));
        });


    });
})();