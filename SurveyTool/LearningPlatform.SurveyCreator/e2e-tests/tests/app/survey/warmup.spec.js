describe('Get started', function () {
      var SurveyListPage = requirePage('app/survey/surveyListPage')

      var surveyListPage;

      beforeAll(function (done) {
          surveyListPage = new SurveyListPage();
          surveyListPage.goTo();
          done();
      });

      it('is warmed up', function (done) {
          done();
      });
  });
