using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Options.GivenSurveyWith
{
    [Binding]
    public class QuestionOptionOrderFixedPosition
    {
        private readonly PageContext _pageContext;
        private readonly InstanceContext _instanceContext;

        public QuestionOptionOrderFixedPosition(PageContext pageContext, InstanceContext instanceContext)
        {
            _pageContext = pageContext;
            _instanceContext = instanceContext;
        }


        [Given(@"I have a survey with a question numbers that is (.*) order where the last option is in fixed position")]
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
                            create.Option("4", isFixedPosition:true)))));

            _pageContext.LaunchSurvey(survey);
            _instanceContext.RespondentRepository.SetRespondentId(survey.Id, 2);
            _pageContext.StartSurvey(survey);
        }
    }
}