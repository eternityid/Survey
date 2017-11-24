using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class ScaleGridQuestionDefinition : GridQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.ScaleGrid;
    }
}
