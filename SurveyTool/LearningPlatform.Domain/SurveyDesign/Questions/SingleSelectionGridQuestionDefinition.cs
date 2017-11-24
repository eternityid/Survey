using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class SingleSelectionGridQuestionDefinition : GridQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.SingleSelectionGrid;
    }
}