using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.RandomDataGenerator.GivenSurvey
{
    [Binding]
    public class RandomDataGeneratorSurvey
    {
        private readonly PageContext _pageContext;
        private readonly InstanceContext _instanceContext;

        public RandomDataGeneratorSurvey(PageContext pageContext, InstanceContext instanceContext)
        {
            _pageContext = pageContext;
            _instanceContext = instanceContext;
        }

        [Given(@"I have a survey for random data generation")]
        public void GivenIHaveAMultipleSelectionQuestion()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion("cars", "Cars you like", "Please choose the cars to like", question => question.OrderType = OrderType.InOrder,
                            create.Option("bmw", text: "BMW"),
                            create.Option("mercedes", text: "Mercedes"),
                            create.Option("ford", text: "Ford"),
                            create.Option("tesla", text: "Tesla"))),
                    create.Page(
                        create.SingleSelectionQuestion("cars_fav", "", "Please choose favorite car", question => question.OrderType = OrderType.InOrder,
                            create.Option("bmw", text: "BMW"),
                            create.Option("mercedes", text: "Mercedes"),
                            create.Option("ford", text: "Ford"),
                            create.Option("tesla", text: "Tesla")),
                        create.OpenEndedShortTextQuestion("name", "name", "")),
                    create.Page(
                        create.SingleSelectionGridQuestion("rate", "Rate the following cars", "1 is bad, 4 is great",
                            create.SingleSelectionQuestion("", "", "",
                                q => q.OrderType = OrderType.InOrder,
                                create.Option("1", text: "1"),
                                create.Option("2", text: "2"),
                                create.Option("3", text: "3"),
                                create.Option("4", text: "4")),
                            q => q.OrderType = OrderType.InOrder,
                            create.Option("bmw", text: "BMW"),
                            create.Option("mercedes", text: "Mercedes"),
                            create.Option("ford", text: "Ford"))),
                    create.Page(
                        create.RatingQuestion("rateBmw", "Please rate BMW", "", 5),
                        create.NumericQuestion("numeric"),
                        create.DateQuestion("date")),
                    create.Page(
                        create.Information("information", "Information", "test")))
                );
            _pageContext.ClearRepositories();
            _pageContext.LaunchSurvey(survey);
        }
    }
}