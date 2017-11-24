using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class MergeTwoPagesResultDto
    {
        public PageDefinition NewPage { get; set; }
        public string FolderVersion { get; set; }
        public string SurveyVersion { get; set; }
    }
}
