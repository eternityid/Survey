using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Validation;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Options.GivenSurveyWith
{
    [Binding]
    public class OtherOption
    {
        private readonly PageContext _pageContext;

        public OtherOption(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with other option")]
        public void GivenIHaveASurveyWithOtherOption()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion("question1", "", "", question => question.OrderType = OrderType.InOrder,
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3", (string)null,
                                create.OpenEndedShortTextQuestion("question1Other", "other", null, null, new RequiredValidation())))),
                    create.Page(
                        create.Information("Info"))));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}