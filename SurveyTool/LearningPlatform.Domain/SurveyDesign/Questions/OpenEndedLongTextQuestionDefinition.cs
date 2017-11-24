using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class OpenEndedLongTextQuestionDefinition : OpenEndedTextQuestionDefinition
    {
        public int? Rows { get; set; }
        public override string Type => QuestionTypeConstants.LongText;
    }
}