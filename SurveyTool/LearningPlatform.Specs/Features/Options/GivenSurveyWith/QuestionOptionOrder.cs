using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Options.GivenSurveyWith
{
    [Binding]
    public class QuestionOptionOrder
    {
        private readonly PageContext _pageContext;
        private readonly InstanceContext _instanceContext;

        public QuestionOptionOrder(PageContext pageContext, InstanceContext instanceContext)
        {
            _pageContext = pageContext;
            _instanceContext = instanceContext;
        }


        [Given(@"I have a survey with a question numbers that is (.*) order")]
        public void GivenIHaveASurveyWithAQuestionThatIsRandomized(OrderType orderType)
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();

            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.SingleSelectionQuestion("numbers", (string)null, null, q => q.OrderType = orderType,
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3"),
                            create.Option("4")))));

            _pageContext.LaunchSurvey(survey);
            _instanceContext.RespondentRepository.SetRespondentId(survey.Id, 2);
            _pageContext.StartSurvey(survey);
        }
    }
}