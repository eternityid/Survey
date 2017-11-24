using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Loop.GivenSurveyWith
{
    [Binding]
    public class LoopWithOptionsMask
    {
        private readonly PageContext _pageContext;
        private readonly InstanceContext _instanceContext;

        public LoopWithOptionsMask(PageContext pageContext, InstanceContext instanceContext)
        {
            _pageContext = pageContext;
            _instanceContext = instanceContext;
        }


        [Given(@"I have a survey with loop using options masking")]
        public void GivenGoToFolder()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(create.MultipleSelectionQuestion("q1", "", "", null,
                        create.Option("1", text: "BMW"),
                        create.Option("2", text: "Mercedes"),
                        create.Option("3", text: "Ford"))),
                    create.Loop("loop", "questions.q1.optionsSelected",
                    new [] {                        
                        create.Option("1", text: "BMW"),
                        create.Option("2", text: "Mercedes"),
                        create.Option("3", text: "Ford")},
                        create.Page(
                            create.OpenEndedShortTextQuestion("q2", "", "{{loops.loop}}"))),
                    create.Page(create.Information("Info")),
                    create.Page(p=>p.NavigationButtonSettings = NavigationButtonSettings.None, create.Information("Completed"))));
            _pageContext.ClearRepositories();
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}