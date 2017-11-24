using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class RatingGridQuestionDefinition : GridQuestionDefinition
    {
        public override string Type => QuestionTypeConstants.RatingGrid;
    }
}
