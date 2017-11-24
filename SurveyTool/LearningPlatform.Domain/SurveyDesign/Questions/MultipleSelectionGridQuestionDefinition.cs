using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class MultipleSelectionGridQuestionDefinition : GridQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.MultipleSelectionGrid;
    }
}