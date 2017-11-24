using LearningPlatform.Domain.SurveyDesign;
using LearningPlatform.Domain.SurveyDesign.Expressions;
using LearningPlatform.Domain.SurveyDesign.Questions;
using LearningPlatform.Domain.SurveyDesign.Questions.Options;
using TechTalk.SpecFlow;

namespace LearningPlatform.Specs.Features.ImportExportSurveyDef.GivenSurveyWith
{
    [Binding]
    public class ExpressionQuestionMasks
    {
        private readonly SurveyContext _surveyContext;

        public ExpressionQuestionMasks(SurveyContext surveyContext)
        {
            _surveyContext = surveyContext;
        }

        [Given(@"I have a survey expression question mask for export")]
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
                        create.Information("information", "Information"))));
            survey.SurveySettings.SurveyTitle = "New Survey";

            q2.QuestionMaskExpression = new ExpressionFactory("0")
                .Question(q1).IsSelected(option).Build();

            _surveyContext.AddSurvey(survey);
        }
    }
}