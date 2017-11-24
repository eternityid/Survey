using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyExecution.Scripting;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Validation.GivenSurveyWith
{
    [Binding]
    public class RequiredQuestion
    {
        private readonly PageContext _pageContext;

        public RequiredQuestion(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have survey with required question")]
        public void GivenIHaveSurveyWithRequiredQuestion()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.OpenEndedShortTextQuestion("nameId", "name", null, null,
                            create.RequiredValidation())),
                    create.Page(
                        create.Information("Info"))));
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
            //ServiceLocator.Resolve<IScriptExecutor>().Dispose();
        }
    }
}