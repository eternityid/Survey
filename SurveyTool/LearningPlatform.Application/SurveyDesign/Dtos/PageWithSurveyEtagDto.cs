using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class PageWithSurveyEtagDto
    {
        public PageDefinition Page { get; set; }
        public string SurveyEtag { get; set; }
    }
}
