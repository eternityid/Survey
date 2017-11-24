using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Options.GivenSurveyWith
{
    [Binding]
    public class CustomScriptOptionsMasks
    {
        private readonly PageContext _pageContext;

        public CustomScriptOptionsMasks(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"survey with options masks (.*) on question1 and (.*) on question2")]
        public void GivenIHaveASurveyWithQuestionMasks(string optionsMaskQ1, string optionsMaskQ2)
        {
            if (optionsMaskQ1 == "''" || optionsMaskQ1 == @"""""") optionsMaskQ1 = "";
            if (optionsMaskQ2 == "''" || optionsMaskQ2 == @"""""") optionsMaskQ2 = "";
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion("question1", "", "", q =>
                        {
                            q.OptionsMask = new OptionsMask
                            {
                                OptionsMaskType = OptionsMaskType.Custom,
                                CustomOptionsMask = optionsMaskQ1
                            };
                        },
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3"))),
                    create.Page(
                        create.SingleSelectionQuestion("question2", "", "", q =>
                        {
                            q.OptionsMask = new OptionsMask
                            {
                                OptionsMaskType = OptionsMaskType.Custom,
                                CustomOptionsMask = optionsMaskQ2
                            };
                        },
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3"))
                        )));

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}