(function () {
    angular.module('svt').filter('pageTitleDescriptionFilter', PageTitleDescriptionFilter);

    function PageTitleDescriptionFilter() {
        return function (pages, searchTerm) {
            if (!pages || !searchTerm) return pages;
            var term = searchTerm.toLowerCase();
            return pages.filter(function (page) {
                return page.isChecked ||
                    page.title.toLowerCase().indexOf(term) >= 0 ||
                    page.description.toLowerCase().indexOf(term) >= 0;
            });
        };
    }
})();