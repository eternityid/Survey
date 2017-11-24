using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class MoveQuestionWithSurveyEtagDto
    {
        public PageDefinition SourcePage { get; set; }
        public PageDefinition DestinationPage { get; set; }
        public string SurveyEtag { get; set; }
    }
}