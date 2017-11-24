using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.Options.GivenSurveyWith
{
    [Binding]
    public class CarryOverOptions
    {
        private readonly PageContext _pageContext;

        public CarryOverOptions(PageContext pageContext)
        {
            _pageContext = pageContext;
        }


        [Given(@"I have a survey with carry over options with type (.*)")]
        public void GivenIHaveASurveyWithAQuestionThatIsRandomized(OptionsMaskType type)
        {
            CreateSurvey(type, "");
        }

        [Given(@"I have a survey with carry over options with custom mask script (.*)")]
        public void GivenIHaveASurveyWithAQuestionThatIsRandomized(string customMaskScript)
        {
            CreateSurvey(OptionsMaskType.Custom, customMaskScript);
        }


        private void CreateSurvey(OptionsMaskType type, string customMaskScript)
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            const string numbersId = "1";
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.MultipleSelectionQuestion("numbers", (string)null, null,
                            settings =>
                            {
                                settings.OptionsMask = new OptionsMask
                                {
                                    OptionsMaskType = OptionsMaskType.Custom,
                                    CustomOptionsMask = "[1,2,3]"
                                };
                            },
                            create.Option("1"),
                            create.Option("2"),
                            create.Option("3"),
                            create.Option("4"))),
                    create.Page(
                        create.SingleSelectionQuestion("numbers2", (string)null, null, null,
                            create.Option("", referenceListId: null,
                                optionsMask: new OptionsMask
                                {
                                    QuestionId = numbersId,
                                    OptionsMaskType = type,
                                    CustomOptionsMask = customMaskScript
                                })
                            ))));
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}