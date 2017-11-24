using LearningPlatform.Domain.SurveyDesign.Questions;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class QuestionWithSurveyEtagDto
    {
        public QuestionDefinition Question { get; set; }
        public string SurveyEtag { get; set; }
    }
}