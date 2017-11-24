using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class DateQuestionDefinition : QuestionDefinition
    {
        public override string Type => QuestionTypeConstants.Date;
    }
}