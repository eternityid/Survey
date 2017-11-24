using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class ScaleQuestionDefinition : SingleSelectionQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.Scale;
    }
}