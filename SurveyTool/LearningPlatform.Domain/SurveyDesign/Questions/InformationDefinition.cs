using LearningPlatform.Domain.Constants;

namespace LearningPlatform.Domain.SurveyDesign.Questions
{
    public class InformationDefinition : QuestionDefinition
    {
        public override string Type => QuestionTypeConstants.Information;
    }
}