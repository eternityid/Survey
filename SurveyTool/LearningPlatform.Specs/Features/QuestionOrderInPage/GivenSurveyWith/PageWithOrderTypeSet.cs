using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.QuestionOrderInPage.GivenSurveyWith
{
    [Binding]
    public class PageWithOrderTypeSet
    {
        private readonly PageContext _pageContext;
        private readonly InstanceContext _instanceContext;

        public PageWithOrderTypeSet(PageContext pageContext, InstanceContext instanceContext)
        {
            _pageContext = pageContext;
            _instanceContext = instanceContext;
        }

        [Given(@"I have a survey with a page that is (.*) order")]
        public void GivenIHaveASurveyWithAPageThatIsRandomized(OrderType orderType)
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(p => p.OrderType = orderType,
                        create.OpenEndedShortTextQuestion("q1"),
                        create.OpenEndedShortTextQuestion("q2"),
                        create.OpenEndedShortTextQuestion("q3"),
                        create.OpenEndedShortTextQuestion("q4"))));
            _pageContext.LaunchSurvey(survey);
            _instanceContext.RespondentRepository.SetRespondentId(survey.Id, 2);
            _pageContext.StartSurvey(survey);
        }
    }
}