using LearningPlatform.Domain.Common;
using LearningPlatform.Domain.SurveyDesign;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.DataCleaning.GivenSurveyWith
{
    [Binding]
    public class ConditionWithScriptBeforeComplete
    {
        private readonly PageContext _pageContext;
        private readonly InstanceContext _instanceContext;

        public ConditionWithScriptBeforeComplete(PageContext pageContext, InstanceContext instanceContext)
        {
            _pageContext = pageContext;
            _instanceContext = instanceContext;
        }

        [Given(@"I have a survey with a condition with true and false branch with script before complete")]
        public void GivenIHaveASurveyWithAConditionWithTrueAndFalseBranch()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();

            var survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        create.SingleSelectionQuestion("gender", "Gender", "Please state your gender", q => q.OrderType = OrderType.InOrder,
                            create.Option("1", text: "male"),
                            create.Option("2", text: "female"))),
                    create.Condition("condition", "questions.gender.answer==='1'",
                        create.Folder("trueFolder",
                            create.Page(
                                create.OpenEndedShortTextQuestion("maleQuestion", "Heading1", "Text1"))),
                        create.Folder("falseFolder",
                            create.Page(
                                create.OpenEndedShortTextQuestion("femaleQuestion", "Heading1", "Text1"),
                                create.OpenEndedShortTextQuestion("femaleQuestion2", "Heading2", "Text2")),
                            create.Page(
                                create.OpenEndedShortTextQuestion("femaleQuestion3", "Heading3", "Text3")))),
                    create.Page(
                        create.Information("info", "Information", "test")),
                    create.Script("script1","questions.gender.answer = '1';"),
                    create.Page(
                        create.Information("Completed", "Completed", "")))
                );

            _pageContext.ClearRepositories();
            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}