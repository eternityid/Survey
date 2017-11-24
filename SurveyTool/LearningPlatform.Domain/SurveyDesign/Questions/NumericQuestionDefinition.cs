using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class NumericQuestionDefinition : QuestionDefinition
    {
        public double? Step { get; set; }
        public override string Type => QuestionTypeConstants.Numeric;
    }
}