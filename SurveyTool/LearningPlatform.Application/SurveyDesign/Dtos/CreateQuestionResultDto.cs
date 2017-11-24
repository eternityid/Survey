using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class CreateQuestionResultDto
    {
        public string PageVersion { get; set; }
        public QuestionDefinition NewQuestion { get; set; }
        public string SurveyVersion { get; set; }
    }
}