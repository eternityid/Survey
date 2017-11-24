using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.QuestionMasking.GivenSurveyWith
{
    [Binding]
    public class ExpressionQuestionMasks
    {
        private readonly PageContext _pageContext;

        public ExpressionQuestionMasks(PageContext pageContext)
        {
            _pageContext = pageContext;
        }

        [Given(@"I have a survey with question q1 and q2 where q2 has expression question mask")]
        public void GivenSurvey()
        {
            var create = ServiceLocator.Resolve<SurveyDesign.Factory>().Invoke();
            MultipleSelectionQuestionDefinition q1;
            MultipleSelectionQuestionDefinition q2;

            Option option;
            Survey survey = create.Survey(
                create.Folder("topFolder",
                    create.Page(
                        (q1 = create.MultipleSelectionQuestion("q1", "q1", "q1", null,
                            create.Option("1"),
                            (option = create.Option("2")),
                            create.Option("3")))),
                    create.Page(
                        (q2 =
                            create.MultipleSelectionQuestion("q2", "q2", "q2", null,
                                create.Option("1"),
                                create.Option("2"),
                                create.Option("3")))),
                    create.Page(
                        create.Information("information", "Information", ""))));

            q2.QuestionMaskExpression = new ExpressionFactory(survey.Id)
                .Question(q1).IsSelected(option).Build();

            _pageContext.LaunchSurvey(survey);
            _pageContext.StartSurvey(survey);
        }
    }
}