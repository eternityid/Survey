using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Loop.GivenSurveyWith
{
    [Binding]
    public class Loop
    {
        private readonly PageContext _pageContext;

        public Loop(PageContext pageContext)
        {
            _pageContext = pageContext;
        }


        [Given(@"I have a survey with loop")]
        public void GivenGoToFolder()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(create.Information("start")),
                    create.Loop("loop", "",
                    new [] {                        
                        create.Option("1", text: "BMW"),
                        create.Option("2", text: "Mercedes"),
                        create.Option("3", text: "Ford")},
                        create.Page(
                            create.OpenEndedShortTextQuestion("q2"))),
                    create.Page(create.Information("complete"))));
            survey.SurveySettings.ResumeRespondentWhereLeftOff = true;
            survey.SurveySettings.EnableBackButton = true;
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}