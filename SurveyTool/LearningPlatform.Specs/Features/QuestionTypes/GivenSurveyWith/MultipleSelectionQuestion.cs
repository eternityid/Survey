using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.QuestionTypes.GivenSurveyWith
{
    [Binding]
    public class MultipleSelectionQuestion
    {
        private readonly PageContext _pageContext;

        public MultipleSelectionQuestion(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with a multiple selection question")]
        public void GivenIHaveAMultipleSelectionQuestion()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion("cars", "Cars you like", "Please choose the cars to like", question => question.OrderType = OrderType.InOrder,
                            create.Option("1", text: "BMW"),
                            create.Option("2", text: "Mercedes"),
                            create.Option("3", text: "Ford"))),
                    create.Page(
                        create.Information("information", "Information", "test")))
                );

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}