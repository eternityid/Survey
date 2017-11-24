using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class MultipleSelectionQuestionDefinition : QuestionWithOptionsDefinition
    {
        public override string Type => QuestionTypeConstants.MultipleSelection;
    }
}