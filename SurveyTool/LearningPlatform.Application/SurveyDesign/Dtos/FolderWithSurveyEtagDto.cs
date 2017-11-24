using LearningPlatform.Domain.SurveyDesign;

namespace LearningPlatform.Application.SurveyDesign.Dtos
{
    public class FolderWithSurveyEtagDto
    {
        public Folder Folder { get; set; }
        public string SurveyEtag { get; set; }
    }
}