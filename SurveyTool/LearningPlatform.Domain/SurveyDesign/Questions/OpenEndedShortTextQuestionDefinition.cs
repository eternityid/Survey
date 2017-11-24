using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class OpenEndedShortTextQuestionDefinition : OpenEndedTextQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.ShortText;
    }
}