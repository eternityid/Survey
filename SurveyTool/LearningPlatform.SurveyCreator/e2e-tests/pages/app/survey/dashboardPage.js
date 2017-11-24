var BasePage = requirePage('common/basePage');
var DashboardPage = function (url) {
    var self = this;

    self.url = url || '#/surveys/:surveyId/dashboard';
};

DashboardPage.prototype = new BasePage();
DashboardPage.prototype.goTo = function () {
    BasePage.prototype.goTo(this.url);
};

DashboardPage.prototype.at = function () {
    return BasePage.prototype.at(this.url);
};

module.exports = DashboardPage;