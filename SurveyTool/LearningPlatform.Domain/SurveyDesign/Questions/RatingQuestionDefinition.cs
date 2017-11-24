using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class RatingQuestionDefinition : QuestionWithOptionsDefinition
    {
        public string ShapeName { get; set; }
        public override string Type => QuestionTypeConstants.Rating;
    }
}