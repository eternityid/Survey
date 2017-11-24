using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.ImportExportSurveyDef.GivenSurveyWith
{
    [Binding]
    public class SimpleSurvey
    {
        private readonly SurveyContext _surveyContext;

        public SimpleSurvey(SurveyContext surveyContext)
        {
            _surveyContext = surveyContext;
        }

        [Given(@"I have a simple survey for export")]
        public void GivenIHaveASimpleSurvey()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.SingleSelectionQuestion("gender", "", "", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "male"),
                            create.Option("2", text: "female"))),
                    create.Page(
                        create.NumericQuestion("age")),
                    create.Page(
                        create.Information("information")),
                    create.Page(p=>p.NavigationButtonSettings = NavigationButtonSettings.None,
                        create.Information("Completed"))
                    ));
            survey.SurveySettings.SurveyTitle = "New Survey";

            _surveyContext.AddSurvey(survey);
        }
    }
}