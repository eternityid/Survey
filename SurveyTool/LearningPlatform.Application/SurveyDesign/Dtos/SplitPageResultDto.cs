using LearningPlatform.Domain.SurveyDesign.Pages;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class SplitPageResultDto
    {
        public PageDefinition SourcePage { get; set; }
        public PageDefinition NewPage { get; set; }
        public string FolderVersion { get; set; }
        public string SurveyVersion { get; set; }
    }
}